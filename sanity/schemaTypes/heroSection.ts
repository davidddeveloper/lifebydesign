import { defineType } from 'sanity'

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "subheading", type: "text", rows: 3 },
    { name: "image", type: "image", options: { hotspot: true } },
    { name: "primaryCta", type: "object", fields: [
        { name: "text", type: "string" },
        { name: "url", type: "url" },
    ] },
  ],
})
