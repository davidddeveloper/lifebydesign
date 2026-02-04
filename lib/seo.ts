import type { Metadata } from "next"

export const siteConfig = {
  name: "LBD Startup Bodyshop",
  domain: "startupbodyshop.com",
  baseUrl: "https://startupbodyshop.com",
  description:
    "Empowering entrepreneurs to design businesses and lives of impact through proven systems, expert guidance, and community support.",
  logo: "https://startupbodyshop.com/images/og-image.png",
  social: {
    twitter: "@startupbodyshop",
    linkedin: "startup-bodyshop",
  },
}

export interface MetadataParams {
  title: string
  description: string
  path: string
  image?: string
  type?: "website" | "article" | "profile"
  author?: string
  publishedDate?: Date
  modifiedDate?: Date
  tags?: string[]
  canonical?: string
}

export function generateMetadata(params: MetadataParams): Metadata {
  const {
    title,
    description,
    path,
    image = siteConfig.logo,
    type = "website",
    author,
    publishedDate,
    modifiedDate,
    tags,
    canonical,
  } = params

  const url = `${siteConfig.baseUrl}${path}`
  const ogImage = image.startsWith("http") ? image : `${siteConfig.baseUrl}${image}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: type as "website" | "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
    alternates: {
      canonical: canonical || url,
    },
    ...(publishedDate && {
      publishedTime: publishedDate.toISOString(),
    }),
    ...(modifiedDate && {
      modifiedTime: modifiedDate.toISOString(),
    }),
    ...(author && {
      authors: [{ name: author }],
    }),
    keywords: tags?.join(", "),
  }
}

export function generateStructuredData(type: "Organization" | "BreadcrumbList" | "Article" | "FAQPage", data: any) {
  const baseOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.baseUrl,
    logo: siteConfig.logo,
    description: siteConfig.description,
    sameAs: [
      `https://twitter.com/${siteConfig.social.twitter.replace("@", "")}`,
      `https://linkedin.com/company/${siteConfig.social.linkedin}`,
    ],
  }

  const schemas: Record<string, any> = {
    Organization: baseOrg,
    BreadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: data.breadcrumbs.map((item: any, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    },
    Article: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate,
      author: {
        "@type": "Person",
        name: data.author,
      },
      publisher: baseOrg,
    },
    FAQPage: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((faq: any) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  }

  return schemas[type] || {}
}

export const pageMetadata = {
  home: {
    title: "LBD Startup Bodyshop - Unlock Purpose, Build Legacy",
    description:
      "Empowering entrepreneurs to design businesses and lives of impact. Scale your business, master finances, and join our community of visionary leaders.",
    tags: ["entrepreneurship", "business scaling", "business training", "entrepreneur community"],
  },
  about: {
    title: "About LBD Startup Bodyshop - Our Mission & Impact",
    description:
      "Learn about LBD Startup Bodyshop's mission to empower entrepreneurs across Africa. Discover our core values, services, and the impact we're creating.",
    tags: ["about us", "business consulting", "entrepreneurship training", "impact"],
  },
  blog: {
    title: "Business Insights & Entrepreneurship Blog | LBD Startup Bodyshop",
    description:
      "Discover actionable business strategies, entrepreneurship tips, and success stories from industry experts. Master business design and leadership.",
    tags: ["business blog", "entrepreneurship", "business strategy", "leadership"],
  },
  careers: {
    title: "Join Our Team | Careers at LBD Startup Bodyshop",
    description:
      "Build your career with LBD Startup Bodyshop. Explore open positions and join our team of passionate entrepreneurs and business experts.",
    tags: ["careers", "jobs", "hiring"],
  },
  jobs: {
    title: "Job Openings | LBD Startup Bodyshop Careers",
    description:
      "Check out open positions at LBD Startup Bodyshop. Apply now and be part of a movement empowering entrepreneurs.",
    tags: ["jobs", "careers", "employment"],
  },
  partners: {
    title: "Become a Portfolio Company | LBD Startup Bodyshop",
    description:
      "Join our portfolio company ecosystem and scale your business with expert support, capital, and proven systems.",
    tags: ["partnerships", "investment", "portfolio companies", "business growth"],
  },
  scalingBlueprint: {
    title: "Scaling Blueprint - Business Scaling System | LBD Startup Bodyshop",
    description:
      "Master the proven Scaling Blueprint system to grow your business predictably. Unlock growth through proven frameworks and expert guidance.",
    tags: ["business scaling", "growth strategy", "business systems"],
  },
  kolatBooks: {
    title: "Kolat Books - Business Finance Mastery",
    description:
      "Master your business finances with the Finance Freedom system. Get expert bookkeeping, accounting, and financial planning solutions.",
    tags: ["business finance", "bookkeeping", "accounting", "financial planning", "financial management"],
  },
  workshops: {
    title: "Business Workshops & Training | LBD Startup Bodyshop",
    description:
      "Join our interactive workshops and training sessions. Learn from industry experts and accelerate your business growth.",
    tags: ["workshops", "training", "business education", "scaling sessions"],
  },
  constraintAudit: {
    title: "Free Constraint Audit - Find Your #1 Business Bottleneck",
    description:
      "Take the free AI-powered Constraint Audit to identify the ONE thing holding your business back. Get a personalized report with scores, revenue impact, and a quick-win action plan.",
    tags: ["constraint audit", "business audit", "free business analysis", "growth bottleneck", "AI business tool"],
  },
  newsletter: {
    title: "Newsletter - Business Insights Delivered Weekly",
    description:
      "Subscribe to the LBD Startup Bodyshop newsletter for weekly entrepreneurship insights, growth strategies, and exclusive content.",
    tags: ["newsletter", "business insights", "entrepreneurship tips"],
  },
}
