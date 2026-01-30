import { defineType } from "sanity"

export const missionVision = defineType({
  name: "missionVision",
  title: "Mission & Vision",
  type: "object",
  fields: [
    {
      name: "story",
      title: "Our Story",
      type: "array",
      of: [{ type: "block" }],
    },
    { name: "mission", type: "text", rows: 3 },
    { name: "vision", type: "text", rows: 3 },
  ],
})
