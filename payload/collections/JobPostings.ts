import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const JobPostings: CollectionConfig = {
  slug: 'job-postings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'type', 'status'],
  },
  access: {
    read: () => true,
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
    },
    {
      name: 'department',
      type: 'text',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Full Time', value: 'full-time' },
        { label: 'Part Time', value: 'part-time' },
        { label: 'Contract', value: 'contract' },
        { label: 'Internship', value: 'internship' },
      ],
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'salary',
      type: 'text',
      admin: {
        description: 'e.g. "$50,000 - $70,000" or "Competitive"',
      },
    },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'requirements',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      defaultValue: 'open',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
