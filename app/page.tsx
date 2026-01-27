import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { homePageQuery } from "@/sanity/lib/queries"
import type { HomePage } from "@/sanity/lib/types"
import HomeClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.home.title,
  description: pageMetadata.home.description,
  path: "/",
  tags: pageMetadata.home.tags,
})

export const revalidate = 60

export default async function Page() {
  const pageData = await sanityFetch<HomePage | null>({
    query: homePageQuery,
    tags: ["homePage"],
  })

  return <HomeClient pageData={pageData} />
}
