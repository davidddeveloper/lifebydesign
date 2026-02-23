import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { CareersPageData } from "@/payload/lib/types"
import CareersPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.careers.title,
  description: pageMetadata.careers.description,
  path: "/careers",
  tags: pageMetadata.careers.tags,
})

export const dynamic = 'force-dynamic'

export default async function CareersPageRoute() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'careers-page', depth: 1 }) as CareersPageData

  return <CareersPageClient pageData={pageData} />
}
