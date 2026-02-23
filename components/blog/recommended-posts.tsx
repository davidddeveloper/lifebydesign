import Image from "next/image"
import Link from "next/link"
import type { BlogPost } from "@/payload/lib/types"

interface RecommendedPostsProps {
  posts: BlogPost[]
}

export default function RecommendedPosts({ posts }: RecommendedPostsProps) {
  if (posts.length === 0) return null

  return (
    <section className="py-16 border-t border-border mt-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">More Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/media/blog/${post.slug}`}
              className="group rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
            >
              <div className="relative aspect-video overflow-hidden bg-muted">
                {post.mainImage?.url && (
                  <Image
                    src={post.mainImage.url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>
              <div className="p-4">
                {post.categories?.[0] && (
                  <span className="text-xs font-medium text-primary uppercase">{post.categories[0].title}</span>
                )}
                <h3 className="font-semibold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
