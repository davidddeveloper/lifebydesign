import AboutPageClient from "./page.client"
import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { AboutPageData } from "@/payload/lib/types"

export const metadata = generateMetadata({
  title: pageMetadata.about.title,
  description: pageMetadata.about.description,
  path: "/about",
  tags: pageMetadata.about.tags,
})

export const dynamic = 'force-dynamic'

export default async function AboutPageRoute() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'about-page', depth: 1 }) as AboutPageData

  return <AboutPageClient pageData={pageData} />
}
