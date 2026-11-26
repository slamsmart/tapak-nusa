/**
 * Seeds Tapak Nusa heritage quiz content into Payload: two "peninggalan
 * bersejarah" quiz questions per province (an image-identification question
 * and a fact question), with heritage photos uploaded to R2 through the Media
 * collection.
 *
 * Content source: scripts/heritage-content.json — researched from Indonesian
 * Wikipedia articles scraped via Firecrawl (one heritage landmark per
 * province). Idempotent: media by filename, questions by (province, order).
 *
 * Usage: node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/seed-heritage-quiz.mts
 */
import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

type HeritageEntry = {
  slug: string
  provinceName: string
  heritageName: string
  whatItIs: string
  era: string
  location: string
  imageAlt: string
  factQuestion: string
  factOptions: string[]
  factCorrectIndex: number
  factExplanation: string
  imageUrl: string
  imageFileName: string
  sourcePage: string
  distractorPool: string[]
}

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION', error)
  process.exit(2)
})

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION', error)
  process.exit(2)
})

const entries: HeritageEntry[] = JSON.parse(
  readFileSync(new URL('./heritage-content.json', import.meta.url), 'utf8'),
)

const IDENTIFY_ORDER = 20
const FACT_ORDER = 21
const CREDIT = 'Wikimedia Commons'

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

const USER_AGENT = 'TapakNusaContentSeeding/1.0 (https://tapaknusa.web.id; heritage quiz seeding)'

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

const digestOf = (value: string) =>
  [...value].reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7)

/**
 * Three distinct heritage names from other provinces, deterministically picked
 * so re-running the seed produces the same options every time.
 */
function pickDistractors(slug: string, correct: string, pool: string[]): string[] {
  const filtered = pool.filter((name) => name !== correct)
  const digest = digestOf(slug)
  const picks: string[] = []
  for (let step = 0; picks.length < 3; step += 1) {
    const name = filtered[(digest + step * 7) % filtered.length]
    if (!picks.includes(name)) picks.push(name)
  }
  return picks
}

const payload = await getPayload({ config })

let questionCount = 0
let updatedCount = 0
const missingProvinces: string[] = []

for (const entry of entries) {
  const provinceFind = await retryOperation(`province find ${entry.slug}`, () =>
    payload.find({
      overrideAccess: true,
      collection: 'provinces',
      where: { slug: { equals: entry.slug } },
      limit: 1,
      pagination: false,
    }),
  )
  const provinceDoc = provinceFind.docs[0]
  if (!provinceDoc) {
    missingProvinces.push(entry.slug)
    continue
  }

  const mediaId = await ensureMedia(entry.imageUrl, entry.imageAlt)
  const sourceSuffix = ` Sumber materi: Wikipedia (${entry.sourcePage}).`
  const identifyExplanation = `${entry.whatItIs}.${sourceSuffix}`
  const factExplanation = `${entry.factExplanation}.${sourceSuffix}`

  const digest = digestOf(entry.slug)
  const distractors = pickDistractors(entry.slug, entry.heritageName, entry.distractorPool)
  const identifyOptions = [...distractors]
  identifyOptions.splice(digest % 4, 0, entry.heritageName)

  const heritageQuestions = [
    {
      order: IDENTIFY_ORDER,
      prompt: `Peninggalan bersejarah apa yang ditampilkan pada gambar ini dari ${entry.provinceName}?`,
      options: identifyOptions.map((text) => ({ text })),
      answer: identifyOptions.indexOf(entry.heritageName),
      explanation: identifyExplanation,
    },
    {
      order: FACT_ORDER,
      prompt: entry.factQuestion,
      options: entry.factOptions.map((text) => ({ text })),
      answer: entry.factCorrectIndex,
      explanation: factExplanation,
    },
  ]

  for (const question of heritageQuestions) {
    const existingQuestion = await retryOperation(
      `question find ${entry.slug} ${question.order}`,
      () =>
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

      await retryOperation(`question update ${entry.slug} ${question.order}`, () =>
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
      console.log(`question reconciled ${entry.provinceName} order=${question.order}`)
      continue
    }

    await retryOperation(`question create ${entry.slug} ${question.order}`, () =>
      payload.create({
        overrideAccess: true,
        collection: 'quiz-questions',
        data: {
          province: provinceDoc.id,
          prompt: question.prompt,
          options: question.options,
          answer: question.answer,
          explanation: question.explanation,
          image: mediaId,
          credit: CREDIT,
          order: question.order,
        } as never,
      }),
    )
    questionCount += 1
    console.log(`question ${entry.provinceName} order=${question.order}`)
  }
}

if (missingProvinces.length) {
  console.error(`Missing provinces in DB: ${missingProvinces.join(', ')}`)
  process.exit(1)
}

console.log(
  `\nDone. questions=${questionCount} reconciled=${updatedCount} media=${mediaCache.size}`,
)
process.exit(0)
