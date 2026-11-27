/**
 * Throwaway verification helper. Idempotent: refreshes OTP bookkeeping for
 * unverified users on every run. DELETE after verification.
 *
 * Usage: PAYLOAD_MIGRATING=true node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/seed-test-auth-users.mts
 */
import { createHash } from 'node:crypto'

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const TEST_CODE = '123456'
const hashOtp = (code: string) =>
  createHash('sha256').update(code + process.env.PAYLOAD_SECRET).digest('hex')

const now = Date.now()
const payload = await getPayload({ config })

const seeds = [
  { email: 'verified-test-001@example.com', name: 'Verified Tester', password: 'veripass123', verified: true },
  { email: 'otp-test-001@example.com', name: 'Otp Tester', password: 'otppass123', verified: false },
  { email: 'otp-test-002@example.com', name: 'Otp Tester Two', password: 'otppass234', verified: false },
]

for (const seed of seeds) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: seed.email } },
    limit: 1,
    overrideAccess: true,
  })
  const doc = existing.docs[0]
  if (doc) {
    if (!seed.verified) {
      await payload.update({
        collection: 'users',
        id: doc.id,
        data: {
          otpHash: hashOtp(TEST_CODE),
          otpExpires: new Date(now + 10 * 60 * 1000).toISOString(),
          otpAttempts: 0,
          otpNextResend: new Date(now + 60 * 1000).toISOString(),
        },
        overrideAccess: true,
      })
      console.log(`refreshed OTP for ${seed.email}`)
    } else {
      console.log(`${seed.email} already exists`)
    }
    continue
  }
  await payload.create({
    collection: 'users',
    data: {
      name: seed.name,
      email: seed.email,
      password: seed.password,
      verified: seed.verified,
      ...(seed.verified
        ? {}
        : {
            otpHash: hashOtp(TEST_CODE),
            otpExpires: new Date(now + 10 * 60 * 1000).toISOString(),
            otpAttempts: 0,
            otpNextResend: new Date(now + 60 * 1000).toISOString(),
          }),
    },
    overrideAccess: true,
  })
  console.log(`seeded ${seed.email}`)
}
process.exit(0)
