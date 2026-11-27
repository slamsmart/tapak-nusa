import { NextResponse } from 'next/server'

import { verifyTurnstileToken } from '@/lib/turnstile'

export async function POST(request: Request) {
  let body: { token?: unknown }
  try {
    body = (await request.json()) as { token?: unknown }
  } catch {
    return NextResponse.json({ success: false, error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  if (typeof body.token !== 'string') {
    return NextResponse.json(
      { success: false, error: 'Token verifikasi tidak valid.' },
      { status: 400 },
    )
  }

  const verification = await verifyTurnstileToken(body.token)
  if (!verification.ok) {
    if (verification.reason === 'unconfigured') {
      return NextResponse.json(
        { success: false, error: 'Cloudflare Turnstile belum dikonfigurasi.' },
        { status: 503 },
      )
    }
    if (verification.reason === 'unavailable') {
      return NextResponse.json(
        { success: false, error: 'Layanan verifikasi sedang tidak tersedia.' },
        { status: 502 },
      )
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Verifikasi keamanan belum berhasil. Silakan coba kembali.',
      },
      { status: 400 },
    )
  }

  return NextResponse.json({ success: true })
}
