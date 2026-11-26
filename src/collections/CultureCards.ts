import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

/**
 * One editorial culture card for a province: the unit shown in the collection
 * grid and inside a province adventure.
 */
export const CultureCards: CollectionConfig = {
  slug: 'culture-cards',
  labels: {
    singular: 'Culture Card',
    plural: 'Culture Cards',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: () => true,
    update: isAdmin,
  },
  admin: {
    group: 'Tapak Nusa',
    useAsTitle: 'title',
    defaultColumns: ['title', 'province', 'label', 'order'],
    description: 'Culture cards shown in the collection grid and province adventures.',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'province',
      type: 'relationship',
      relationTo: 'provinces',
      required: true,
      index: true,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'Category chip, e.g. Arsitektur or Kuliner.' },
    },
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea', required: true },
    {
      name: 'source',
      type: 'text',
      required: true,
      admin: { description: 'Reference or publisher credited for the text.' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'credit',
      type: 'text',
      required: true,
      admin: { description: 'Photographer or collection and its license.' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Display order within the province.' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable identifier for links to this card.' },
    },
  ],
}
