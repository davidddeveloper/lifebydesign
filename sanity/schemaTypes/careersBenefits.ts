import { defineType } from "sanity"

export const careersBenefits = defineType({
  name: "careersBenefits",
  title: "Benefits",
  type: "object",
  fields: [
    {
      name: "benefits",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", type: "string" },
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 3 },
          ],
        },
      ],
    },
  ],
})
