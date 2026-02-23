import { getPayloadClient } from "@/payload"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import BlogClientContent from "@/components/blog/blog-client-component"
import { generateMetadata, pageMetadata } from "@/lib/seo"
import type { BlogPost, BlogCategory } from "@/payload/lib/types"

export const metadata = generateMetadata({
  title: pageMetadata.blog.title,
  description: pageMetadata.blog.description,
  path: "/blog",
  tags: pageMetadata.blog.tags,
})

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayloadClient()

  const [postsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
    }),
  ])

  const posts = postsResult.docs as BlogPost[]
  const categories = categoriesResult.docs as BlogCategory[]

  return (
    <>
      <Header />
      <BlogClientContent posts={posts} categories={categories} />
      <Footer />
    </>
  )
}
