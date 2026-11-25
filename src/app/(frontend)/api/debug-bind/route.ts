import { NextResponse } from 'next/server'
import { getBindings } from '@/lib/cloudflare'

export const dynamic = 'force-dynamic'

/**
 * TEMPORARY deployment debug route: exercises only the Cloudflare binding
 * resolution used by the Payload config. Remove after diagnosing the
 * production 500.
 */
export async function GET() {
  try {
    const env = await getBindings()
    const hasDB = Boolean((env as { DB?: unknown }).DB)
    const hasBucket = Boolean((env as { MEDIA_BUCKET?: unknown }).MEDIA_BUCKET)
    return NextResponse.json({ ok: true, hasDB, hasBucket })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack?.slice(0, 1000) : null,
      },
      { status: 500 },
    )
  }
}
