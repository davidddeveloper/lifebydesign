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
            { name: "focus", type: "string", title: "Plan Focus/Tagline" }, // mapped from billingNote or focus
            { name: "price", type: "string", title: "Monthly Price" },
            { name: "yearlyPrice", type: "string", title: "Yearly Price" },
            { name: "highlighted", type: "boolean", initialValue: false },
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
