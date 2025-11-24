"use client"

import type { SanityDocument } from "next-sanity"
import { useState } from "react"
import BlogHero from "@/components/blog/blog-hero"
import Posts from "@/components/Posts"

interface BlogClientContentProps {
  posts: SanityDocument[]
  categories: SanityDocument[]
}

export default function BlogClientContent({ posts, categories }: BlogClientContentProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <>
      <BlogHero onSearch={setSearchQuery} />
      <Posts posts={posts} categories={categories} searchQuery={searchQuery} />
    </>
  )
}
