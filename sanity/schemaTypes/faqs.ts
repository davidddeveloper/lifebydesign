import { defineField, defineType } from "sanity"
import { HelpCircleIcon } from "@sanity/icons"

export const faq = defineType({
  name: "faq",
  title: "FAQs",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "FAQ Title",
      type: "string",
      description: "Example: Homepage FAQs",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "faqs",
      title: "FAQ List",
      type: "array",
      of: [{ type: "faqItem" }],
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
