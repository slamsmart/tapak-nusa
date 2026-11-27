import { NextResponse } from 'next/server'
import { createPayloadRequestFromWebRequest } from 'payload'

import { getBindings } from '@/lib/cloudflare'
import { getPayloadClient } from '@/lib/payload'
import type { User } from '@/payload-types'

const MAX_AVATAR_BYTES = 2 * 1024 * 1024
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'image/jpeg',
  'image/png': 'image/png',
  'image/webp': 'image/webp',
}

/**
 * Resolves the signed-in public user from the payload-token session cookie.
 * Mirrors the auth-route conventions: the Local API runs with the request's
 * own session, never trusting client-supplied identity.
 */
async function sessionUser(request: Request): Promise<User | null> {
  const payload = await getPayloadClient()
  const req = await createPayloadRequestFromWebRequest({ config: payload.config, request })
  const { user } = await payload.auth({ headers: request.headers, req })
  return user?.collection === 'users' ? (user as User) : null
}

/**
 * Profile picture, stored in Cloudflare R2 (MEDIA_BUCKET) under
 * avatars/<userId>. Uploads overwrite the same key, so replacing a photo
 * never leaves orphaned objects. The column on the users collection is only
 * written here (overrideAccess): self-service updates remain name-only by
 * the collection hook.
 */
export async function POST(request: Request) {
  const payload = await getPayloadClient()
  const user = await sessionUser(request)
  if (!user) {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Masuk dulu untuk mengubah foto profil.' },
      { status: 401 },
    )
  }

  let form: FormData | null = null
  try {
    form = await request.formData()
  } catch {
    form = null
  }
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'invalid_file', message: 'Lampirkan berkas foto profil.' },
      { status: 400 },
    )
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json(
      { error: 'invalid_type', message: 'Format foto harus JPEG, PNG, atau WebP.' },
      { status: 400 },
    )
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return NextResponse.json(
      { error: 'too_large', message: 'Ukuran foto maksimal 2MB.' },
      { status: 400 },
    )
  }

  const key = `avatars/${user.id}`
  const bytes = new Uint8Array(await file.arrayBuffer())
  const { MEDIA_BUCKET } = await getBindings()
  await MEDIA_BUCKET.put(key, bytes, {
    httpMetadata: { contentType: file.type },
  })
  await payload.update({
    collection: 'users',
    id: user.id,
    data: { avatar: key },
    overrideAccess: true,
  })

  return NextResponse.json({ ok: true, avatar: key })
}

/**
 * Serves the signed-in user's own picture straight from R2. Guests (and
 * other users) get 401 — avatars are personal and the dashboard is the only
 * consumer, so there is no public enumeration surface.
 */
export async function GET(request: Request) {
  const user = await sessionUser(request)
  if (!user) {
    return new NextResponse(null, { status: 401 })
  }
  if (!user.avatar) {
    return new NextResponse(null, { status: 404 })
  }
  const { MEDIA_BUCKET } = await getBindings()
  const object = await MEDIA_BUCKET.get(user.avatar)
  if (!object) {
    return new NextResponse(null, { status: 404 })
  }
  return new NextResponse(object.body, {
    headers: {
      'content-type': object.httpMetadata?.contentType ?? 'image/jpeg',
      'cache-control': 'no-store',
    },
  })
}
