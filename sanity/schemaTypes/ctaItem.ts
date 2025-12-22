import { defineField, defineType } from "sanity"

export const ctaItem = defineType({
  name: "ctaItem",
  title: "CTA Item",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "buttonText",
      title: "Button Text",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonUrl",
      title: "Button URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "buttonText",
    },
  },
})
