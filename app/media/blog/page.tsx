import { sanityFetch } from "@/sanity/lib/fetch"
import { postsQuery } from "@/sanity/lib/queries"
import { SanityDocument } from "next-sanity"

import {Header} from "@/components/Header"
import {Footer} from "@/components/Footer"
import Posts from "@/components/Posts"
import BlogHero from "@/components/blog/blog-hero"

//import {BlogHero} from "@/components/blog-hero"
//import {BlogPosts} from "@/components/blog-posts"

export const metadata = {
  title: "Blog - LBD Startup Bodyshop",
  description: "Stories | Insights on business strategy, entrepreneurship, and howtos from LBD Startup Bodyshop.",
}

export default async function BlogPage() {
  const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery })
  console.log('these are the posts', posts)
  return (
    <>
      <Header />
      <BlogHero />

      <Posts posts={posts} />
      <Footer />
    </>
  )
}
