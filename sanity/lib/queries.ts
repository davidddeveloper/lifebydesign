import { groq } from "next-sanity";

// Get all posts
export const postsQuery = groq`*[_type == "post"] {
  _id,
  _createdAt,
  publishedAt,
  title,
  description,
  slug,
  mainImage,
  author->{name, image, bio},
  categories[]->{
    _id,
    title,
    slug
  }
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{
  _id,
  _createdAt,
  publishedAt,
  title,
  slug,
  author->{name, image, bio},
  description,
  mainImage,
  body,
  categories[]->{
    _id,
    title,
    slug
  }
}`;

// Get all categories
export const categoriesQuery = groq`*[_type == "category"] | order(name asc){
  _id,
  title,
  slug,
  description,
}`;

export const recommendedPostsQuery = groq`*[_type == "post"] | order(_createdAt desc) [0...6] {
  _id,
  _createdAt,
  publishedAt,
  title,
  description,
  slug,
  mainImage,
  author->{name, image, bio},
  categories[]->{
    _id,
    title,
    slug
  }
}`

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }`;