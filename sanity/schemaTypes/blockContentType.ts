import { defineType, defineArrayMember } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export const blockContentType = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    // Text block
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H1', value: 'h1' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              { title: 'URL', name: 'href', type: 'url' },
              { title: 'Open in new tab', name: 'blank', type: 'boolean' },
            ],
          },
        ],
      },
    }),

    // Single Image block
    defineArrayMember({
      type: 'image',
      icon: ImageIcon,
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alternative Text' },
        { name: 'caption', type: 'string', title: 'Caption' },
        {
          name: 'size',
          title: 'Size',
          type: 'string',
          options: {
            list: [
              { title: 'Small', value: 'sm' },
              { title: 'Medium', value: 'md' },
              { title: 'Large', value: 'lg' },
              { title: 'Full Width', value: 'full' },
            ],
            layout: 'radio',
          },
        },
        {
          name: 'alignment',
          title: 'Alignment',
          type: 'string',
          options: {
            list: [
              { title: 'Left', value: 'left' },
              { title: 'Center', value: 'center' },
              { title: 'Right', value: 'right' },
            ],
            layout: 'radio',
          },
        },
      ],
    }),

    // Image gallery / side-by-side images
    defineArrayMember({
      type: 'object',
      name: 'imageGallery',
      title: 'Image Gallery',
      fields: [
        {
          name: 'images',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'image',
              options: { hotspot: true },
              fields: [
                { name: 'alt', type: 'string', title: 'Alternative Text' },
                { name: 'caption', type: 'string', title: 'Caption' },
              ],
            }),
          ],
        },
        {
          name: 'columns',
          type: 'number',
          title: 'Columns',
          initialValue: 2,
          validation: (Rule) => Rule.min(1).max(4),
        },
      ],
    }),

    // You can add other custom objects later (videos, embeds, callouts, etc.)
  ],
})
