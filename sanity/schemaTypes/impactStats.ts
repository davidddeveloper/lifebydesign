import { defineType } from "sanity"

export const impactStats = defineType({
  name: "impactStats",
  title: "Impact Stats",
  type: "object",
  fields: [
    {
      name: "stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", type: "string" },
            { name: "label", type: "string" },
          ],
        },
      ],
    },
  ],
})
