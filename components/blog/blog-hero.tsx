"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"

interface BlogHeroProps {
  onSearch?: (query: string) => void
}

export default function BlogHero({ onSearch }: BlogHeroProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <section className="px-4 py-16 md:py-24 bg-linear-to-br from-primary/10 via-background to-background">
      <div className="max-w-4xl mx-auto">
        {/* Title and Description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Insights & Stories</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Explore our latest thoughts on business strategy, entrepreneurship, startups in Africa, and building a life by design.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </form>
      </div>
    </section>
  )
}
