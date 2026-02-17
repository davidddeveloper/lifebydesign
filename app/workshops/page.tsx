import { Suspense } from "react"
import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/live"
import { workshopsPageQuery } from "@/sanity/lib/queries"
import WorkshopPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.workshops.title,
  description: pageMetadata.workshops.description,
  path: "/workshops",
  tags: pageMetadata.workshops.tags,
})

export default async function WorkshopPage() {
  const { data: pageData } = await sanityFetch({ query: workshopsPageQuery })

  return (
    <Suspense>
      <WorkshopPageClient pageData={pageData} />
    </Suspense>
  )
}
