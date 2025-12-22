import { defineType } from 'sanity'

export const partnersSection = defineType({
  name: "partnersSection",
  title: "Partners / Logos",
  type: "object",
  fields: [
    {
      name: "logos",
      title: "Partner Logos",
      type: "array",
      of: [{ type: "image" }],
    },
  ],
})
