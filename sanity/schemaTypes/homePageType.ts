import { defineField, defineType } from "sanity"

export const homePage = defineType({
  name: "homepage",
  title: "Home Page",
  type: "document",
  options: {
    singleton: true,
  },
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "tagline",
      title: "Hero: Tagline",
      type: "string",
      validation: (rule) => (rule.required(), rule.max(100)),
    }),
    defineField({
      name: "description",
      title: "Hero: First Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(100),
    }),

    defineField({
      name: "seconddescription",
      title: "Hero: Second Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(85),
    }),

    defineField({
      name: "herocta",
      title: "Hero: CTA",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(25),
    }),

    defineField({
      name: "heroimage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: "faqheader",
      title: "FAQ Header",
      type: "string"
    }),

    // TODO:
    // FAQ LIST

    defineField({
      name: "faqcta",
      title: "FAQ CTA",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(25),
    }),

    defineField({
      name: "aboutfounderheader",
      title: "About Founder Header",
      type: "string"
    }),

    defineField({
      name: "aboutfounderimage",
      title: "About Founder Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),

    // TODO:
    // Add font colors
    defineField({
      name: "aboutfoundertext",
      title: "About Founder Text",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
    }),

    //TODO:
    //Add list of images


    defineField({
      name: "content",
      title: "Page Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H1", value: "h1" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
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
      title: "title",
      media: "image",
    },
  },
} as any)
