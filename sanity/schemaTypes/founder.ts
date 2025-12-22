import { defineField, defineType } from "sanity"
import { UserIcon } from "@sanity/icons"

export const founder = defineType({
  name: "founder",
  title: "Founder",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "image",
      title: "Founder Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "bio",
      title: "Bio / Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Rich text – you can format this content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "role",
      title: "Role / Title",
      type: "string",
      initialValue: "Founder",
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
      subtitle: "role",
      media: "image",
    },
  },
})
