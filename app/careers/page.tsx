import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { careersPageQuery } from "@/sanity/lib/queries"
import type { CareersPage } from "@/sanity/lib/types"
import CareersPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.careers.title,
  description: pageMetadata.careers.description,
  path: "/careers",
  tags: pageMetadata.careers.tags,
})

export const revalidate = 60

export default async function CareersPageRoute() {
  const pageData = await sanityFetch<CareersPage | null>({
    query: careersPageQuery,
    tags: ["careersPage"],
  })

  return <CareersPageClient pageData={pageData} />
}
