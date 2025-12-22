import { defineType } from "sanity"

export const aboutStory = defineType({
  name: "aboutStory",
  title: "Our Story",
  type: "object",
  fields: [
    { name: "title", type: "string", initialValue: "Our Story" },
    {
      name: "content",
      title: "Story Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
})