import { defineField, defineType } from "sanity"
import { BookIcon } from "@sanity/icons"

export const kolatBooksPage = defineType({
  name: "kolatBooksPage",
  title: "Kolat Books Page",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Kolat Books",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "productHero" },        // reuse
        { type: "productPromise" },
        { type: "deliverablesSection" },
        { type: "workflowPhases" },
        { type: "pricingPlans" },
        { type: "faqReference" },       // reuse FAQ
        { type: "ctaSection" },         // reuse CTA
      ],
    }),

    defineField({
      name: "published",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
