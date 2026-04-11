// app/api/audit-chat/route.ts
// AI chat endpoint for the Results Assistant widget.
// Receives the user's question + their audit context, returns a short answer.

import { NextRequest, NextResponse } from "next/server"
import Anthropic from "@anthropic-ai/sdk"

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a business growth advisor at Startup Bodyshop in Sierra Leone. A business owner has just completed their Constraint-Busting Business Audit and is looking at their results. You have their full diagnostic report and scores in the context provided.

Your job is to answer their questions about their results — what they mean, what to do next, how to interpret a specific score, or any other question about their business.

Rules:
— Be specific to THIS person's results. Always reference their actual scores and constraint.
— Be direct and practical. No fluff, no filler.
— Keep answers under 150 words unless more detail is genuinely needed.
— Write in plain English. No jargon.
— If they ask what to do, give them 2-3 concrete, actionable steps — not vague advice.
— Never say "I don't have access to" — you have all the context needed.
— Don't recommend external tools or services beyond Startup Bodyshop's own programmes.
— Use **bold** for emphasis on key points or action items.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message?.trim()) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    const contextBlock = context ? `
AUDIT CONTEXT FOR THIS OWNER:
Business: ${context.businessName || "Unknown"}
Primary Constraint: ${context.primaryConstraint || "Unknown"}

Lever Scores (out of 10):
- WHO (Market): ${context.scores?.who ?? "?"}
- WHAT (Offer): ${context.scores?.what ?? "?"}
- FIND YOU (Traffic): ${context.scores?.traffic ?? "?"}
- SELL (Conversion): ${context.scores?.sell ?? "?"}
- DELIVER (Operations): ${context.scores?.operations ?? "?"}

Diagnostic narrative:
What is working: ${context.narrative?.whatIsWorking || "—"}
Primary constraint: ${context.narrative?.constraint || "—"}
What this costs: ${context.narrative?.cost || "—"}
Root cause: ${context.narrative?.rootCause || "—"}
Recommended next step: ${context.narrative?.nextStep || "—"}
`.trim() : ""

    const userMessage = contextBlock
      ? `${contextBlock}\n\nOwner's question: ${message}`
      : message

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001", // Fast model for chat
      max_tokens: 350,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    })

    const reply = response.content[0].type === "text" ? response.content[0].text : ""

    return NextResponse.json({ reply }, { status: 200 })
  } catch (error: any) {
    console.error("[audit-chat] error:", error)
    return NextResponse.json(
      { reply: "Sorry, I couldn't generate a response right now. Please try again." },
      { status: 200 } // Return 200 so the widget handles it gracefully
    )
  }
}
