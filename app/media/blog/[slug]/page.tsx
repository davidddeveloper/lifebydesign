import { generateMetadata as generateSEOMetadata, siteConfig } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { BlogPost } from "@/payload/lib/types"
import Post from "@/components/Post"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import RecommendedPosts from "@/components/blog/recommended-posts"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  const payload = await getPayloadClient()
  const posts = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    select: { slug: true },
    limit: 1000,
  })
  return posts.docs.map((post: any) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  })

  const post = result.docs[0] as BlogPost | undefined
  if (!post) return {}

  const imageUrl = post.mainImage?.url || `${siteConfig.baseUrl}/images/og-image.png`

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: imageUrl,
    type: "article",
    author: post.author?.name,
    publishedDate: post.publishedAt ? new Date(post.publishedAt) : undefined,
    tags: ["business", "entrepreneurship", "insights"],
  })
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayloadClient()

  const [postResult, recommendedResult] = await Promise.all([
    payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      depth: 1,
      limit: 1,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      depth: 1,
      limit: 7,
    }),
  ])

  const post = postResult.docs[0] as BlogPost | undefined
  if (!post) notFound()

  const recommendedPosts = (recommendedResult.docs as BlogPost[]).filter(p => p.id !== post.id).slice(0, 6)

  return (
    <>
      <Header />
      <Post post={post} />
      <div className="max-w-7xl mx-auto px-4">
        <RecommendedPosts posts={recommendedPosts} />
      </div>
      <Footer />
    </>
  )
}
