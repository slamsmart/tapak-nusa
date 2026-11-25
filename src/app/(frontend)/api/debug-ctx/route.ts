import { NextResponse } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'

export const dynamic = 'force-dynamic'

/**
 * TEMPORARY deployment debug route: isolates the `@opennextjs/cloudflare`
 * context import. Remove after diagnosing the production 500.
 */
export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true })
    const envRecord = env as Record<string, unknown> | undefined
    return NextResponse.json({
      ok: true,
      hasDB: Boolean(envRecord?.DB),
      hasBucket: Boolean(envRecord?.MEDIA_BUCKET),
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
