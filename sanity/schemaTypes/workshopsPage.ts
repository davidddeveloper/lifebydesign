import { defineField, defineType } from "sanity"
import { PresentationIcon } from "@sanity/icons"

export const workshopsPage = defineType({
  name: "workshopsPage",
  title: "Workshops Page",
  type: "document",
  icon: PresentationIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "heroSection" },        // CTA + Hero image + heading/subheading
        { type: "workshopBenefits" },   // What you'll get sections (#1, #2, #3)
        { type: "workshopValue" },      // Animated reasons / description
        { type: "faqReference" },       // reuse FAQ
        { type: "ctaSection" },         // reuse CTA
      ],
    }),

    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string" },
        { name: "metaDescription", type: "text" },
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
