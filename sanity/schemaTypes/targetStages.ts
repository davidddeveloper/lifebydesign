import { defineType } from 'sanity'

export const targetStages = defineType({
  name: "targetStages",
  title: "Target Founder Stages",
  type: "object",
  fields: [
    {
      name: "stages",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "coreProblem", type: "string" },
            { name: "painPoint", type: "string" },
            { name: "weFix", type: "string" },
          ],
        },
      ],
    },
  ],
})
