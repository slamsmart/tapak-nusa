import { getCloudflareContext } from '@opennextjs/cloudflare'
import { createRequire } from 'node:module'
import type * as Wrangler from 'wrangler'

export type Bindings = {
  DB: D1Database
  MEDIA_BUCKET: R2Bucket
}

let proxyBindings: Promise<Bindings> | undefined

/**
 * Resolves Wrangler's platform proxy without a static specifier.
 *
 * Only the CLI path reaches this: `payload` commands and seed scripts run in
 * plain Node with no Worker context. A static `import('wrangler')` would drag
 * Miniflare into the Worker bundle, whose Pino/thread-stream test fixtures fail
 * Worker module validation on deploy. The specifier is assembled at runtime so
 * both Next's bundler and Wrangler's own bundling leave it alone.
 *
 * Everything here runs lazily: `createRequire(import.meta.url)` throws when a
 * CJS-wrapped chunk is evaluated inside workerd (deployed Worker), so it must
 * never execute at module scope.
 */
function loadPlatformProxy() {
  const requireFromHere = createRequire(import.meta.url)
  const wranglerSpecifier = ['wrang', 'ler'].join('')
  const { getPlatformProxy } = requireFromHere(wranglerSpecifier) as typeof Wrangler
  return getPlatformProxy
}

/**
 * Resolve Cloudflare bindings.
 *
 * Inside the Worker (and `next dev` via `initOpenNextCloudflareForDev`) the
 * OpenNext context is authoritative. CLI scripts and `payload` commands run in
 * plain Node, where no request context exists, so fall back to Wrangler's
 * platform proxy configured against the remote D1/R2 resources.
 */
export async function getBindings(): Promise<Bindings> {
  try {
    const { env } = await getCloudflareContext({ async: true })
    if (env.DB && env.MEDIA_BUCKET) return env as Bindings
  } catch {
    // No Worker context: fall through to the Wrangler platform proxy.
  }

  // Inside the deployed Worker there is no platform proxy and no filesystem
  // node_modules: importing Wrangler there always throws. Detect the Workers
  // runtime (userAgent is fixed by the platform) and surface a clear error.
  if (navigator.userAgent === 'Cloudflare-Workers') {
    throw new Error(
      'Cloudflare bindings (DB, MEDIA_BUCKET) are unavailable inside the Worker request context.',
    )
  }

  proxyBindings ??= (async () => {
    const getPlatformProxy = loadPlatformProxy()
    // The payload config is evaluated at build time and bakes the binding into
    // the Worker bundle, so this proxy MUST resolve the remote D1/R2 resources
    // (the wrangler.jsonc defaults). A local fallback would ship an empty local
    // database and a throwaway R2 bucket into production.
    const { env } = await getPlatformProxy<Bindings>({
      configPath: './wrangler.jsonc',
    })
    return env
  })()

  return proxyBindings
}
