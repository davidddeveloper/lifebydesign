import type { GlobalConfig } from 'payload'

export const ScalingBlueprintPage: GlobalConfig = {
  slug: 'scaling-blueprint-page',
  label: 'Scaling Blueprint Page',
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
      name: 'processSteps',
      type: 'group',
      label: 'Process Steps',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'steps',
          type: 'array',
          fields: [
            { name: 'number', type: 'number' },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'targetStages',
      type: 'group',
      label: 'Target Business Stages',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'stages',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
          ],
        },
      ],
    },
    {
      name: 'pricingPaths',
      type: 'group',
      label: 'Pricing / Value Ladder',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'tiers',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'price', type: 'text' },
            { name: 'description', type: 'textarea' },
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
      name: 'outcomes',
      type: 'group',
      label: 'Outcomes / Promise',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [{ name: 'outcome', type: 'text' }],
        },
        { name: 'closingStatement', type: 'textarea' },
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
