import { NextResponse } from 'next/server'

import { findUserByEmail } from '@/lib/auth'
import { sendOtpEmail } from '@/lib/email'
import {
  OTP_RESEND_COOLDOWN_MS,
  OTP_TTL_MS,
  generateOtpCode,
  hashOtp,
  issueOtp,
  otpResendCooldownRemaining,
} from '@/lib/otp'
import { getPayloadClient } from '@/lib/payload'
import { verifyTurnstileToken } from '@/lib/turnstile'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const turnstileResponses: Record<string, { status: number; message: string }> = {
  unconfigured: {
    status: 503,
    message: 'Layanan verifikasi keamanan belum dikonfigurasi.',
  },
  invalid: {
    status: 400,
    message: 'Verifikasi keamanan belum berhasil. Silakan coba kembali.',
  },
  unavailable: {
    status: 502,
    message: 'Layanan verifikasi sedang tidak tersedia.',
  },
}

const emailResponses: Record<string, { status: number; message: string }> = {
  email_unconfigured: {
    status: 503,
    message: 'Layanan email belum dikonfigurasi. Coba lagi nanti.',
  },
  email_send_failed: {
    status: 502,
    message: 'Email verifikasi gagal dikirim. Coba lagi nanti.',
  },
}

/**
 * Public account registration. Creates the user unverified, stores only a
 * peppered hash of a 6-digit OTP, and e-mails the code. Re-registering an
 * existing but unverified email reuses that account and re-sends the OTP,
 * respecting the per-user resend cooldown.
 */
export async function POST(request: Request) {
  let body: {
    name?: unknown
    email?: unknown
    password?: unknown
    turnstileToken?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'invalid_request', message: 'Permintaan tidak valid.' },
      { status: 400 },
    )
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!name || name.length > 60) {
    return NextResponse.json(
      { error: 'invalid_name', message: 'Masukkan nama penjelajah (maksimal 60 karakter).' },
      { status: 400 },
    )
  }
  if (!emailPattern.test(email)) {
    return NextResponse.json(
      { error: 'invalid_email', message: 'Gunakan alamat email yang valid.' },
      { status: 400 },
    )
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: 'invalid_password', message: 'Kata sandi minimal 8 karakter.' },
      { status: 400 },
    )
  }

  // The Turnstile widget only renders when the site key is set; when it is
  // unset signup stays open (graceful no-sitekey behavior).
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY
  if (siteKey) {
    if (typeof body.turnstileToken !== 'string' || !body.turnstileToken) {
      return NextResponse.json(
        { error: 'turnstile_required', message: 'Selesaikan verifikasi keamanan terlebih dahulu.' },
        { status: 400 },
      )
    }
    const verification = await verifyTurnstileToken(body.turnstileToken)
    if (!verification.ok) {
      const response = turnstileResponses[verification.reason]
      return NextResponse.json(
        { error: `turnstile_${verification.reason}`, message: response.message },
        { status: response.status },
      )
    }
  }

  const payload = await getPayloadClient()
  const existing = await findUserByEmail(payload, email)
  if (existing) {
    if (existing.verified) {
      return NextResponse.json(
        { error: 'email_taken', message: 'Email sudah terdaftar. Silakan masuk.' },
        { status: 400 },
      )
    }
    // Unverified: reuse the account, re-send respecting the cooldown.
    if (otpResendCooldownRemaining(existing.otpNextResend) === 0) {
      const sent = await issueOtp(payload, existing)
      if (!sent.ok) {
        const response = emailResponses[sent.reason]
        return NextResponse.json(
          { error: sent.reason, message: response.message },
          { status: response.status },
        )
      }
      return NextResponse.json({
        ok: true,
        message: 'Kode verifikasi dikirim ulang ke email kamu.',
      })
    }
    return NextResponse.json({ ok: true, message: 'Kode verifikasi sudah dikirim ke email kamu.' })
  }

  const code = generateOtpCode()
  const now = Date.now()
  await payload.create({
    collection: 'users',
    data: {
      name,
      email,
      password,
      otpHash: hashOtp(code),
      otpExpires: new Date(now + OTP_TTL_MS).toISOString(),
      otpAttempts: 0,
      otpNextResend: new Date(now + OTP_RESEND_COOLDOWN_MS).toISOString(),
    },
    overrideAccess: true,
  })

  const sent = await sendOtpEmail({ to: email, code, name })
  if (!sent.ok) {
    const response = emailResponses[sent.reason]
    return NextResponse.json(
      { error: sent.reason, message: response.message },
      { status: response.status },
    )
  }

  return NextResponse.json({
    ok: true,
    message: 'Kami kirim kode verifikasi 6 digit ke email kamu.',
  })
}
