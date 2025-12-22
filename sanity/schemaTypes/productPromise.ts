import { defineType } from 'sanity'

export const productPromise = defineType({
  name: "productPromise",
  title: "Product Promise",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "description", type: "text", rows: 3 },
    {
      name: "guarantee",
      type: "text",
      rows: 2,
      title: "Guaranteed Outcome",
    },
  ],
})
