import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { KolatBooksPageData } from "@/payload/lib/types"
import KolatBooksPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.kolatBooks.title,
  description: pageMetadata.kolatBooks.description,
  path: "/products/finance-freedom",
  tags: pageMetadata.kolatBooks.tags,
})

export const dynamic = 'force-dynamic'

export default async function KolatBooksPageRoute() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'kolat-books-page', depth: 1 }) as KolatBooksPageData

  return <KolatBooksPageClient pageData={pageData} />
}
