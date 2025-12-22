import { defineField, defineType } from "sanity"
import { InfoOutlineIcon } from "@sanity/icons"

export const About = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      initialValue: "About Us",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        { type: "aboutHero" },
        { type: "aboutStory" },
        { type: "missionVision" },
        { type: "coreValues" },
        { type: "servicesSection" },
        { type: "impactStats" },
        { type: "ctaSection" },
      ],
    }),

    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
  ],
})
