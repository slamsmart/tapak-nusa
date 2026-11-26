import type { Media, Province as ProvinceDoc } from '@/payload-types'
import { getPayloadClient } from './payload'

/**
 * Reads the published Tapak Nusa content out of Payload (D1) and reshapes it
 * into the structures the client app renders. This is the single seam between
 * the CMS and the UI: nothing downstream hardcodes provinces, cards, or
 * questions.
 *
 * Quiz answers stay server-side. `answer` and `explanation` are graded in
 * `src/app/(frontend)/api/quiz/check/route.ts`, so anonymous clients can never
 * read the key from this payload.
 */
export type SiteProvince = {
  id: string
  name: string
  island: string
  x: number
  y: number
  tone: string
}

export type SiteCard = {
  label: string
  title: string
  text: string
  source: string
  image: string
  alt: string
  credit: string
}

export type SiteQuestion = {
  id: number
  q: string
  options: string[]
  image: string
  alt: string
  credit: string
}

export type SiteAdventure = {
  province: string
  intro: string
  cards: SiteCard[]
  questions: SiteQuestion[]
}

export type SiteContent = {
  provinces: SiteProvince[]
  adventures: Record<string, SiteAdventure>
  regionCount: number
}

type PopulatedProvince = number | ProvinceDoc | null | undefined
type PopulatedMedia = number | Media | null | undefined

export async function loadSiteContent(): Promise<SiteContent> {
  const payload = await getPayloadClient()

  // Ordered globally; grouping below preserves each province's own order.
  const [provinceResult, cardResult, questionResult] = await Promise.all([
    payload.find({ collection: 'provinces', sort: 'order', depth: 0, pagination: false }),
    payload.find({ collection: 'culture-cards', sort: 'order', depth: 1, pagination: false }),
    payload.find({ collection: 'quiz-questions', sort: 'order', depth: 1, pagination: false }),
  ])

  const provinces: SiteProvince[] = provinceResult.docs.map((doc) => ({
    id: doc.slug,
    name: doc.name,
    island: doc.island,
    x: doc.mapX,
    y: doc.mapY,
    tone: doc.tone,
  }))

  const adventures: Record<string, SiteAdventure> = {}
  for (const doc of provinceResult.docs) {
    adventures[doc.slug] = { province: doc.name, intro: doc.intro, cards: [], questions: [] }
  }

  for (const card of cardResult.docs) {
    const province: PopulatedProvince = card.province
    const adventure = province && typeof province === 'object' ? adventures[province.slug] : undefined
    if (!adventure) continue
    const image: PopulatedMedia = card.image
    const media = image && typeof image === 'object' ? image : null
    adventure.cards.push({
      label: card.label,
      title: card.title,
      text: card.text,
      source: card.source,
      image: media?.url ?? '',
      alt: media?.alt ?? '',
      credit: card.credit,
    })
  }

  for (const question of questionResult.docs) {
    const province: PopulatedProvince = question.province
    const adventure = province && typeof province === 'object' ? adventures[province.slug] : undefined
    if (!adventure) continue
    const image: PopulatedMedia = question.image
    const media = image && typeof image === 'object' ? image : null
    adventure.questions.push({
      id: question.id,
      q: question.prompt,
      options: question.options.map((option) => option.text),
      image: media?.url ?? '',
      alt: media?.alt ?? '',
      credit: question.credit,
    })
  }

  return {
    provinces,
    adventures,
    regionCount: new Set(provinceResult.docs.map((doc) => doc.region)).size,
  }
}