import { defineField, defineType } from "sanity"

export const page = defineType({
  name: "scalingblueprintpage",
  title: "Scaling Blueprint Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Scaling Blueprint",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "productHero" },
        { type: "processSteps" },
        { type: "targetStages" },
        { type: "pricingPaths" },
        { type: "outcomesSection" },
        { type: "faqReference" },
        { type: "ctaSection" }
      ],
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
    prepare({ title }) {
      return {
        title: title || "Scaling Blueprint Page",
      }
    },
  },
})
