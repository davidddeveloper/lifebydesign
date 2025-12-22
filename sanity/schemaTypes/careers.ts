import { defineField, defineType } from "sanity"
import { BasketIcon } from "@sanity/icons"

export const careersPage = defineType({
  name: "careersPage",
  title: "Careers Page",
  type: "document",
  icon: BasketIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "Careers",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "careersHero" },
        { type: "careersMindset" },
        { type: "careersTestimonials" },
        { type: "careersValues" },
        { type: "careersBenefits" },
        { type: "ctaSection" }, // reuse CTA
      ],
    }),

    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
