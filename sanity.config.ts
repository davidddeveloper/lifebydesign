'use client'
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import CustomNavbar from './components/custom-navbar'

const SINGLETON_TYPES = [
  'homePage', 'productPage', 'aboutPage', 'careersPage',
  'scalingBlueprintPage', 'kolatBooksPage', 'workshopsPage',
]

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('Website')
          .title('Website')
          .items([
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem()
              .title('Product Page')
              .id('productPage')
              .child(S.document().schemaType('productPage').documentId('productPage')),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
            S.listItem()
              .title('Careers Page')
              .id('careersPage')
              .child(S.document().schemaType('careersPage').documentId('careersPage')),
            S.listItem()
              .title('Scaling Blueprint Page')
              .id('scalingBlueprintPage')
              .child(S.document().schemaType('scalingBlueprintPage').documentId('scalingBlueprintPage')),
            S.listItem()
              .title('Kolat Books Page')
              .id('kolatBooksPage')
              .child(S.document().schemaType('kolatBooksPage').documentId('kolatBooksPage')),
            S.listItem()
              .title('Workshops Page')
              .id('workshopsPage')
              .child(S.document().schemaType('workshopsPage').documentId('workshopsPage')),
            S.divider(),
            S.documentTypeListItem('post').title('Blog Posts'),
            ...S.documentTypeListItems().filter(
              (item) =>
                ![
                  'homePage', 'productPage', 'aboutPage', 'careersPage',
                  'scalingBlueprintPage', 'kolatBooksPage', 'workshopsPage', 'post',
                ].includes(item.getId() || '')
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        previewMode: {
          enable: '/api/draft',
        },
      },
      allowOrigins: [
        'https://startupbodyshop.com',
        'https://www.startupbodyshop.com',
        'http://localhost:3000',
      ],
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  title: 'Startup Bodyshop Studio',
  document: {
    actions: (prev, context) => {
      if (SINGLETON_TYPES.includes(context.schemaType)) {
        return prev.filter(
          ({ action }: any) => !['unpublish', 'delete', 'duplicate'].includes(action)
        )
      }
      return prev
    },
  },
  studio: {
    components: {
      navbar: CustomNavbar,
    },
  },
})
