import { generateMetadata as generateSEOMetadata, siteConfig } from "@/lib/seo"
import { SanityDocument } from "@sanity/client";
import { postPathsQuery, postQuery, recommendedPostsQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Post from "@/components/Post";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

import RecommendedPosts from "@/components/blog/recommended-posts"

const builder = imageUrlBuilder(client);

export const revalidate = 60;

export interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  author?: { name: string; image?: any }
  publishedAt: string
  mainImage?: any
  description: string
  category?: { name: string; slug: { current: string } }
}

export async function generateStaticParams() {
  const posts = await client.fetch(postPathsQuery);
  return posts.map((post: { slug: { current: any; }; }) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await sanityFetch<BlogPost>({ query: postQuery, params: { slug: slug } })

  if (!post) {
    return {}
  }

  const imageUrl = post.mainImage ? builder.image(post.mainImage).url() : `${siteConfig.baseUrl}/images/og-image.png`

  return generateSEOMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug.current}`,
    image: imageUrl,
    type: "article",
    author: post.author?.name,
    publishedDate: new Date(post.publishedAt),
    tags: [post.category?.name, "business", "entrepreneurship", "insights"].filter(Boolean) as string[],
  })
}

const BlogPostPage = async ({ params }: { params: any }) => {
  const post = await sanityFetch<SanityDocument>({ query: postQuery, params })
  let recommendedPosts = await sanityFetch<BlogPost[]>({ query: recommendedPostsQuery, params})
  // Filter out the current post
  recommendedPosts = recommendedPosts.filter((p) => p._id !== post._id)
  return (
    <>
      <Header />
      <Post post={post} />
      {/* Recommended Posts */}
      <div className="max-w-7xl mx-auto px-4">
        <RecommendedPosts posts={recommendedPosts} />
      </div>
      <Footer />
    </>
  )
}

export default BlogPostPage