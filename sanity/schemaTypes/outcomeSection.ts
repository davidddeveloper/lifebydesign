import { defineType } from 'sanity'

export const outcomesSection = defineType({
  name: "outcomesSection",
  title: "What You Get",
  type: "object",
  fields: [
    {
      name: "outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 3 },
          ],
        },
      ],
    },
    {
      name: "closingStatement",
      type: "text",
      rows: 3,
    },
  ],
})
