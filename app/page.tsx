import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { HomePageData } from "@/payload/lib/types"
import HomeClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  path: "/",
  tags: pageMetadata.home.tags,
})

export const dynamic = 'force-dynamic'

export default async function Page() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'home-page', depth: 1 }) as HomePageData

  return <HomeClient pageData={pageData} />
}
