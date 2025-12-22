import { defineType } from 'sanity'

export const deliverablesSection = defineType({
  name: "deliverablesSection",
  title: "What's Included",
  type: "object",
  fields: [
    {
      name: "items",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
})

