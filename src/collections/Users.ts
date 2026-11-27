import type { Access, CollectionConfig, FieldAccess } from 'payload'
import { APIError } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

/** Self or admins. Public accounts are readable only by their owner. */
const isSelfOrAdmin: Access = ({ req, id }) =>
  req.user?.collection === 'admins' || (req.user?.collection === 'users' && req.user.id === id)

/**
 * OTP bookkeeping must never reach the browser: leaking otpHash would let a
 * client verify itself without the email, and even expires/attempts should
 * stay server-side. Mirrors the quiz answer/explanation field-level pattern.
 */
const otpFieldRead: FieldAccess = ({ req }) => req.user?.collection === 'admins'

/**
 * Public game accounts. Registration happens through the custom
 * /api/auth/register route (Local API, overrideAccess: true), so REST/GraphQL
 * create is closed at the collection boundary. Email verification uses a
 * 6-digit OTP e-mailed by /api/auth/register and /api/auth/resend.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  access: {
    create: () => false,
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'email',
    description: 'Public game accounts. Verified via 6-digit e-mail OTP at registration.',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 60 * 60 * 24 * 30,
  },
  hooks: {
    beforeOperation: [
      ({ args, operation, req }) => {
        // Trusted server ops (auth routes) bypass access control; admins may
        // edit anything. Everyone else may only update their display name.
        if (operation !== 'update' || args.overrideAccess === true) return
        if (req.user?.collection === 'admins') return
        const data = args.data as Record<string, unknown> | undefined
        if (data && Object.keys(data).some((key) => key !== 'name')) {
          throw new APIError('Akun hanya dapat mengubah nama.', 403)
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Nama penjelajah yang tampil di dashboard.' },
    },
    {
      name: 'avatar',
      type: 'text',
      admin: {
        description:
          'R2 object key of the profile picture (avatars/<userId>), served by /api/profile/avatar.',
      },
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      access: {
        create: () => false,
        update: () => false,
      },
      admin: { description: 'True once the registration OTP has been confirmed.' },
    },
    {
      name: 'otpHash',
      type: 'text',
      access: {
        create: () => false,
        update: () => false,
        read: otpFieldRead,
      },
      admin: { description: 'SHA-256 of the pending OTP code plus the PAYLOAD_SECRET pepper.' },
    },
    {
      name: 'otpExpires',
      type: 'date',
      access: {
        create: () => false,
        update: () => false,
        read: otpFieldRead,
      },
      admin: { description: 'When the pending OTP code expires (10 minutes after issue).' },
    },
    {
      name: 'otpAttempts',
      type: 'number',
      access: {
        create: () => false,
        update: () => false,
        read: otpFieldRead,
      },
      admin: { description: 'Wrong-code attempts for the pending OTP (max 5).' },
    },
    {
      name: 'otpNextResend',
      type: 'date',
      access: {
        create: () => false,
        update: () => false,
        read: otpFieldRead,
      },
      admin: { description: 'Resend cooldown: earliest time the next OTP may be sent.' },
    },
  ],
  versions: false,
}
