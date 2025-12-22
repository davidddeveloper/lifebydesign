import { defineType } from 'sanity'

export const workshopValue = defineType({
  name: "workshopValue",
  title: "Workshop Value",
  type: "object",
  fields: [
    {
      name: "introText",
      type: "text",
      rows: 3,
    },
    {
      name: "animatedReasons",
      type: "array",
      of: [{ type: "string" }], // e.g. KEY MAN RISK, LACK OF SYSTEMS & PROCESSES, etc.
    },
    {
      name: "cta",
      type: "object",
      fields: [
        { name: "text", type: "string" },
        { name: "url", type: "url" },
      ],
    },
  ],
})
