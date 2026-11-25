import type { CollectionConfig } from 'payload'

/**
 * A multiple-choice quiz question attached to a province adventure.
 */
export const QuizQuestions: CollectionConfig = {
  slug: 'quiz-questions',
  labels: {
    singular: 'Quiz Question',
    plural: 'Quiz Questions',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: 'Tapak Nusa',
    useAsTitle: 'prompt',
    defaultColumns: ['prompt', 'province', 'answer', 'order'],
    description: 'Multiple-choice questions asked at the end of a province adventure.',
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
      name: 'prompt',
      type: 'textarea',
      required: true,
      admin: { description: 'The question text shown to the player.' },
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      minRows: 2,
      fields: [{ name: 'text', type: 'text', required: true }],
    },
    {
      name: 'answer',
      type: 'number',
      required: true,
      min: 0,
      admin: { description: 'Zero-based index of the correct option.' },
    },
    {
      name: 'explanation',
      type: 'textarea',
      required: true,
      admin: { description: 'Shown after answering, explaining why the answer is correct.' },
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
      admin: { description: 'Display order within the province quiz.' },
    },
  ],
}
