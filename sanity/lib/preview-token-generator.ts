import crypto from "crypto"

export function generatePreviewToken(slug: string, docType = "blog"): string {
  const secret = process.env.SANITY_PREVIEW_SECRET || "your-preview-secret"
  return crypto.createHash("sha256").update(`${secret}:${slug}:${docType}`).digest("hex")
}

export function generatePreviewUrl(slug: string, docType = "blog", origin = ""): string {
  const baseUrl = origin || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const token = generatePreviewToken(slug, docType)
  return `${baseUrl}/api/preview?slug=${slug}&type=${docType}&token=${token}`
}
