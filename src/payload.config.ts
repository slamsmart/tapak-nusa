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
import { Tags } from './collections/Tags'
import { getBindings } from './lib/cloudflare'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// The D1 binding and the R2 bucket only exist inside a Worker request context or
// Wrangler's platform proxy, so the adapter is wired from resolved bindings
// rather than from static config.
const { DB, MEDIA_BUCKET } = await getBindings()

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
  ],
  db: sqliteD1Adapter({ binding: DB }),
  secret: process.env.PAYLOAD_SECRET,
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
