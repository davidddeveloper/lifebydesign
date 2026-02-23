import { generateMetadata, pageMetadata } from "@/lib/seo"
import { getPayloadClient } from "@/payload"
import type { ScalingBlueprintPageData } from "@/payload/lib/types"
import ScalingBlueprintPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.scalingBlueprint.title,
  description: pageMetadata.scalingBlueprint.description,
  path: "/products/scaling-blueprint",
  tags: pageMetadata.scalingBlueprint.tags,
})

export const dynamic = 'force-dynamic'

export default async function ScalingBlueprintPageRoute() {
  const payload = await getPayloadClient()
  const pageData = await payload.findGlobal({ slug: 'scaling-blueprint-page', depth: 1 }) as ScalingBlueprintPageData

  return <ScalingBlueprintPageClient pageData={pageData} />
}
