import { defineType } from "sanity"

export const careersMindset = defineType({
  name: "careersMindset",
  title: "Mindset/Culture",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "We want disciplined team players who trust and win together."
    },
    {
      name: "description",
      title: "Section Description",
      type: "text",
      rows: 4,
      initialValue: "At Startup Bodyshop, we're focused on building businesses that compound over years, not months. We care about creating systems that scale, making decisions that stand the test of time, and building relationships that last."
    },
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
            { name: "subtext", type: "string" },
            { name: "image", type: "image", options: { hotspot: true } },
            { name: "reverse", type: "boolean", initialValue: false },
          ],
        },
      ],
    },
  ],
})
