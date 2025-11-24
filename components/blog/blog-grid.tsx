"use client"

import { useState } from "react"
import BlogCard from "./blog-card"
import type { SanityDocument } from "@sanity/client";

const CATEGORIES = [
  { label: "All", value: null },
  { label: "Business Strategy", value: "business-strategy" },
  { label: "Entrepreneurship", value: "entrepreneurship" },
  { label: "Design", value: "design" },
  { label: "Leadership", value: "leadership" },
  { label: "Case Study", value: "case-study" },
]

export default function BlogGrid({ posts }: { posts: SanityDocument[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredPosts = selectedCategory ? posts.filter((post) => post.category === selectedCategory) : posts

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-12 justify-center">
        {CATEGORIES.map((category) => (
          <button
            key={category.value || "all"}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            }`}
          >
            {category.label}
          </button>
        ))}
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
          <p className="text-muted-foreground text-lg">No posts found in this category.</p>
        </div>
      )}
    </section>
  )
}
