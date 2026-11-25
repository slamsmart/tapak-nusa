import { NextResponse } from 'next/server'

type TurnstileResponse = {
  success: boolean
  'error-codes'?: string[]
}

export async function POST(request: Request) {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  if (!secret) {
    return NextResponse.json(
      { success: false, error: 'Cloudflare Turnstile belum dikonfigurasi.' },
      { status: 503 },
    )
  }

  let body: { token?: unknown }
  try {
    body = (await request.json()) as { token?: unknown }
  } catch {
    return NextResponse.json({ success: false, error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  if (typeof body.token !== 'string' || body.token.length < 10 || body.token.length > 4096) {
    return NextResponse.json(
      { success: false, error: 'Token verifikasi tidak valid.' },
      { status: 400 },
    )
  }

  const verificationBody = new URLSearchParams({
    secret,
    response: body.token,
  })

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: verificationBody,
      cache: 'no-store',
    })
    const result = (await response.json()) as TurnstileResponse
    if (!response.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Verifikasi keamanan belum berhasil. Silakan coba kembali.',
          codes: result['error-codes'] ?? [],
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Layanan verifikasi sedang tidak tersedia.' },
      { status: 502 },
    )
  }
}
