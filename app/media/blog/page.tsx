import { sanityFetch } from "@/sanity/lib/fetch"
import { postsQuery, categoriesQuery } from "@/sanity/lib/queries"
import type { SanityDocument } from "next-sanity"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import BlogClientContent from "@/components/blog/blog-client-component"

export const metadata = {
  title: "Blog - LBD Startup Bodyshop",
  description: "Stories | Insights on business strategy, entrepreneurship, and howtos from LBD Startup Bodyshop.",
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    sanityFetch<SanityDocument[]>({ query: postsQuery }),
    sanityFetch<SanityDocument[]>({ query: categoriesQuery }),
  ])

  console.log('this is the posts and categories', posts, categories)

  return (
    <>
      <Header />
      <BlogClientContent posts={posts} categories={categories} />
      <Footer />
    </>
  )
}
