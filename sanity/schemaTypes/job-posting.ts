import { defineField, defineType } from "sanity"
import { CaseIcon } from "@sanity/icons"

export const jobPosting = defineType({
  name: "jobPosting",
  title: "Job Postings",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Job Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
      description: "Used as a stable job id for applications (e.g. financial-management-partner)",
    }),
    defineField({
      name: "department",
      title: "Department",
      type: "string",
      options: {
        list: [
          { title: "Finance", value: "Finance" },
          { title: "Creative & Media", value: "Creative & Media" },
          { title: "Operations", value: "Operations" },
          { title: "Product", value: "Product" },
          { title: "Sales", value: "Sales" },
          { title: "Engineering", value: "Engineering" },
          { title: "Other", value: "Other" },
        ],
      },
    }),
    defineField({
      name: "type",
      title: "Employment Type",
      type: "string",
      initialValue: "Full-time Partnership",
      options: {
        list: [
          { title: "Full-time Partnership", value: "Full-time Partnership" },
          { title: "Full-time", value: "Full-time" },
          { title: "Part-time", value: "Part-time" },
          { title: "Contract", value: "Contract" },
          { title: "Internship", value: "Internship" },
        ],
      },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      initialValue: "Freetown, Sierra Leone",
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      rows: 3,
      description: "Shown on the careers/jobs listing card",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "responsibilities",
      title: "Key Responsibilities",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "compensation",
      title: "Compensation",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "applicationEmail",
      title: "Application Email",
      type: "string",
      initialValue: "info@lbd.sl",
      description: "Optional contact email shown for this role",
    }),
    defineField({
      name: "published",
      title: "Published",
      type: "boolean",
      initialValue: true,
      description: "Only published jobs appear on /careers/jobs",
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 0,
      description: "Lower numbers appear first",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: "Sort Order",
      name: "sortOrderAsc",
      by: [{ field: "sortOrder", direction: "asc" }],
    },
    {
      title: "Published At, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      department: "department",
      published: "published",
    },
    prepare({ title, department, published }) {
      return {
        title: title || "Untitled role",
        subtitle: `${department || "No department"}${published === false ? " · Draft" : ""}`,
      }
    },
  },
})
