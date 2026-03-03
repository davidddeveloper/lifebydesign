import { defineType, defineField } from 'sanity'

export const deliverablesSection = defineType({
  name: "deliverablesSection",
  title: "What's Included",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "deliverableItem",
          title: "Item",
          fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "description", type: "text", title: "Description", rows: 3 },
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
  ],
})
