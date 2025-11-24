import type { SanityDocument } from "@sanity/client";
import BlogGrid from "@/components/blog/blog-grid";

const Posts = ({ posts = [] }: { posts: SanityDocument[] }) => {

  return (
    <>
      <BlogGrid posts={posts}/>
    </>
  )
}

export default Posts