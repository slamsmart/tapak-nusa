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
 * Logs a public user in via the Payload Local API so the route controls cookie
 * emission itself. Unverified accounts never receive a session: the route
 * responds with status 'otp_required' and (after the resend cooldown) e-mails a
 * fresh OTP. Verified accounts get the payload-token session cookie.
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
      // Trusted server op: the route needs the raw user including OTP
      // bookkeeping for the cooldown check below.
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
  if (!user.verified) {
    let emailSent = false
    if (otpResendCooldownRemaining(user.otpNextResend) === 0) {
      const sent = await issueOtp(payload, user)
      emailSent = sent.ok
    }
    return NextResponse.json({
      status: 'otp_required',
      emailSent,
      message: emailSent
        ? 'Akun belum terverifikasi. Kami kirim kode verifikasi ke email kamu.'
        : 'Akun belum terverifikasi. Tunggu beberapa detik, lalu minta kode verifikasi baru.',
    })
  }

  const maxAge = Math.max(
    0,
    result.exp
      ? result.exp - Math.floor(Date.now() / 1000)
      : payload.collections.users.config.auth.tokenExpiration,
  )
  const headers = new Headers()
  headers.append(
    'Set-Cookie',
    `payload-token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`,
  )

  return NextResponse.json(
    { status: 'ok', user: { name: user.name, email: user.email, avatar: user.avatar ?? null } },
    { headers },
  )
}
