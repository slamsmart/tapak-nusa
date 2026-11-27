import type { Payload } from 'payload'

import type { User } from '@/payload-types'

/**
 * Trusted server lookup of a public user by email. Auth routes run before any
 * session exists, so this must use overrideAccess: true (the same trusted-server
 * pattern as content loading and quiz grading). Returns null when absent.
 */
export async function findUserByEmail(payload: Payload, email: string): Promise<User | null> {
  const result = await payload.find({
    collection: 'users',
    where: { email: { equals: email } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    disableErrors: true,
  })
  return (result.docs[0] as User | undefined) ?? null
}
