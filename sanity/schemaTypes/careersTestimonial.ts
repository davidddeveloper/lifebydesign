import { defineType } from "sanity"

export const careersTestimonials = defineType({
  name: "careersTestimonials",
  title: "Team Testimonials",
  type: "object",
  fields: [
    {
      name: "testimonials",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "quote", type: "text", rows: 4 },
            { name: "name", type: "string" },
            { name: "role", type: "string" },
          ],
        },
      ],
    },
  ],
})
