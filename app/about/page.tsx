import AboutPageClient from "./page.client"
import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { aboutPageQuery } from "@/sanity/lib/queries"
import type { AboutPage } from "@/sanity/lib/types"

export const metadata = generateMetadata({
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  path: "/about",
  tags: pageMetadata.about.tags,
})

export const revalidate = 60

export default async function AboutPageRoute() {
  const pageData = await sanityFetch<AboutPage | null>({
    query: aboutPageQuery,
    tags: ["aboutPage"],
  })

  return <AboutPageClient pageData={pageData} />
}
