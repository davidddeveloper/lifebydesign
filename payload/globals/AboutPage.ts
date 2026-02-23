import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  label: 'About Page',
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
      ],
    },
    {
      name: 'missionVision',
      type: 'group',
      label: 'Mission, Vision & Story',
      fields: [
        { name: 'story', type: 'richText', editor: lexicalEditor() },
        { name: 'mission', type: 'textarea' },
        { name: 'vision', type: 'textarea' },
      ],
    },
    {
      name: 'coreValues',
      type: 'group',
      label: 'Core Values',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'values',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'icon', type: 'text', admin: { description: 'Icon name or emoji' } },
          ],
        },
      ],
    },
    {
      name: 'services',
      type: 'group',
      label: 'Services Section',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        {
          name: 'items',
          type: 'array',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'icon', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'impactStats',
      type: 'group',
      label: 'Impact Statistics',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'stats',
          type: 'array',
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Section',
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
