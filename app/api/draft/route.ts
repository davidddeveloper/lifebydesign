import { draftMode } from "next/headers"
import { redirect } from "next/navigation"
import { validatePreviewUrl } from "@sanity/preview-url-secret" // Standard Sanity validation
import { client } from "@/sanity/lib/client" // Using the client from lib
import { token } from "@/sanity/lib/fetch" // Using the read token

const clientWithToken = client.withConfig({ token })

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get("secret")
    const slug = searchParams.get("slug")

    // 1. Check for secret if you want to implement it manually, 
    // OR use Sanity's `validatePreviewUrl` if you have the secret set up in the studio side.
    // The checking plan below is a simple manual secret check compatible with typical .env setups.

    const expectedSecret = process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET

    if (secret !== expectedSecret) {
        return new Response("Invalid token", { status: 401 })
    }

    // 2. Enable Draft Mode
    const draft = await draftMode();
    draft.enable();

    // 3. Redirect to the slug or root
    redirect(slug || "/")
}
