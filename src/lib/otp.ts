import { createHash } from 'node:crypto'

import type { Payload } from 'payload'

import type { EmailSendResult } from '@/lib/email'
import { sendOtpEmail } from '@/lib/email'

export const OTP_TTL_MS = 10 * 60 * 1000
export const OTP_MAX_ATTEMPTS = 5
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000

/** A public user row as the auth routes need it (mirrors the generated User shape). */
export interface OtpUser {
  id: number | string
  email: string
  name: string
  otpHash?: string | null
  otpExpires?: string | null
  otpAttempts?: number | null
  otpNextResend?: string | null
}

/**
 * 6-digit code from rejection-sampled Web Crypto (no modulo bias). The code
 * itself is never stored or returned: only a SHA-256 digest peppered with
 * PAYLOAD_SECRET lives in the database, so a database dump cannot verify codes.
 */
export function generateOtpCode(): string {
  const limit = 4294967296 - (4294967296 % 1_000_000)
  const buffer = new Uint32Array(1)
  let value: number
  do {
    crypto.getRandomValues(buffer)
    value = buffer[0] as number
  } while (value >= limit)
  return String(value % 1_000_000).padStart(6, '0')
}

/** Peppers the code with PAYLOAD_SECRET so database leaks cannot verify codes. */
export function hashOtp(code: string): string {
  return createHash('sha256')
    .update(code + process.env.PAYLOAD_SECRET)
    .digest('hex')
}

/** Constant-time comparison of a candidate code against a stored digest. */
export function otpCodeMatches(code: string, storedHash: string): boolean {
  const candidate = hashOtp(code)
  if (candidate.length !== storedHash.length) return false
  let difference = 0
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate.charCodeAt(index) ^ storedHash.charCodeAt(index)
  }
  return difference === 0
}

/** Seconds until the resend cooldown elapses (0 = may send now). */
export function otpResendCooldownRemaining(otpNextResend: string | null | undefined): number {
  if (!otpNextResend) return 0
  const nextResend = Date.parse(otpNextResend)
  if (Number.isNaN(nextResend)) return 0
  return Math.max(0, Math.ceil((nextResend - Date.now()) / 1000))
}

/**
 * Regenerate and persist a fresh OTP for a user, then e-mail it. Shared by
 * /api/auth/register and /api/auth/resend so both behave identically.
 */
export async function issueOtp(payload: Payload, user: OtpUser): Promise<EmailSendResult> {
  const code = generateOtpCode()
  const now = Date.now()
  await payload.update({
    collection: 'users',
    id: user.id,
    data: {
      otpHash: hashOtp(code),
      otpExpires: new Date(now + OTP_TTL_MS).toISOString(),
      otpAttempts: 0,
      otpNextResend: new Date(now + OTP_RESEND_COOLDOWN_MS).toISOString(),
    },
    overrideAccess: true,
  })
  return sendOtpEmail({ to: user.email, code, name: user.name })
}
