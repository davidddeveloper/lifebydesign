import { defineType } from 'sanity'

export const productHero = defineType({
  name: "productHero",
  title: "Product Hero",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "subheading", type: "text", rows: 3 },
    {
      name: "primaryCta",
      type: "object",
      fields: [
        { name: "text", type: "string" },
        { name: "url", type: "url" },
      ],
    },
    {
      name: "secondaryCta",
      type: "object",
      fields: [
        { name: "text", type: "string" },
        { name: "url", type: "url" },
      ],
    },
  ],
})
