import { defineType } from 'sanity'

export const processSteps = defineType({
  name: "processSteps",
  title: "How It Works",
  type: "object",
  fields: [
    {
      name: "steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "stepNumber", type: "string" },
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 4 },
          ],
        },
      ],
    },
  ],
})
