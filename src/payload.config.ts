import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Admins } from './collections/Admins'
import { CultureCards } from './collections/CultureCards'
import { CultureEntries } from './collections/CultureEntries'
import { Folders } from './collections/Folders'
import { Media } from './collections/Media'
import { Provinces } from './collections/Provinces'
import { QuizQuestions } from './collections/QuizQuestions'
import { Users } from './collections/Users'
import { Tags } from './collections/Tags'
import { getBindings } from './lib/cloudflare'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// The D1 binding and the R2 bucket only exist inside a Worker request context or
// Wrangler's platform proxy, so the adapter is wired from resolved bindings
// rather than from static config.
const { DB, MEDIA_BUCKET } = await getBindings()

// `wrangler types` types process.env from .env, so the compiler cannot see that
// a deploy without the Worker secret would boot Payload with an undefined
// signing key (silently broken admin sessions). Fail loudly instead.
const secret = process.env.PAYLOAD_SECRET
if (!secret) {
  throw new Error(
    'PAYLOAD_SECRET is missing. Set it in .env for local and CLI runs, and as a Worker secret for deploys.',
  )
}

export default buildConfig({
  admin: {
    user: Admins.slug,
    constrainWidth: true,
    components: {
      beforeDashboard: ['/admin/TapakNusaAdmin#TapakNusaAdminDashboard'],
      graphics: {
        Icon: '/admin/TapakNusaAdmin#TapakNusaAdminIcon',
        Logo: '/admin/TapakNusaAdmin#TapakNusaAdminLogo',
      },
    },
    dashboard: {
      widgets: [],
      defaultLayout: [{ widgetSlug: 'collections', width: 'full' }],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Admins,
    Media,
    Folders,
    Tags,
    Provinces,
    CultureCards,
    QuizQuestions,
    CultureEntries,
    Users,
  ],
  // Schema changes flow through generated migrations (payload migrate), never
  // drizzle pushes: the D1 binding is the shared remote database, and pushes
  // there have repeatedly wedged boot (rename prompts, redundant CREATE INDEX).
  db: sqliteD1Adapter({ binding: DB, push: false }),
  secret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  localization: {
    locales: [{ code: 'en', label: 'English' }],
    fallback: true,
    defaultLocale: 'en',
  },
  storage: [
    r2Storage({
      bucket: MEDIA_BUCKET,
      collections: { media: true },
    }),
  ],
})
