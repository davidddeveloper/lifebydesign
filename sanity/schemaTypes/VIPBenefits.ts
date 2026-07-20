import { defineType } from 'sanity'

export const VIPBenefits = defineType({
    name: "VIPBenefits",
    title: "VIP Benefits",
    type: "object",
    fields: [
        {
            name: "benefits",
            type: "array",
            of: [
                {
                    type: "object",
                    fields: [
                        { name: "number", type: "string" },      // #1, #2, #3
                        { name: "title", type: "string" },       // Access to Directors
                        { name: "description", type: "text", rows: 3 },
                        { name: "image", type: "image" },       // optional image for section
                    ],
                },
            ],
        },
    ],
})
