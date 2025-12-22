import { defineField, defineType } from "sanity"
import { RocketIcon } from "@sanity/icons"

export const scalingBlueprintPage = defineType({
  name: "scalingBlueprintPage",
  title: "Scaling Blueprint Page",
  type: "document",
  icon: RocketIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      initialValue: "Scaling Blueprint",
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
        { type: "productHero" },
        { type: "processSteps" },
        { type: "targetStages" },
        { type: "pricingPaths" },
        { type: "outcomesSection" },
        { type: "faqReference" }, // 🔑 reuse FAQ
        { type: "ctaSection" },   // reuse CTA
      ],
    }),

    defineField({
      name: "published",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
