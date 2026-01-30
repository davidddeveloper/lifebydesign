import { defineType } from 'sanity'

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "subheading", type: "text", rows: 3 },
    { name: "description", type: "text", rows: 3 },
    { name: "heroImageLeft", type: "image", options: { hotspot: true } },
    { name: "heroImageRight", type: "image", options: { hotspot: true } },
    { name: "primaryCtaText", type: "string" },
    { name: "primaryCtaUrl", type: "string" },
  ]
})
