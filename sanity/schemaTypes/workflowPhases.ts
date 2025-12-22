import { defineType } from 'sanity'

export const workflowPhases = defineType({
  name: "workflowPhases",
  title: "Delivery Workflow",
  type: "object",
  fields: [
    {
      name: "phases",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "phase", type: "string" },
            { name: "title", type: "string" },
            { name: "duration", type: "string" },
            { name: "action", type: "text", rows: 3 },
            { name: "result", type: "text", rows: 2 },
          ],
        },
      ],
    },
  ],
})
