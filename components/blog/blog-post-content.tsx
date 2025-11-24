import { PortableText } from "@portabletext/react"
import Image from "next/image"
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/lib/sanity"
import { portableTextComponents } from "@/components/portable-text-components";

import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder(client);

const components = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={builder.image(value).url() || "/placeholder.svg"}
          alt="Blog image"
          width={800}
          height={400}
          className="w-full rounded-lg max-h-[300px] object-cover sm:max-h-[400px] lg:max-h-[500px] md:object-contain"
        />
      </div>
    ),
  },
  block: {
    h1: ({ children }: any) => <h1 className="text-3xl font-bold text-foreground mt-8 mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold text-foreground mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-foreground mt-5 mb-2">{children}</h3>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 py-2 my-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => <p className="text-foreground leading-relaxed my-4">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-inside my-4 space-y-2 text-foreground">{children}</ul>,
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-foreground">{children}</ol>
    ),
  },
  marks: {
    em: ({ children }: any) => <em className="italic">{children}</em>,
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    code: ({ children }: any) => <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{children}</code>,
  },
}

export default function BlogPostContent({ content }: { content: any[] }) {
  return <PortableText value={content} components={portableTextComponents} />
}
