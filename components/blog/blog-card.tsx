import Link from "next/link"
import Image from "next/image"
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import type { SanityDocument } from "@sanity/client";

const builder = imageUrlBuilder(client);

export default function BlogCard({ post }: SanityDocument[keyof SanityDocument]) {
  const publishedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const imageUrl = post.mainImage ? builder.image(post.mainImage).url() : "/blog-post.jpg"

  return (
    <Link href={`/media/blog/${post.slug.current}`}>
      <article className="group h-full rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col h-full">
          {/* Category Badge */}
          {post.categories && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {post.categories.map((category: any) => category.title).join(", ")}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Description */}
          {post.description && (
            <div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-grow">{post.description}</p>
            </div>
            )
          }

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              {post.author?.image && (
                <Image
                  src={builder.image(post.author.image).url() || "/placeholder.svg"}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div className="text-xs">
                <p className="font-medium text-foreground">{post.author?.name || "Anonymous"}</p>
                <p className="text-muted-foreground">{publishedDate}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
