import { Suspense } from "react"
import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { workshopsPageQuery } from "@/sanity/lib/queries"
import type { WorkshopsPage } from "@/sanity/lib/types"
import WorkshopPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.workshops.title,
  description: pageMetadata.workshops.description,
  path: "/workshops",
  tags: pageMetadata.workshops.tags,
})

export const revalidate = 0

export default async function WorkshopPage() {
  const pageData = await sanityFetch<WorkshopsPage | null>({
    query: workshopsPageQuery,
    tags: ["workshopsPage"],
  })

  return (
    <Suspense>
      <WorkshopPageClient pageData={pageData} />
    </Suspense>
  )
}
