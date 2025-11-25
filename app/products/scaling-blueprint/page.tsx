import { generateMetadata, pageMetadata } from "@/lib/seo"
import ScalingBlueprintPageClient from "./page.client"

export const metadata = generateMetadata({
  title: pageMetadata.scalingBlueprint.title,
  description: pageMetadata.scalingBlueprint.description,
  path: "/products/scaling-blueprint",
  tags: pageMetadata.scalingBlueprint.tags,
})

export default function ScalingBlueprintPage() {
  return <ScalingBlueprintPageClient />
}
