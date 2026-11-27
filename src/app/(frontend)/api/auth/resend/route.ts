import { NextResponse } from 'next/server'
import { AuthenticationError, LockedAuth } from 'payload'
import type { LoginResult } from 'payload'
import { issueOtp, otpResendCooldownRemaining } from '@/lib/otp'
import { getPayloadClient } from '@/lib/payload'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const genericInvalidCredentials = {
  error: 'invalid_credentials',
  message: 'Email atau kata sandi salah.',
}

/**
 * Re-sends the registration OTP for an unverified account. The password is
 * verified first (payload.login), so the resend endpoint is only usable by the
 * account owner; the per-user cooldown still applies between sends.
 */
export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Permintaan tidak valid.' },
      { status: 400 },
    )
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!emailPattern.test(email) || !password) {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Masukkan email dan kata sandi.' },
      { status: 400 },
    )
  }

  const payload = await getPayloadClient()
  let result: LoginResult<'users'>
  try {
    result = await payload.login({
      collection: 'users',
      data: { email, password },
      overrideAccess: true,
    })
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof LockedAuth) {
      return NextResponse.json(genericInvalidCredentials, { status: 401 })
    }
    throw error
  }

  const user = result.user
  if (!user) {
    return NextResponse.json(genericInvalidCredentials, { status: 401 })
  }
  if (user.verified) {
    return NextResponse.json(
      { error: 'already_verified', message: 'Akun sudah terverifikasi. Silakan masuk.' },
      { status: 400 },
    )
  }

  const cooldownSeconds = otpResendCooldownRemaining(user.otpNextResend)
  if (cooldownSeconds > 0) {
    return NextResponse.json(
      {
        error: 'resend_cooldown',
        message: `Tunggu ${cooldownSeconds} detik sebelum meminta kode baru.`,
        retryAfterSeconds: cooldownSeconds,
      },
      { status: 429 },
    )
  }

  const sent = await issueOtp(payload, user)
  if (!sent.ok) {
    const responses: Record<typeof sent.reason, { status: number; message: string }> = {
      email_unconfigured: {
        status: 503,
        message: 'Layanan email belum dikonfigurasi. Coba lagi nanti.',
      },
      email_send_failed: {
        status: 502,
        message: 'Email verifikasi gagal dikirim. Coba lagi nanti.',
      },
    }
    const response = responses[sent.reason]
    return NextResponse.json(
      { error: sent.reason, message: response.message },
      { status: response.status },
    )
  }

  return NextResponse.json({ ok: true, message: 'Kode verifikasi baru dikirim ke email kamu.' })
}
