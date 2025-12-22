import { defineType } from "sanity"


export const aboutHero = defineType({
  name: "aboutHero",
  title: "About Hero",
  type: "object",
  fields: [
    { name: "heading", type: "string", title: "Heading" },
    { name: "subheading", type: "text", title: "Subheading", rows: 3 },
  ],
  preview: {
    select: { title: "heading" },
  },
})
