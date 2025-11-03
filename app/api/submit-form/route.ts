// /app/api/submit-form/route.ts (Next.js 13+)
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbwcxDg3rllyo-m_QqTE5KLRl1zYhiyWh7prFL8sdeEGKA2IxI-7FenDg1xkIrzAv7imRQ/exec",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )

  const data = await res.json()
  return NextResponse.json(data)
}
