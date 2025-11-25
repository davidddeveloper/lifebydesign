# SEO Implementation Guide

## Overview
This document outlines the comprehensive SEO implementation across Life By Design's website.

## Features Implemented

### 1. Metadata & OG Tags
- Full Open Graph (OG) tags on all pages for social media sharing
- Twitter Cards for enhanced tweet previews
- Dynamic metadata generation based on page content
- Canonical URLs to prevent duplicate content issues

### 2. Structured Data (Schema.org)
- Organization schema with company info
- Article schema for blog posts
- BreadcrumbList schema for navigation
- FAQ schema support for FAQ sections

### 3. SEO Optimization
- Meta descriptions (160 characters) for all pages
- Keyword tagging system for content categorization
- Robots meta tags with indexing directives
- Image alt text and optimization
- Mobile viewport configuration

### 4. Pages Covered

#### Static Pages
- **Home** (`/`) - Main landing page
- **About** (`/about`) - Company information
- **Careers** (`/careers`) - Job listings and culture
- **Jobs** (`/careers/jobs`) - Job opportunities
- **Partners** (`/partner`) - Portfolio company program
- **Workshops** (`/workshops`) - Training and events
- **Scaling Blueprint** (`/products/scaling-blueprint`) - Product page
- **Finance Freedom** (`/products/finance-freedom`) - Product page

#### Dynamic Pages
- **Blog Listing** (`/blog`) - All blog posts with search
- **Blog Post** (`/blog/[slug]`) - Individual articles with author, publish date, and tags

### 5. Implementation Details

#### SEO Utility (`lib/seo.ts`)
- `generateMetadata()` - Creates comprehensive metadata for any page
- `generateStructuredData()` - Generates JSON-LD structured data
- `pageMetadata` - Centralized metadata definitions
- `siteConfig` - Global site configuration

#### Image URL Helper (`lib/sanity-url-helper.ts`)
- `urlFor()` - Properly formats Sanity image URLs for OG tags

#### Page Structure
- All pages that use client components are split into:
  - `page.tsx` (server component) - Handles metadata
  - `page.client.tsx` (client component) - Renders UI

### 6. Social Media Cards
Every page includes:
- **OpenGraph Tags**: Title, description, URL, image (1200x630px)
- **Twitter Card**: Summary large image format
- **LinkedIn**: Inherits OG tags

### 7. Blog SEO
- Dynamic metadata for each blog post
- Author information in schema
- Publication and modification dates
- Category-based tagging
- Featured images in OG tags

## Usage Example

\`\`\`typescript
import { generateMetadata, pageMetadata } from "@/lib/seo"

export const metadata = generateMetadata({
  title: "Your Page Title",
  description: "Your meta description",
  path: "/your-path",
  tags: ["tag1", "tag2"],
  image: "/optional-image-path"
})
\`\`\`

## Best Practices Applied

1. **Mobile First**: Viewport configuration optimized for mobile
2. **Accessibility**: Semantic HTML and proper ARIA labels
3. **Performance**: Optimized image sizes and formats
4. **Crawlability**: Proper robot directives and canonical URLs
5. **Structured Data**: Rich snippets for search engines

## Next Steps

1. Add an OG image (1200x630px) at `/public/images/og-image.jpg`
2. Update Sanity image URL in `lib/sanity-url-helper.ts` with your project ID
3. Monitor search performance in Google Search Console
4. Add internal linking strategy between related content
5. Consider adding breadcrumb navigation components

## Tools for Monitoring

- Google Search Console - Monitor indexing and search performance
- Open Graph Debugger (Facebook) - Preview social media cards
- Twitter Card Validator - Test Twitter card rendering
- Lighthouse - Run performance and SEO audits
