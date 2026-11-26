import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import withPayload from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Exposes the wrangler.jsonc D1/R2 bindings to `next dev` through the Worker
// execution context, so the Payload config resolves the same bindings the
// deployed Worker uses. Skipped during production builds: they have no use for
// a live binding session, and each remote preview handshake is a separate
// workerd process. The build scripts set NEXT_PHASE up front so both the parent
// build and its page-data workers skip this (Next itself only sets it later).
if (process.env.NEXT_PHASE !== 'phase-production-build') {
  initOpenNextCloudflareForDev()
}

// The dev server runs continuously in this workspace, so it builds into its own
// dist dir. Sharing `.next` with a production OpenNext build makes Next fail its
// dist lock check ("Another next build process is already running") or clean
// files out from under the in-flight build.
const nextConfig: NextConfig = {
  // The dev server is reached from 127.0.0.1/localhost during local work;
  // Next 16 blocks cross-origin dev resources (HMR, RSC) without this list.
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  images: {
    // Payload returns absolute R2/Payload URLs; the browser fetches them directly.
    unoptimized: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
