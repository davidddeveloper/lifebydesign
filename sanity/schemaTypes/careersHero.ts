import { defineType } from "sanity"

export const careersHero = defineType({
  name: "careersHero",
  title: "Careers Hero",
  type: "object",
  fields: [
    { name: "heading", type: "string" },
    { name: "subheading", type: "text", rows: 3 },
    {
      name: "image",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "buttonText",
      type: "string",
      initialValue: "View Job Openings",
    },
    {
      name: "buttonUrl",
      type: "url",
    },
  ],
  preview: {
    select: { title: "heading", media: "image" },
  },
})