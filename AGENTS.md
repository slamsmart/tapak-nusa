# tapak-nusa

Culture-exploration game for Indonesia: 38 provinces, story cards, image quizzes.
Next.js 16 (App Router, React 19) + Payload 4 CMS + Cloudflare D1/R2, deployed as
a Worker through OpenNext. Styling is Tailwind CSS v4.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Next dev server on `$PORT` (default 3000), binds `0.0.0.0` |
| `pnpm build` | `next build` with the Cloudflare build phase set |
| `pnpm build:worker` | OpenNext bundle for Cloudflare |
| `pnpm start` | `opennextjs-cloudflare preview` (local Worker preview) |
| `pnpm run deploy:worker` | Build (with build-phase env) + deploy the Worker |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm cf:typegen` | `wrangler types` → `worker-configuration.d.ts` (keep this file tracked: `src/lib/cloudflare.ts` and `tsconfig.json` depend on it) |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` |
| `pnpm generate:importmap` | Regenerate the admin import map after admin component changes |
| `pnpm generate:db-schema` | Regenerate `src/payload-generated-schema.ts` after collection changes |
| `pnpm d1:migrate:local` / `pnpm d1:migrate:remote` | Apply D1 migrations locally / to the remote database |

Content seeds are scripts, not part of the build. Example:

```bash
node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/seed-music-content.mts
```

A dev server is normally already running; do not start a second one in the same
directory (Next 16 refuses it and exits with code 1).

## Layout

- `src/app/(frontend)/` — public app, route handlers, global styles.
- `src/app/(payload)/` — Payload admin, REST, GraphQL. Generated; do not edit.
- `src/collections/` — `provinces`, `culture-cards`, `quiz-questions`, `media`,
  `tags`, `folders`, `admins`.
- `src/lib/content.ts` — the one seam between Payload and the UI
  (`loadSiteContent()`); nothing downstream hardcodes content.
- `src/lib/payload.ts` — `getPayloadClient()`, `findBySlug()`, `findByField()`.
  Use these instead of writing new Local API queries in routes.
- `src/lib/cloudflare.ts` — binding types derived from `worker-configuration.d.ts`.
- `src/app/(frontend)/tapak-nusa.tsx` — the client app (map, learn modal, quiz,
  profile). Server-rendered data arrives as the `content` prop.
- `src/data/music-content.ts` — seed source for the music cards; it is not
  imported by app code.
- `src/migrations/`, `scripts/` — D1 migrations and one-off maintenance scripts.
- `.figma/make/` — Figma Make lifecycle scripts. Keep them.

## Data flow

`src/app/(frontend)/page.tsx` is a server component with
`export const dynamic = 'force-dynamic'`: every request reads the three content
collections from D1 through `loadSiteContent()` and passes plain props to the
client app. Admin edits appear on the next request; there is no ISR cache in
front of it, so there is nothing to revalidate.

- Durable data lives in D1 (`DB` binding → `tapak-nusa-db`, remote), uploads in
  R2 (`MEDIA_BUCKET` → `tapak-nusa-media`). See `wrangler.jsonc`.
- Payload serves uploads at `/api/media/file/<filename>`; `media.url` is already
  a same-origin relative URL. Pass it straight to `img`/`next/image`
  (`images.unoptimized` is on).
- `workerd`-specific globals (`D1Database`, `R2Bucket`) only exist in
  `worker-configuration.d.ts`; do not re-declare them.

## Payload rules

- Quiz integrity: `quiz-questions.answer` and `.explanation` have field-level
  `read` access limited to `admins`, so they never appear in REST, GraphQL, or
  the RSC payload. Grading happens server-side in
  `src/app/(frontend)/api/quiz/check/route.ts` (`overrideAccess: true`); the
  client only learns `{ correct, explanation }` after answering. Never ship the
  answer key to the browser, and never grade in client code.
- Public read access is open on `provinces`, `culture-cards`, `quiz-questions`,
  `media`, `tags`, `folders`; create/update/delete require an `admins` user.
  Keep it that way when adding collections.
- Validate user-facing input on the server and return structured errors.
- Enforce durable invariants (relationships, allowed values, ownership) at the
  collection boundary, not only in a route handler.
- Preserve the ID types generated in `payload-types.ts`; D1 IDs are integers.
- User-facing Local API calls set `overrideAccess: false` and pass the
  authenticated `user` when one exists. `overrideAccess: true` is reserved for
  trusted server reads such as content loading and quiz grading.
- `payload.config.ts` already wires `sqliteD1Adapter` and `r2Storage`. Do not add
  a `db` adapter, cloud-storage plugin, or OAuth/auth plugin; do not commit
  migrations by hand — generate them.
- `admins` is CMS-only (Figma SSO). There is no app login yet: the dashboard
  uses a demo user in `localStorage`, and premium is an external Mayar checkout
  link with no entitlement check. Public app accounts would need a separate
  auth-enabled `users` collection; do not reuse `admins` for that.

## Styling

Tailwind v4 utilities in JSX. `src/app/(frontend)/styles.css` holds the
`@import "tailwindcss"`, theme tokens, global base styles, and the app-specific
class rules the client app relies on (`.pin`, `.quiz-modal`, `.collection-grid`,
…). Prefer utilities for new UI; extend `styles.css` only for genuinely shared,
non-utility patterns.

## Secrets

- `PAYLOAD_SECRET` is required at runtime (`payload.config.ts` throws without
  it). Local and CLI runs read it from `.env`; deployed environments provide it
  as a Worker secret. Never hardcode it, and never expose secrets to client code.
- `MAYAR_API_KEY` is not used by app code today (premium is an external link).
- `NEXT_PUBLIC_*` values are bundled into the browser; treat them as public.

## Verification

There is no test suite. For changes, run `pnpm typecheck` plus `pnpm build`, then
exercise the affected route in the running dev server (`/`, `/api/quiz/check`,
`/admin`). Check rendered pins, collection cards, quiz flow, and that images
return nonzero dimensions.
