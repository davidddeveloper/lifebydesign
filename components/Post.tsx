"use client"

import { SanityDocument } from "@sanity/client";
//import { urlFor } from "@/lib/sanity"
//import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import BlogPostContent from "@/components/blog/blog-post-content";
import TableOfContents from "@/components/blog/table-of-contents"

const builder = imageUrlBuilder(client);

const Post = ({ post }: { post: SanityDocument }) => {
  if (!post) {
    return null
  }
  
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  return (
    <>
      <section className="relative h-68 sm:h-96 overflow-hidden bg-muted">
        <Image src={builder.image(post.mainImage).url() || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#177fc9]/30 mix-blend-overlay" />
      </section>

      <div className="relative grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 pt-16 lg:col-span-3">
          {/* Header */}
          <div className="mb-8">
            {post.categories && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {post.categories.map((category: any) => category.title).join(", ")}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{post.title}</h1>
            <p className="text-md lg:text-lg text-muted-foreground mb-6 line-clamp-2">{post.description}</p>

            {/* Author & Date */}
            <div className="flex items-center gap-4 pt-6 border-t border-border">
              {post.author?.image && (
                <Image
                  src={builder.image(post.author.image).url() || "/placeholder.svg"}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-semibold text-foreground">{post.author?.name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">{publishedDate}</p>
              </div>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-5">
            <BlogPostContent content={post.body} />
          </div>
        </article>

        {/* Table of Contents (Sidebar) */}
        <aside className="relative col-span-1 mt-10">
          <TableOfContents content={post.body} />
        </aside>
      </div>
    </>
  )
}

export default Post