import type { Access, CollectionConfig } from 'payload'

import { createFolderField, createTagField } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Tapak Nusa',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    createFolderField({ relationTo: 'folders' }),
    createTagField({ relationTo: 'tags' }),
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
