import { defineType } from "sanity"

export const careersValues = defineType({
  name: "careersValues",
  title: "Values",
  type: "object",
  fields: [
    {
      name: "heading",
      title: "Section Heading",
      type: "string",
      initialValue: "What are our values?"
    },
    {
      name: "description",
      title: "Section Description",
      type: "text",
      rows: 4,
      initialValue: "Our values aren't just words on a wall — we make every business decision through them, including who we hire. We hold a high bar for both character and results: no ego, disciplined execution, and measuring ourselves by impact. By setting clear expectations for how we work together, we can keep doing big things with great people."
    },
    {
      name: "values",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", type: "string" },
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 3 },
            { name: "image", type: "image", options: { hotspot: true } },
          ],
        },
      ],
    },
  ],
})
