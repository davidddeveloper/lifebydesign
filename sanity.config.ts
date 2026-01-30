'use client'
/**
 * This configuration is used to for the Sanity Studio that's mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from "sanity/presentation";
//import { previewDocumentNode } from "@/sanity/preview/previewDocumentNode";
// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import ViewLiveAction from "./sanity/actions/view-live-action"
import PreviewDraftAction from "./sanity/actions/preview-draft-action"
import CustomNavbar from "./components/custom-navbar"

// Define your singleton document types here
const SINGLETON_TYPES = ['homePage', 'productPage', 'aboutPage', 'careersPage', 'scalingBlueprintPage', 'kolatBooksPage', 'workshopsPage'] // Add your singleton types

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('Website')
          .title('Website')
          .items([
            // Singleton documents (only one allowed)
            S.listItem()
              .title('Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage')
              ),
            S.listItem()
              .title('Product Page')
              .id('productPage')
              .child(
                S.document()
                  .schemaType('productPage')
                  .documentId('productPage')
              ),
            S.listItem()
              .title('About Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
            S.listItem()
              .title('Careers Page')
              .id('careersPage')
              .child(
                S.document()
                  .schemaType('careersPage')
                  .documentId('careersPage')
              ),
            S.listItem()
              .title('Scaling Blueprint Page')
              .id('scalingBlueprintPage')
              .child(
                S.document()
                  .schemaType('scalingBlueprintPage')
                  .documentId('scalingBlueprintPage')
              ),
            S.listItem()
              .title('Kolat Books Page')
              .id('kolatBooksPage')
              .child(
                S.document()
                  .schemaType('kolatBooksPage')
                  .documentId('kolatBooksPage')
              ),
            S.listItem()
              .title('Workshops Page')
              .id('workshopsPage')
              .child(
                S.document()
                  .schemaType('workshopsPage')
                  .documentId('workshopsPage')
              ),

            S.divider(),

            // Regular list documents (multiple allowed)
            S.documentTypeListItem('post').title('Blog Posts'),

            // Any other document types not listed above
            ...S.documentTypeListItems().filter(
              (item) => !['homePage', 'productPage', 'aboutPage', 'careersPage', 'scalingBlueprintPage', 'kolatBooksPage', 'workshopsPage', 'post'].includes(item.getId() || '')
            ),
          ]),
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
        previewMode: {
          enable: `/api/draft?secret=${process.env.NEXT_PUBLIC_SANITY_PREVIEW_SECRET}`,
        },
      },
    }),
  ],
  title: 'Startup Bodyshop Studio',
  subtitle: 'Powered by 10na.city',
  document: {
    actions: (prev, context) => {
      const { schemaType } = context

      // Filter out create/delete/duplicate actions for singletons
      let filteredActions = prev
      if (SINGLETON_TYPES.includes(schemaType)) {
        filteredActions = prev.filter(
          ({ action }: any) => !['unpublish', 'delete', 'duplicate'].includes(action)
        )
      }

      // Then apply custom actions
      return filteredActions.map((action) => {
        if ((action.action as string) === "view-live") {
          return ViewLiveAction as any
        }
        if ((action.action as string) === "preview-draft") {
          return PreviewDraftAction as any
        }
        return action
      })
    },
  },
  studio: {
    components: {
      navbar: CustomNavbar,
    }
  },
})