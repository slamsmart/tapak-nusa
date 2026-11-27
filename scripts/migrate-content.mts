/**
 * Migrates Tapak Nusa content from the archived single-file UI data into
 * Payload: images are uploaded to R2 through the Media collection, then
 * provinces, culture cards, and quiz questions are created in D1.
 *
 * Idempotent: re-running skips records that already exist by their stable key.
 *
 * Usage: node --experimental-strip-types scripts/migrate-content.mts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { additionalProvinceRows, adventures, provinces } from './legacy-content.data.mts'

const REGIONS = new Set(['sumatra', 'java', 'kalimantan', 'sulawesi', 'nusa', 'maluku', 'papua'])

type LegacyCard = {
  label: string
  title: string
  text: string
  source: string
  image: string
  alt: string
  credit: string
}

type LegacyQuestion = {
  q: string
  options: string[]
  answer: number
  why: string
  image: string
  alt: string
  credit: string
}

const regionBySlug = new Map(additionalProvinceRows.map((row) => [row.id, row.region] as const))

const regionFor = (slug: string, island: string): string => {
  const known = regionBySlug.get(slug)
  if (known && REGIONS.has(known)) return known
  const normalized = island.toLowerCase().replace(/[^a-z]/g, '')
  if (normalized.startsWith('sumatra')) return 'sumatra'
  if (normalized.startsWith('jawa')) return 'java'
  if (normalized.startsWith('kalimantan')) return 'kalimantan'
  if (normalized.startsWith('sulawesi')) return 'sulawesi'
  if (normalized.includes('nusatenggara')) return 'nusa'
  if (normalized.startsWith('maluku')) return 'maluku'
  if (normalized.startsWith('papua')) return 'papua'
  throw new Error(`Cannot map island "${island}" (${slug}) to a region`)
}

const slugifyTitle = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Deterministic file name for a source URL. Media is a Payload upload
 * collection, so `filename` (unique) is the stable key used to keep this
 * script idempotent across runs.
 */
const filenameFor = (url: string) => {
  const pathname = new URL(url).pathname
  const segment = pathname.split('/').pop() ?? 'image'
  const extension = /\.(png|jpe?g|webp|gif)$/i.exec(segment)?.[1]?.toLowerCase()
  const base = slugifyTitle(decodeURIComponent(segment.replace(/\.[^.]+$/, '')))
  return `${base.slice(0, 60) || 'image'}.${extension === 'jpeg' ? 'jpg' : (extension ?? 'jpg')}`
}

const payload = await getPayload({ config })

const USER_AGENT = 'TapakNusaContentMigration/1.0 (https://tapak-nusa.figma.site; content seeding)'

/**
 * Wikimedia throttles bursts of anonymous requests. Back off and retry instead
 * of aborting the whole seed run on a transient 429/5xx response.
 */
async function downloadImage(url: string) {
  for (let attempt = 1; ; attempt += 1) {
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })

    if (response.ok) {
      const mimeType = response.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
      return { buffer: Buffer.from(await response.arrayBuffer()), mimeType }
    }

    const retryable = response.status === 429 || response.status >= 500
    if (!retryable || attempt >= 6) {
      throw new Error(`Image download failed (${response.status}): ${url}`)
    }

    const retryAfter = Number(response.headers.get('retry-after'))
    const delay = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : attempt * 2000
    console.log(`  retry ${attempt} in ${delay}ms (${response.status})`)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
}

const mediaCache = new Map<string, number | string>()

async function ensureMedia(url: string, alt: string): Promise<number | string> {
  const cached = mediaCache.get(url)
  if (cached !== undefined) return cached

  const filename = filenameFor(url)

  const existing = await payload.find({
    overrideAccess: true,
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    pagination: false,
  })

  if (existing.docs[0]) {
    const id = existing.docs[0].id
    mediaCache.set(url, id)
    console.log(`  media cached ${filename}`)
    return id
  }

  const { buffer, mimeType } = await downloadImage(url)

  const doc = await payload.create({
    overrideAccess: true,
    collection: 'media',
    data: { alt },
    file: { data: buffer, mimetype: mimeType, name: filename, size: buffer.length },
  })

  console.log(`  media uploaded ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
  mediaCache.set(url, doc.id)
  return doc.id
}

let provinceCount = 0
let cardCount = 0
let questionCount = 0

for (const [index, province] of provinces.entries()) {
  const adventure = adventures[province.id]
  if (!adventure) throw new Error(`Missing adventure for province ${province.id}`)

  const provinceData = {
    slug: province.id,
    name: province.name,
    island: province.island,
    region: regionFor(province.id, province.island),
    latitude: province.lat,
    longitude: province.lng,
    tone: province.tone,
    status: province.status,
    score: province.score ?? null,
    intro: adventure.intro,
    order: index,
  }

  const existingProvince = await payload.find({
    overrideAccess: true,
    collection: 'provinces',
    where: { slug: { equals: province.id } },
    limit: 1,
    pagination: false,
  })

  const provinceDoc =
    existingProvince.docs[0] ??
    (await payload.create({
      overrideAccess: true,
      collection: 'provinces',
      data: provinceData as never,
    }))

  if (!existingProvince.docs[0]) provinceCount += 1
  console.log(`province ${province.name} -> ${provinceDoc.id}`)

  for (const [cardIndex, card] of (adventure.cards as LegacyCard[]).entries()) {
    const cardSlug = `${province.id}-${cardIndex + 1}-${slugifyTitle(card.title)}`
    const existingCard = await payload.find({
      overrideAccess: true,
      collection: 'culture-cards',
      where: { slug: { equals: cardSlug } },
      limit: 1,
      pagination: false,
    })
    if (existingCard.docs[0]) continue

    const imageId = await ensureMedia(card.image, card.alt)
    await payload.create({
      overrideAccess: true,
      collection: 'culture-cards',
      data: {
        slug: cardSlug,
        province: provinceDoc.id,
        label: card.label,
        title: card.title,
        text: card.text,
        source: card.source,
        image: imageId,
        credit: card.credit,
        order: cardIndex,
      } as never,
    })
    cardCount += 1
  }

  for (const [questionIndex, question] of (adventure.questions as LegacyQuestion[]).entries()) {
    const imageId = await ensureMedia(question.image, question.alt)

    const existingQuestion = await payload.find({
      overrideAccess: true,
      collection: 'quiz-questions',
      where: {
        and: [{ province: { equals: provinceDoc.id } }, { order: { equals: questionIndex } }],
      },
      limit: 1,
      pagination: false,
    })
    if (existingQuestion.docs[0]) continue

    await payload.create({
      overrideAccess: true,
      collection: 'quiz-questions',
      data: {
        province: provinceDoc.id,
        prompt: question.q,
        options: question.options.map((text) => ({ text })),
        answer: question.answer,
        explanation: question.why,
        image: imageId,
        credit: question.credit,
        order: questionIndex,
      } as never,
    })
    questionCount += 1
  }
}

console.log(
  `\nDone. provinces=${provinceCount} cards=${cardCount} questions=${questionCount} media=${mediaCache.size}`,
)
process.exit(0)
