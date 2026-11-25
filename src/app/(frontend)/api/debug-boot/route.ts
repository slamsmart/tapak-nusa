import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * TEMPORARY deployment debug route. Returns payload boot diagnostics as JSON.
 * Remove after the production 500 is diagnosed.
 */
export async function GET() {
  const steps: Record<string, unknown> = {}
  const stage = (name: string, fn: () => Promise<unknown>) =>
    fn()
      .then((result) => {
        steps[name] = result === undefined ? 'ok' : result
      })
      .catch((error: unknown) => {
        steps[name] = error instanceof Error ? error.message : String(error)
        throw error
      })

  try {
    await stage('context', async () => {
      const ctx = globalThis[Symbol.for('__cloudflare-context__')] as
        | { env?: Record<string, unknown> }
        | undefined
      return {
        hasContext: Boolean(ctx),
        hasDB: Boolean(ctx?.env?.DB),
        hasBucket: Boolean(ctx?.env?.MEDIA_BUCKET),
        ua: navigator.userAgent,
      }
    }).catch((e) => e)

    steps.secret = Boolean(process.env.PAYLOAD_SECRET)

    try {
      const { getPayload } = await import('payload')
      const config = (await import('@/payload.config')).default
      steps.configLoaded = true
      const payload = await getPayload({ config })
      steps.payloadBooted = true
      const admins = await payload.count({ collection: 'admins' })
      steps.adminCount = admins.totalDocs
    } catch (error) {
      steps.payload = error instanceof Error ? error.message : String(error)
      steps.payloadStack = error instanceof Error ? error.stack?.slice(0, 1200) : null
      return NextResponse.json({ ok: false, steps }, { status: 500 })
    }

    return NextResponse.json({ ok: true, steps })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        steps,
        outer: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
