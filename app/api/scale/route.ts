import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.json()

    console.log('this is the form data lol', formData)
    

    const response = await fetch("https://n8n.srv1108378.hstgr.cloud/webhook/81a87bd0-b954-41d3-8dcd-c06a31878457", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (!response.ok) {
      console.log('this is the response', response)
      throw new Error("Failed to submit to n8n")
    }

    const data = await response.json().catch(() => ({}))

    console.log('this is the data 2', data)

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error("API Route Error:", error)
    return NextResponse.json({ success: false, error: "Failed to submit form" }, { status: 500 })
  }
}
