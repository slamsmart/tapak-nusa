import type { CollectionConfig } from 'payload'

/**
 * A province shown on the Tapak Nusa map plus the opening text of its
 * adventure. Culture cards and quiz questions reference this collection.
 */
export const Provinces: CollectionConfig = {
  slug: 'provinces',
  labels: {
    singular: 'Province',
    plural: 'Provinces',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Tapak Nusa',
    useAsTitle: 'name',
    defaultColumns: ['name', 'island', 'region', 'status', 'order'],
    description: 'Map marker, adventure intro, and regional identity for each province.',
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable identifier used by the map and routes.' },
    },
    { name: 'name', type: 'text', required: true },
    { name: 'island', type: 'text', required: true },
    {
      name: 'region',
      type: 'select',
      required: true,
      options: [
        'sumatra',
        'java',
        'kalimantan',
        'sulawesi',
        'nusa',
        'maluku',
        'papua',
      ],
    },
    {
      name: 'mapX',
      label: 'Map X (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
    },
    {
      name: 'mapY',
      label: 'Map Y (%)',
      type: 'number',
      required: true,
      min: 0,
      max: 100,
    },
    {
      name: 'tone',
      type: 'text',
      required: true,
      admin: { description: 'Map marker colour, e.g. #ee7f42.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [
        { label: 'Done', value: 'done' },
        { label: 'Open', value: 'open' },
        { label: 'Locked', value: 'locked' },
      ],
    },
    { name: 'score', type: 'number' },
    {
      name: 'intro',
      type: 'textarea',
      required: true,
      admin: { description: 'Opening paragraph of the province adventure.' },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: { description: 'Display order on the map and in the collection view.' },
    },
  ],
}
