import { defineField, defineType } from "sanity"
import { BoldIcon } from "@sanity/icons"

export const ctas = defineType({
  name: "ctaPage",
  title: "CTAs",
  type: "document",
  icon: BoldIcon,
  fields: [
    defineField({
      name: "title",
      title: "CTA Group Title",
      type: "string",
      description: "Example: Home CTAs",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctas",
      title: "CTA List",
      type: "array",
      of: [{ type: "ctaItem" }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
})
