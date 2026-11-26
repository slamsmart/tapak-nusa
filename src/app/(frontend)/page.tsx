import { loadSiteContent } from '@/lib/content'
import TapakNusa from './tapak-nusa'

// Content is admin-editable, so the shell is rendered per request against D1
// rather than frozen at build time. The queries are three indexed reads.
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const content = await loadSiteContent()
  return <TapakNusa content={content} />
}
