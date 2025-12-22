import { defineType } from "sanity"

export const missionVision = defineType({
  name: "missionVision",
  title: "Mission & Vision",
  type: "object",
  fields: [
    { name: "mission", type: "text", rows: 3 },
    { name: "vision", type: "text", rows: 3 },
  ],
})
