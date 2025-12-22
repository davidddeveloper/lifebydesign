import { defineType } from "sanity"

export const careersValues = defineType({
  name: "careersValues",
  title: "Values",
  type: "object",
  fields: [
    {
      name: "values",
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
