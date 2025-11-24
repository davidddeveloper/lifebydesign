"use client"

import { SanityDocument } from "@sanity/client";
import { urlFor } from "@/lib/sanity"
import { PortableText } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import BlogPostContent from "@/components/blog/blog-post-content";

const builder = imageUrlBuilder(client);

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={builder.image(value).url() || "/placeholder.svg"}
          alt={value.alt || "Blog image"}
          width={800}
          height={400}
          className="w-full max-h-[400px] object-cover rounded-lg"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-foreground mt-5 mb-2">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => <p className="text-foreground leading-relaxed my-4">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside my-4 space-y-2 text-foreground">{children}</ul>,
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-foreground">{children}</ol>
    ),
  },
  marks: {
    em: ({ children }: any) => <em className="italic">{children}</em>,
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    code: ({ children }: any) => <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>,
  },
}

const Post = ({ post }: { post: SanityDocument }) => {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
  return (
    <>
      <section className="relative h-96 overflow-hidden bg-muted">
        <Image src={builder.image(post.mainImage).url() || "/placeholder.svg"} alt={post.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-[#177fc9]/30 mix-blend-overlay" />
      </section>

        {/* Content */}
        <article className="max-w-3xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="mb-8">
            {post.categories && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
                {post.categories.map((category: any) => category.title).join(", ")}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">{post.title}</h1>
            <p className="text-lg text-muted-foreground mb-6 line-clamp-2">{post.description}</p>

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

          <div className="prose prose-invert max-w-none">
            <BlogPostContent content={post.body} />
          </div>
        </article>
    </>
  )
}

export default Post