import type { GlobalConfig } from 'payload'

export const KolatBooksPage: GlobalConfig = {
  slug: 'kolat-books-page',
  label: 'Kolat Books Page',
  access: { read: () => true },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        {
          name: 'ctaButton',
          type: 'group',
          fields: [
            { name: 'text', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
        {
          name: 'ctaButtonSecondary',
          type: 'group',
          fields: [
            { name: 'text', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'promise',
      type: 'group',
      label: 'Value Proposition',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        { name: 'guarantee', type: 'textarea' },
      ],
    },
    {
      name: 'deliverables',
      type: 'group',
      label: 'What You Get',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'workflowPhases',
      type: 'group',
      label: 'Workflow / How It Works',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'phases',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'duration', type: 'text' },
            { name: 'results', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'pricingPlans',
      type: 'group',
      label: 'Pricing Plans',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'plans',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'price', type: 'text' },
            { name: 'description', type: 'textarea' },
            { name: 'highlighted', type: 'checkbox', defaultValue: false },
            {
              name: 'features',
              type: 'array',
              fields: [{ name: 'item', type: 'text' }],
            },
            {
              name: 'cta',
              type: 'group',
              fields: [
                { name: 'text', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      type: 'group',
      label: 'FAQ',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'ctaButton',
          type: 'group',
          fields: [
            { name: 'text', type: 'text' },
            { name: 'url', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
