import { sanityFetch } from "@/sanity/lib/fetch"
import { postsQuery, categoriesQuery } from "@/sanity/lib/queries"
import type { SanityDocument } from "next-sanity"

import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import BlogClientContent from "@/components/blog/blog-client-component"

import { generateMetadata, pageMetadata } from "@/lib/seo"

export const metadata = generateMetadata({
  title: pageMetadata.blog.title,
  description: pageMetadata.blog.description,
  path: "/blog",
  tags: pageMetadata.blog.tags,
})

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
