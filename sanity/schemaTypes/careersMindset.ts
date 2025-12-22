import { defineType } from "sanity"

export const careersMindset = defineType({
  name: "careersMindset",
  title: "Team Mindset",
  type: "object",
  fields: [
    {
      name: "items",
      title: "Mindset Items",
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
  ],
})
