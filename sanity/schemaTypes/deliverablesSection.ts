import { defineType } from 'sanity'

export const deliverablesSection = defineType({
  name: "deliverablesSection",
  title: "What's Included",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
})
