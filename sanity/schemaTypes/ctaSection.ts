import { defineType } from "sanity"

export const ctaSection = defineType({
  name: "ctaSection",
  title: "CTA Section",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "text", type: "text", rows: 3 },
    { name: "buttonText", type: "string" },
    { name: "buttonUrl", type: "url" },
  ],
})
