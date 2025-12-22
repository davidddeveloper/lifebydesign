import { defineType } from "sanity"

export const coreValues = defineType({
  name: "coreValues",
  title: "Core Values",
  type: "object",
  fields: [
    {
      name: "values",
      type: "array",
      of: [{ type: "string" }],
    },
  ],
})
