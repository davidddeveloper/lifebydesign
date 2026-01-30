import { defineField, defineType } from "sanity"

export const careers = defineType({
  name: "Careers Page",
  title: "Careers Page",
  type: "document",
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
        { type: "ctaSection" },
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
        title: title || "Careers Page",
      }
    },
  },
})
