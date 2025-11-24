"use client"

import { PortableTextComponents } from "@portabletext/react"
//import { SanityDocument } from "@sanity/client"
import Image from "next/image"
import imageUrlBuilder from "@sanity/image-url"
import { client } from "@/sanity/lib/client"
//import { he } from "date-fns/locale"

const builder = imageUrlBuilder(client)

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const widthMap = { sm: 300, md: 600, lg: 900, full: 1200 }
      const width = value.size ? widthMap[value.size as keyof typeof widthMap] || 600 : 600
      console.log('this is the width', width)
      const alignment = value.alignment || "center"

      return (
        <div className={`my-8 ${alignment === "center" ? "mx-auto" : alignment === "right" ? "ml-auto" : ""}`}>
          <Image
            src={builder.image(value).url() || "/placeholder.svg"}
            alt={value.alt || "Blog Image"}
            width={width}
            height={Math.floor(width / 1.5)}
            className={"rounded-lg object-cover"}
          />
          {value.caption && <p className="text-sm text-muted-foreground mt-2">{value.caption}</p>}
        </div>
      )
    },

    imageGallery: ({ value }: any) => {
      const columns = value.columns || 2
      return (
        <div className={`grid gap-4 my-8`} style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {value.images.map((img: any, idx: number) => (
            <Image
              key={idx}
              src={builder.image(img).url() || "/placeholder.svg"}
              alt={img.alt || "Gallery Image"}
              width={400}
              height={300}
              className="w-full h-auto object-cover rounded-lg"
            />
          ))}
        </div>
      )
    },

    video: ({ value }: any) => (
      <div className="my-8">
        <iframe
          src={value.url}
          className="w-full aspect-video rounded-lg"
          frameBorder="0"
          allowFullScreen
        />
        {value.caption && <p className="text-sm text-muted-foreground mt-2">{value.caption}</p>}
      </div>
    ),

    callout: ({ value }: any) => (
      <div className={`p-4 my-4 rounded ${value.style === "info" ? "bg-blue-100 text-blue-800" : value.style === "warning" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}>
        {value.text}
      </div>
    ),

    code: ({ value }: any) => (
      <pre className="my-4 p-4 bg-muted rounded overflow-auto">
        <code>{value.code}</code>
      </pre>
    ),

    embed: ({ value }: any) => (
      <div className="my-8">
        <iframe src={value.url} className="w-full aspect-video" frameBorder="0" allowFullScreen />
        {value.caption && <p className="text-sm text-muted-foreground mt-2">{value.caption}</p>}
      </div>
    ),
  },

  block: {
    h2: ({ children }: any) => {
      const text = Array.isArray(children) ? children.join('') : children
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      return (
        <h2 id={id} className="text-3xl font-bold mt-6 mb-3 scroll-mt-24">
          {children}
        </h2>
      )
    },
    h3: ({ children }: any) => {
      const text = Array.isArray(children) ? children.join('') : children
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      return (
        <h3 id={id} className="text-2xl font-bold mt-5 mb-2 scroll-mt-22">
          {children}
        </h3>
      )
    },
    h1: ({ children }: any) => <h1 className="text-4xl font-bold mt-8 mb-4 scroll-mt-24">{children}</h1>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground">{children}</blockquote>
    ),
    normal: ({ children }: any) => <p className="my-4 leading-relaxed text-[#4a4a4a]">{children}</p>,
  },

  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside my-4 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside my-4 space-y-2">{children}</ol>,
  },

  marks: {
    em: ({ children }) => <em className="italic">{children}</em>,
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    code: ({ children }) => <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>,
  },
}
