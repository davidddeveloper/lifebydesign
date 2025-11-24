"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

interface Heading {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  content: any[]
}

const generateHeadingId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Extract headings from content blocks
    const extractedHeadings: Heading[] = content
      .filter((block) => block._type === "block" && (block.style === "h2" || block.style === "h3"))
      .map((block) => {
        const text = block.children?.map((child: any) => child.text).join("") || ""
        const id = generateHeadingId(text)
        return { level: block.style === "h2" ? 2 : 3, text, id }
      })

    setHeadings(extractedHeadings)
  }, [content])

  if (headings.length === 0) return null

  const handleLinkClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    setIsOpen(false)
  }


  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-24 right-4 z-20 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        aria-label="Toggle table of contents"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className="hidden lg:block sticky top-24 h-fit">
        <div className="bg-muted/50 rounded-lg p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
          <nav className="space-y-2">
            {headings.map((heading, index) => (
              <a
                key={index}
                onClick={() => handleLinkClick(heading.id)}
                href={`#${heading.id}`}
                className={`block text-sm transition-colors hover:text-primary ${
                  heading.level === 3 ? "ml-4 text-muted-foreground" : "text-foreground"
                }`}
              >
                {heading.text}
              </a>
            ))}

          </nav>
        </div>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
            />
            {/* Sheet */}
            <motion.aside
              key="sheet"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-24 right-0 bottom-0 w-64 bg-background border-l border-border shadow-lg z-40 overflow-y-auto"
            >
              <div className="p-6">
                <h3 className="font-semibold text-foreground mb-4 text-lg">Table of Contents</h3>
                <nav className="space-y-3">
                  {headings.map((heading, index) => (
                    <motion.a
                      key={index}
                      onClick={() => handleLinkClick(heading.id)}
                      href={`#${heading.id}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`block text-sm transition-colors hover:text-primary ${
                        heading.level === 3 ? "ml-4 text-muted-foreground" : "text-foreground font-medium"
                      }`}
                    >
                      {heading.text}
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
