/**
 * Seeds Tapak Nusa music content into Payload: one traditional music
 * instrument culture card plus two music quiz questions per province, with
 * instrument images uploaded to R2 through the Media collection.
 *
 * Content source: src/data/music-content.ts (research-backed dataset).
 * Idempotent: re-running skips media by filename, cards by slug, and quiz
 * questions by (province, order).
 *
 * Usage: node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/seed-music-content.mts
 */
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import {
  musicCardImages,
  musicDistractors,
  musicEntries,
  musicQuizImages,
} from '../src/data/music-content.ts'

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error)
  process.exit(2)
})

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION', error)
  process.exit(2)
})

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

/**
 * The Wrangler platform proxy occasionally aborts mid-operation while talking
 * to remote D1/R2. Retry transient failures instead of losing the whole run.
 */
async function retryOperation<T>(label: string, operation: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      if (attempt >= 4) throw error
      const delay = attempt * 3000
      console.log(`  ${label} failed (attempt ${attempt}), retrying in ${delay}ms:`, String(error).slice(0, 200))
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

const payload = await getPayload({ config })

const USER_AGENT = 'TapakNusaContentSeeding/1.0 (https://tapak-nusa.figma.site; content seeding)'

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

  const existing = await retryOperation(`media find ${filename}`, () =>
    payload.find({
      overrideAccess: true,
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
      pagination: false,
    }),
  )

  if (existing.docs[0]) {
    const id = existing.docs[0].id
    mediaCache.set(url, id)
    console.log(`  media cached ${filename}`)
    return id
  }

  const { buffer, mimeType } = await downloadImage(url)
  const doc = await retryOperation(`media upload ${filename}`, () =>
    payload.create({
      overrideAccess: true,
      collection: 'media',
      data: { alt },
      file: { data: buffer, mimetype: mimeType, name: filename, size: buffer.length },
    }),
  )

  console.log(`  media uploaded ${filename} (${(buffer.length / 1024).toFixed(0)} KB)`)
  mediaCache.set(url, doc.id)
  return doc.id
}

let cardCount = 0
let updatedCount = 0
let questionCount = 0
const missingProvinces: string[] = []

for (const [provinceId, entry] of Object.entries(musicEntries)) {
  const provinceFind = await retryOperation(`province find ${provinceId}`, () =>
    payload.find({
      overrideAccess: true,
      collection: 'provinces',
      where: { slug: { equals: provinceId } },
      limit: 1,
      pagination: false,
    }),
  )
  const provinceDoc = provinceFind.docs[0]
  if (!provinceDoc) {
    missingProvinces.push(provinceId)
    continue
  }

  const cardSlug = `${provinceId}-4-${slugifyTitle(entry.instrument)}`
  const existingCard = await retryOperation(`card find ${cardSlug}`, () =>
    payload.find({
      overrideAccess: true,
      collection: 'culture-cards',
      where: { slug: { equals: cardSlug } },
      limit: 1,
      pagination: false,
    }),
  )
  if (!existingCard.docs[0]) {
    const imageId = await ensureMedia(musicCardImages[provinceId], entry.alt)
    await retryOperation(`card create ${cardSlug}`, () =>
      payload.create({
        overrideAccess: true,
        collection: 'culture-cards',
        data: {
          slug: cardSlug,
          province: provinceDoc.id,
          label: 'Alat musik',
          title: entry.instrument,
          text: entry.text,
          source: entry.source,
          image: imageId,
          credit: entry.credit,
          order: 3,
        } as never,
      }),
    )
    cardCount += 1
    console.log(`card ${cardSlug}`)
  }

  const alternatives = musicDistractors(provinceId)
  const identifyOptions = [entry.instrument, ...alternatives]

  const musicQuestions = [
    {
      order: 5,
      prompt: `Alat musik apa yang ditampilkan pada gambar dari ${provinceDoc.name} ini?`,
      options: identifyOptions.map((text) => ({ text })),
      answer: 0,
      explanation: entry.text,
      image: musicQuizImages[provinceId],
      credit: entry.credit,
    },
    {
      order: 6,
      prompt: entry.fact.q,
      options: entry.fact.options.map((text) => ({ text })),
      answer: entry.fact.answer,
      explanation: entry.fact.why,
      image: musicQuizImages[provinceId],
      credit: entry.credit,
    },
  ]

  for (const question of musicQuestions) {
    const existingQuestion = await retryOperation(`question find ${provinceId} ${question.order}`, () =>
      payload.find({
        overrideAccess: true,
        collection: 'quiz-questions',
        where: {
          and: [
            { province: { equals: provinceDoc.id } },
            { order: { equals: question.order } },
          ],
        },
        limit: 1,
        pagination: false,
      }),
    )
    const existingDoc = existingQuestion.docs[0]
    if (existingDoc) {
      const optionsDiffer =
        JSON.stringify(existingDoc.options.map((option) => option.text)) !==
        JSON.stringify(question.options.map((option) => option.text))
      const promptDiffer = existingDoc.prompt !== question.prompt
      const explanationDiffer = existingDoc.explanation !== question.explanation
      if (!optionsDiffer && !promptDiffer && !explanationDiffer) continue

      await retryOperation(`question update ${provinceId} ${question.order}`, () =>
        payload.update({
          overrideAccess: true,
          collection: 'quiz-questions',
          id: existingDoc.id,
          data: {
            prompt: question.prompt,
            options: question.options,
            answer: question.answer,
            explanation: question.explanation,
          } as never,
        }),
      )
      updatedCount += 1
      console.log(`question reconciled ${provinceDoc.name} order=${question.order}`)
      continue
    }

    const imageId = await ensureMedia(question.image, entry.alt)
    await retryOperation(`question create ${provinceId} ${question.order}`, () =>
      payload.create({
        overrideAccess: true,
        collection: 'quiz-questions',
        data: {
          province: provinceDoc.id,
          prompt: question.prompt,
          options: question.options,
          answer: question.answer,
          explanation: question.explanation,
          image: imageId,
          credit: question.credit,
          order: question.order,
        } as never,
      }),
    )
    questionCount += 1
    console.log(`question ${provinceDoc.name} order=${question.order}`)
  }
}

if (missingProvinces.length) {
  console.error(`Missing provinces in DB: ${missingProvinces.join(', ')}`)
  process.exit(1)
}

console.log(
  `\nDone. cards=${cardCount} questions=${questionCount} reconciled=${updatedCount} media=${mediaCache.size}`,
)
process.exit(0)
