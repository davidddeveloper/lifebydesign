"use client"

import { RichText } from "@payloadcms/richtext-lexical/react"

export default function BlogPostContent({ content }: { content: any }) {
  if (!content) return null
  return (
    <RichText
      data={content}
      converters={{}}
    />
  )
}
