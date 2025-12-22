import { defineType } from "sanity"

export const servicesSection = defineType({
  name: "servicesSection",
  title: "Core Services",
  type: "object",
  fields: [
    {
      name: "services",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "description", type: "text", rows: 3 },
          ],
        },
      ],
    },
  ],
})
