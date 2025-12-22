import { defineType } from 'sanity'

export const faqReference = defineType({
  name: "faqReference",
  title: "FAQ Section",
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
