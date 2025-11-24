"use client"

import { useState, useMemo } from "react"
import BlogCard from "./blog-card"
import type { SanityDocument } from "next-sanity"

interface BlogGridProps {
  posts: SanityDocument[]
  categories: SanityDocument[]
  searchQuery?: string
}

export default function BlogGrid({ posts, categories, searchQuery = "" }: BlogGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = useMemo(() => {
    let filtered = posts

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.categories?.some((category: { slug: { current: string } }) => category.slug.current === selectedCategory)
      )
    }

    console.log("this is the filtered posts", filtered)

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(lowerQuery) ||
          post.description?.toLowerCase().includes(lowerQuery) ||
          post.category?.name.toLowerCase().includes(lowerQuery),
      )
    }

    return filtered
  }, [posts, selectedCategory, searchQuery])

  return (
    <section className="px-4 pt-4 pb-8 max-w-7xl mx-auto">
      {/* Category Filter */}
      <div className="mb-12">
        <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Filter by category
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            All Posts
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category.slug.current)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category.slug.current
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {category.title}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {searchQuery ? "No posts match your search." : "No posts found in this category."}
          </p>
        </div>
      )}
    </section>
  )
}
