import { defineType } from 'sanity'

export const pricingPaths = defineType({
  name: "pricingPaths",
  title: "Pricing Paths",
  type: "object",
  fields: [
    {
      name: "paths",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "stage", type: "string" },
            { name: "title", type: "string" },
            { name: "price", type: "string" },
            {
              name: "features",
              type: "array",
              of: [{ type: "string" }],
            },
            { name: "ctaText", type: "string" },
            { name: "ctaUrl", type: "url" },
          ],
        },
      ],
    },
  ],
})
