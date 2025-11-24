import type { SanityDocument } from "@sanity/client";
import BlogGrid from "@/components/blog/blog-grid";

const Posts = ({ posts = [], categories = [], searchQuery }: { posts: SanityDocument[], categories: SanityDocument[], searchQuery: string }) => {

  return (
    <>
      <BlogGrid posts={posts} categories={categories} searchQuery={searchQuery}/>
    </>
  )
}

export default Posts