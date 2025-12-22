import { defineType } from 'sanity'

export const founderSection = defineType({
  name: "founderSection",
  title: "About Our Founder",
  type: "object",
  fields: [
    { name: "name", type: "string" },
    { name: "title", type: "string" },
    { name: "bio", type: "array", of: [{ type: "block" }] }, // rich text
    { name: "image", type: "image", options: { hotspot: true } },
  ],
})
