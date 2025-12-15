import { defineField, defineType } from "sanity"

export const page = defineType({
  name: "Careers Page",
  title: "Kolat Books",
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
        name: "heroimage",
        title: "Hero Image",
        type: "image",
        options: {
        hotspot: true,
        },
    }),

    // what we look for

    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => (rule.required(), rule.max(100)),
    }),
    defineField({
      name: "headlinesubtext",
      title: "Headline Subtext",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(100),
    }),

    defineField({
        name: "headline",
        title: "Headline Image",
        type: "image",
        options: {
        hotspot: true,
        },
    }),

    // TODO: 
    // WHAT WE LOOK FOR CARD CONTAINING:
    // - HEADING, TEXT, IMAGE


    defineField({
      name: "workinghereheader",
      title: "Working Here Header",
      type: "string"
    }),

    // TODO:
    // WHY WORK HERE TEAM CARD FROM TEAM MEMBER TYPE SHOWING
    // - WHY I LOVE WORKING HERE, (PROFILE PICTURE, NAME)

    defineField({
      name: "valueheader",
      title: "Value Header",
      type: "string"
    }),

    defineField({
      name: "valuesubtext",
      title: "Value Subtext",
      type: "string"
    }),

    // TODO:
    // VALUES CARD FROM VALUE TYPE SHOWING
    // - LOGO, HEADER, SUBTEXT

    defineField({
      name: "benefitsheader",
      title: "Benefit Header",
      type: "string"
    }),

    // TODO:
    // BENEFIT CARD FROM BENEFIT TYPE SHOWING
    // - LOGO, HEADER, SUBTEXT

    defineField({
      name: "promisetoyoucontent",
      title: "Promise to You Content",
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

    defineField({
      name: "whatisincludedheader",
      title: "What is Included Header",
      type: "string"
    }),

    // TODO:
    // HOW IT WORKS LIST OF CARDS EACH CONTAINING:
    // - LOGO, HEADING, TEXT


    defineField({
      name: "deliveryworkflowheader",
      title: "Delivery Workflow Header",
      type: "string"
    }),

    defineField({
      name: "deliveryworkflowsubtext",
      title: "Delivery Workflow Subtext",
      type: "string"
    }),

    defineField({
      name: "pricingheader",
      title: "Pricing Header",
      type: "string"
    }),

    defineField({
      name: "pricingsubtext",
      title: "Pricing Subtext",
      type: "string"
    }),

    // TODO:
    // LIST OF PRICING PLAN CARD:
    // HEADER, SUBTEXT, PRICING, PRICING SUBTEXT, CTA/BUTTON TEXT, LIST OF BENEFITS, SELECTED - BOOLEAN 


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
