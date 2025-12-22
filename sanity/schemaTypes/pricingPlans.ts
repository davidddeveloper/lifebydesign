import { defineType } from 'sanity'

export const pricingPlans = defineType({
  name: "pricingPlans",
  title: "Pricing Plans",
  type: "object",
  fields: [
    {
      name: "plans",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string" },
            { name: "price", type: "string" },
            { name: "billingNote", type: "string" },
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
