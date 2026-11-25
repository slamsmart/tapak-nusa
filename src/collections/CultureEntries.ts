import type { Access, CollectionConfig } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

const readPublishedOrAdmin: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

export const CultureEntries: CollectionConfig = {
  slug: 'culture-entries',
  labels: {
    singular: 'Cultural Entry',
    plural: 'Cultural Entries',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: readPublishedOrAdmin,
    update: isAdmin,
  },
  admin: {
    group: 'Tapak Nusa',
    useAsTitle: 'title',
    defaultColumns: ['title', 'province', 'category', 'sourcePublisher', '_status'],
    description:
      'Firecrawl research drafts. Review cultural context and sources before publishing.',
  },
  versions: {
    drafts: true,
    maxPerDoc: 20,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Stable identifier generated from the source title.',
      },
    },
    {
      name: 'province',
      type: 'select',
      required: true,
      options: [
        'Aceh',
        'Sumatera Utara',
        'Sumatera Barat',
        'Riau',
        'Kepulauan Riau',
        'Jambi',
        'Sumatera Selatan',
        'Kepulauan Bangka Belitung',
        'Bengkulu',
        'Lampung',
        'Banten',
        'DKI Jakarta',
        'Jawa Barat',
        'Jawa Tengah',
        'DI Yogyakarta',
        'Jawa Timur',
        'Bali',
        'Nusa Tenggara Barat',
        'Nusa Tenggara Timur',
        'Kalimantan Barat',
        'Kalimantan Tengah',
        'Kalimantan Selatan',
        'Kalimantan Timur',
        'Kalimantan Utara',
        'Sulawesi Utara',
        'Gorontalo',
        'Sulawesi Tengah',
        'Sulawesi Barat',
        'Sulawesi Selatan',
        'Sulawesi Tenggara',
        'Maluku',
        'Maluku Utara',
        'Papua',
        'Papua Barat',
        'Papua Selatan',
        'Papua Tengah',
        'Papua Pegunungan',
        'Papua Barat Daya',
        'Lintas Daerah',
      ],
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        'Arsitektur',
        'Seni Pertunjukan',
        'Tradisi Lisan',
        'Kuliner',
        'Kerajinan',
        'Upacara Adat',
        'Musik',
        'Pengetahuan Tradisional',
        'Pakaian Adat',
        'Lagu Daerah',
        'Lainnya',
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 1200,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Reviewed documentary image. Confirm the subject, creator, and usage rights.',
      },
    },
    {
      name: 'imageAttribution',
      type: 'text',
      admin: {
        description: 'Photographer, collection, and license or source attribution.',
      },
    },
    {
      name: 'sourceExtract',
      label: 'Source extract',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Extracted source text retained for editorial fact-checking.',
      },
    },
    {
      name: 'sourceTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceURL',
      label: 'Source URL',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'sourcePublisher',
      type: 'text',
      required: true,
    },
    {
      name: 'scrapedAt',
      type: 'date',
      required: true,
      admin: {
        date: {
          displayFormat: 'dd MMM yyyy HH:mm',
        },
      },
    },
    {
      name: 'verificationNotes',
      type: 'textarea',
      admin: {
        description:
          'Record editorial checks, corrections, and cross-references before publishing.',
      },
    },
  ],
}
