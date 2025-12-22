import { defineType } from 'sanity'

export const homeFaqSection = defineType({
  name: "homeFaqSection",
  title: "Home FAQ Section",
  type: "object",
  fields: [
    {
      name: "faq",
      title: "Select FAQ",
      type: "reference",
      to: [{ type: "faq" }],
    },
  ],
})
