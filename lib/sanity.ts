import { createClient } from "next-sanity"

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").toLowerCase()

if (!projectId) {
  console.error("[v0] Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable")
}

if (!dataset) {
  console.error("[v0] Missing NEXT_PUBLIC_SANITY_DATASET environment variable")
}

// Read-only client with CDN for fetching public content
export const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
})

// Write client for server-side mutations (creating/updating documents)
// Requires SANITY_API_TOKEN environment variable with write permissions
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export async function getAllBlogPosts() {
  return client.fetch(
    `*[_type == "blog" && published == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{name, image},
      publishedAt,
      image,
      description,
      category->{name, slug},
    }`,
  )
}

export async function getBlogPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "blog" && slug.current == $slug && published == true][0] {
      _id,
      title,
      slug,
      author->{name, image, bio},
      publishedAt,
      image,
      description,
      content,
      category->{name, slug},
    }`,
    { slug },
  )
}

export async function getBlogPostsByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "blog" && category->slug.current == $categorySlug && published == true] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{name, image},
      publishedAt,
      image,
      description,
      category->{name, slug},
    }`,
    { categorySlug },
  )
}

export async function getAllCategories() {
  return client.fetch(
    `*[_type == "category"] | order(name asc) {
      _id,
      name,
      slug,
      description,
    }`,
  )
}

{/*export async function searchBlogPosts(query: string) {
  return client.fetch(
    `*[_type == "blog" && published == true && (title match $query || description match $query)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author->{name, image},
      publishedAt,
      image,
      description,
      category->{name, slug},
    }`,
    { query: `${query}*` },
  )
}*/}

export async function getRecommendedPosts(currentSlug: string, limit = 3) {
  return client.fetch(
    `*[_type == "blog" && published == true && slug.current != $slug] | order(publishedAt desc)[0..${limit - 1}] {
      _id,
      title,
      slug,
      author->{name, image},
      publishedAt,
      image,
      description,
      category->{name, slug},
    }`,
    { slug: currentSlug },
  )
}

export function urlFor(source: any) {
  return `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${source.asset._ref.replace("image-", "").replace("-webp", "")}`
}