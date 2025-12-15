import { defineField, defineType } from "sanity"

export const page = defineType({
  name: "scalingblueprintpage",
  title: "Scaling Blueprint Page",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Hero: Tagline",
      type: "string",
      validation: (rule) => (rule.required(), rule.max(100)),
    }),
    defineField({
      name: "description",
      title: "Hero Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(100),
    }),

    defineField({
      name: "heroprimarycta",
      title: "Hero: Primary CTA",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(25),
    }),

    defineField({
      name: "herosecondarycta",
      title: "Hero: Secondary CTA",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(25),
    }),

    defineField({
      name: "howitworksheader",
      title: "How it Works Header",
      type: "string"
    }),

    defineField({
      name: "howitworkssubtext",
      title: "How it Works Subtext",
      type: "string"
    }),

    // TODO:
    // HOW IT WORKS LIST OF CARDS EACH CONTAINING:
    // - LOGO, HEADING, TEXT

    defineField({
      name: "keyinsightcard",
      title: "Key Insight Card Text",
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
      ],
    }),

    // foryousection

    defineField({
      name: "foryouheader",
      title: "For You Header",
      type: "string"
    }),

    defineField({
      name: "foryousubtext",
      title: "For You Subtext",
      type: "string"
    }),

    // TODO:
    // FOR YOU LIST OF CARDS EACH CONTAINING:
    // - HEADING, CORE PROBLEM, PAIN POINT, WE FIX

    defineField({
      name: "chooseyourpathheader",
      title: "Choose Your Path Header",
      type: "string"
    }),

    defineField({
      name: "chooseyourpathsubtext",
      title: "Choose Your Path Subtext",
      type: "string"
    }),

    // TODO:
    // CHOOSE YOUR PATH LIST OF CARDS EACH CONTAINING:
    // - HEADING, SUBTEXT, PRICING (string), LIST OF BENEFITS, CTA/BUTTON TEXT, SELECTED BOOLEAN

    defineField({
      name: "whatyougetheader",
      title: "What You Get Header",
      type: "string"
    }),

    defineField({
      name: "whatyougetsubtext",
      title: "What You Get Subtext",
      type: "string"
    }),

    // TODO:
    // HOW IT WORKS LIST OF CARDS EACH CONTAINING:
    // - LOGO, HEADING, TEXT

    defineField({
      name: "whatyougetheader2",
      title: "What You Get Second Header",
      type: "string"
    }),

    defineField({
      name: "whatyougetsubtext",
      title: "What You Get Subtext Header",
      type: "string"
    }),

    defineField({
      name: "faqheader",
      title: "FAQ Header",
      type: "string"
    }),

    // TODO:
    // FAQ LIST
    // - question
    // - answer

    defineField({
      name: "faqcta",
      title: "FAQ CTA",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(25),
    }),

    defineField({
      name: "aboutfounderimage",
      title: "About Founder Image",
      type: "image",
      options: {
        hotspot: true,
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
      title: "title",
      media: "image",
    },
  },
})
