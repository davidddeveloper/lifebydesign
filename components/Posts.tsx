import type { BlogPost, BlogCategory } from "@/payload/lib/types"
import BlogGrid from "@/components/blog/blog-grid"

const Posts = ({ posts = [], categories = [], searchQuery }: { posts: BlogPost[], categories: BlogCategory[], searchQuery: string }) => {
  return <BlogGrid posts={posts} categories={categories} searchQuery={searchQuery} />
}

export default Posts
