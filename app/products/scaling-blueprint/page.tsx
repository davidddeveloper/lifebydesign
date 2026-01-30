import { generateMetadata, pageMetadata } from "@/lib/seo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { scalingBlueprintPageQuery } from "@/sanity/lib/queries"
import type { ScalingBlueprintPage } from "@/sanity/lib/types"
import ScalingBlueprintPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.scalingBlueprint.title,
  description: pageMetadata.scalingBlueprint.description,
  path: "/products/scaling-blueprint",
  tags: pageMetadata.scalingBlueprint.tags,
})

export const revalidate = 0

export default async function ScalingBlueprintPageRoute() {
  const pageData = await sanityFetch<ScalingBlueprintPage | null>({
    query: scalingBlueprintPageQuery,
    tags: ["scalingBlueprintPage"],
  })

  return <ScalingBlueprintPageClient pageData={pageData} />
}
