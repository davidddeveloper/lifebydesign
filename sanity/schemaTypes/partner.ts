import { defineField, defineType } from "sanity"
import {TargetIcon} from '@sanity/icons'
export const partner = defineType({
  name: "partner",
  title: "Partners",
  type: "document",
  icon: TargetIcon,
  fields: [
    defineField({
      name: "name",
      title: "Partner Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
    }),
    defineField({
      name: "category",
      title: "Partner Category",
      type: "string",
      options: {
        list: [
          { title: "Technology", value: "technology" },
          { title: "Service", value: "service" },
          { title: "Education", value: "education" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "logo",
    },
  },
})
