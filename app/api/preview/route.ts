import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const PREVIEW_SECRET = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET || "your-preview-secret"

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug") || ""
  const docType = request.nextUrl.searchParams.get("type") || "blog"
  const token = request.nextUrl.searchParams.get("token")

  // Verify token
  const expectedToken = crypto.createHash("sha256").update(`${PREVIEW_SECRET}:${slug}:${docType}`).digest("hex")

  if (token !== expectedToken) {
    return NextResponse.json({ error: "Invalid preview token" }, { status: 401 })
  }

  // Set draft mode
  const response = NextResponse.redirect(new URL(`/blog/${slug}?preview=true`, request.nextUrl.origin))
  response.cookies.set("__draft_mode", "true", {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return response
}
