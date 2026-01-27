import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { kolatBooksPageQuery } from "@/sanity/lib/queries"
import type { KolatBooksPage } from "@/sanity/lib/types"
import KolatBooksPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.kolatBooks.title,
  description: pageMetadata.kolatBooks.description,
  path: "/products/finance-freedom",
  tags: pageMetadata.kolatBooks.tags,
})

export const revalidate = 60

export default async function KolatBooksPageRoute() {
  const pageData = await sanityFetch<KolatBooksPage | null>({
    query: kolatBooksPageQuery,
    tags: ["kolatBooksPage"],
  })

  return <KolatBooksPageClient pageData={pageData} />
}
