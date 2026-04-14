"use client"

// components/FeedbackWidget.tsx
// Floating feedback button + slide-up panel.
// Controlled by NEXT_PUBLIC_SHOW_BETA_TAG=true env variable.
// Usage: <FeedbackWidget page="constraint-audit" auditId={...} brandColor="#1A1A1A" />

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  page?: string
  auditId?: string | null
  brandColor?: string
  side?: "left" | "right"
  positionClassName?: string
}

const STARS = [1, 2, 3, 4, 5]

export default function FeedbackWidget({ page, auditId, brandColor = "#1A1A1A", side = "right", positionClassName }: Props) {
  const [open, setOpen]       = useState(false)
  const [rating, setRating]   = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [name, setName]       = useState("")
  const [state, setState]     = useState<"idle" | "sending" | "done" | "error">("idle")

  if (process.env.NEXT_PUBLIC_SHOW_BETA_TAG !== "true") return null

  async function handleSubmit() {
    if (!message.trim()) return
    setState("sending")
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, rating, message, name: name || null, auditId: auditId || null }),
      })
      if (!res.ok) throw new Error("Failed")
      setState("done")
    } catch {
      setState("error")
    }
  }

  function handleClose() {
    setOpen(false)
    // Reset after close animation
    setTimeout(() => {
      setState("idle")
      setMessage("")
      setRating(null)
      setName("")
    }, 300)
  }

  return (
    <>
      {/* Trigger button */}
      <div className={positionClassName ?? `fixed bottom-5 z-50 flex flex-col gap-2 ${side === "left" ? "left-5 items-start" : "right-5 items-end"}`}>
        <AnimatePresence>
          {open && (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="w-80 bg-white rounded-2xl shadow-2xl border border-[#E5E5E5] overflow-hidden"
              style={{ transformOrigin: positionClassName ? "bottom center" : side === "left" ? "bottom left" : "bottom right" }}
            >
              {/* Header */}
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #F0F0F0" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    Beta
                  </span>
                  <span className="text-sm font-semibold text-[#1A1A1A]">Share your feedback</span>
                </div>
                <button onClick={handleClose} className="text-[#AAA] hover:text-[#555] transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                {state === "done" ? (
                  <div className="py-6 flex flex-col items-center gap-3 text-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg"
                      style={{ backgroundColor: brandColor }}
                    >
                      ✓
                    </div>
                    <p className="text-sm font-semibold text-[#1A1A1A]">Thank you!</p>
                    <p className="text-xs text-[#888]">Your feedback helps us improve.</p>
                    <button
                      onClick={handleClose}
                      className="mt-2 text-xs text-[#AAA] hover:text-[#555] underline transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Star rating */}
                    <div className="mb-4">
                      <p className="text-xs text-[#888] mb-2">How is your experience so far?</p>
                      <div className="flex gap-1">
                        {STARS.map(s => (
                          <button
                            key={s}
                            onClick={() => setRating(s)}
                            className="text-xl transition-transform hover:scale-110"
                          >
                            <span style={{ color: rating !== null && s <= rating ? "#F59E0B" : "#D1D5DB" }}>★</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                      <textarea
                        rows={3}
                        placeholder="What's working well? What could be better?"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full text-sm text-[#1A1A1A] placeholder-[#BBB] border border-[#E5E5E5] rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:ring-2 transition-all"
                        style={{ focusRingColor: brandColor } as any}
                        onFocus={e => (e.target.style.borderColor = brandColor)}
                        onBlur={e => (e.target.style.borderColor = "#E5E5E5")}
                      />
                    </div>

                    {/* Name (optional) */}
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full text-sm text-[#1A1A1A] placeholder-[#BBB] border border-[#E5E5E5] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 transition-all"
                        onFocus={e => (e.target.style.borderColor = brandColor)}
                        onBlur={e => (e.target.style.borderColor = "#E5E5E5")}
                      />
                    </div>

                    {state === "error" && (
                      <p className="text-xs text-red-500 mb-3">Something went wrong — please try again.</p>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={!message.trim() || state === "sending"}
                      className="w-full py-2.5 text-sm font-semibold text-white rounded-lg transition-colors disabled:opacity-40"
                      style={{ backgroundColor: brandColor }}
                    >
                      {state === "sending" ? "Sending…" : "Send feedback"}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-2 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg transition-all"
          style={{ backgroundColor: brandColor }}
        >
          {open ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
          <span className="flex items-center gap-1.5">
            <span
              className="text-[8px] font-bold uppercase tracking-widest bg-white rounded px-1 py-0.5"
              style={{ color: brandColor }}
            >
              Beta
            </span>
            Feedback
          </span>
        </motion.button>
      </div>
    </>
  )
}
