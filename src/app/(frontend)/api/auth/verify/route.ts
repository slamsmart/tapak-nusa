import { NextResponse } from 'next/server'

import { findUserByEmail } from '@/lib/auth'
import { OTP_MAX_ATTEMPTS, otpCodeMatches } from '@/lib/otp'
import { getPayloadClient } from '@/lib/payload'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const codePattern = /^\d{6}$/

/**
 * Confirms a registration OTP. On success the account is marked verified and
 * all OTP bookkeeping is cleared; no session is created here — the client
 * follows up with /api/auth/login.
 */
export async function POST(request: Request) {
  let body: { email?: unknown; code?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Permintaan tidak valid.' },
      { status: 400 },
    )
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const code = typeof body.code === 'string' ? body.code.trim() : ''

  if (!emailPattern.test(email) || !codePattern.test(code)) {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Masukkan email dan kode verifikasi 6 digit.' },
      { status: 400 },
    )
  }

  const payload = await getPayloadClient()
  const user = await findUserByEmail(payload, email)

  // Unknown email or no pending code: identical generic response, no enumeration.
  if (!user || !user.otpHash) {
    return NextResponse.json(
      { error: 'invalid_code', message: 'Kode verifikasi salah.' },
      { status: 400 },
    )
  }
  if (user.verified) {
    return NextResponse.json(
      { error: 'already_verified', message: 'Akun sudah terverifikasi. Silakan masuk.' },
      { status: 400 },
    )
  }
  if ((user.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: 'otp_attempts_exceeded', message: 'Terlalu banyak percobaan. Minta kode baru.' },
      { status: 429 },
    )
  }
  if (user.otpExpires && Date.parse(user.otpExpires) < Date.now()) {
    return NextResponse.json(
      { error: 'otp_expired', message: 'Kode sudah kedaluwarsa. Minta kode baru.' },
      { status: 400 },
    )
  }

  if (!otpCodeMatches(code, user.otpHash)) {
    const attempts = (user.otpAttempts ?? 0) + 1
    await payload.update({
      collection: 'users',
      id: user.id,
      data: { otpAttempts: attempts },
      overrideAccess: true,
    })
    if (attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: 'otp_attempts_exceeded', message: 'Terlalu banyak percobaan. Minta kode baru.' },
        { status: 429 },
      )
    }
    return NextResponse.json(
      {
        error: 'invalid_code',
        message: `Kode verifikasi salah. Sisa ${OTP_MAX_ATTEMPTS - attempts} percobaan.`,
      },
      { status: 401 },
    )
  }

  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      verified: true,
      otpHash: null,
      otpExpires: null,
      otpAttempts: null,
      otpNextResend: null,
    },
    overrideAccess: true,
  })

  return NextResponse.json({
    ok: true,
    message: 'Akun terverifikasi. Silakan masuk.',
  })
}
