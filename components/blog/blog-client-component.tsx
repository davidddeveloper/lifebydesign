"use client"

import { useState } from "react"
import BlogHero from "@/components/blog/blog-hero"
import Posts from "@/components/Posts"
import type { BlogPost, BlogCategory } from "@/payload/lib/types"

interface BlogClientContentProps {
  posts: BlogPost[]
  categories: BlogCategory[]
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
