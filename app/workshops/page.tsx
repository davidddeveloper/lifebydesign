import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { WorkshopsPageData } from "@/payload/lib/types"
import WorkshopPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.workshops.title,
  description: pageMetadata.workshops.description,
  path: "/workshops",
  tags: pageMetadata.workshops.tags,
})

export const dynamic = 'force-dynamic'

export default async function WorkshopPage() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'workshops-page', depth: 1 }) as WorkshopsPageData

  return <WorkshopPageClient pageData={pageData} />
}
