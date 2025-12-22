import { defineField, defineType } from "sanity"
import { HomeIcon } from "@sanity/icons"

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
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
        { type: "heroSection" },       // CTA + image
        { type: "homeFaqSection" },    // reuse FAQ schema
        { type: "founderSection" },    // image + formatted text
        { type: "partnersSection" },   // logos
        { type: "ctaSection" },        // reuse CTA
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
