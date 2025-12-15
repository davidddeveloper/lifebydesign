'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

import { presentationTool } from "sanity/presentation";
//import { previewDocumentNode } from "@/sanity/preview/previewDocumentNode";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

import ViewLiveAction from "./sanity/actions/view-live-action"
import PreviewDraftAction from "./sanity/actions/preview-draft-action"
import CustomNavbar from "./components/custom-navbar"

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
          .items([...S.documentTypeListItems()]),
    }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
    presentationTool({
      previewUrl: {
        origin: "http://localhost:3000/",
      },
    }),
  ],
  title: 'Startup Bodyshop Studio',
  subtitle: 'Powered by 10na.city',
  document: {
    actions: (prev) => [
      ...prev.map((action) => {
        if ((action.action as string) === "view-live") {
          return ViewLiveAction as any
        }
        if ((action.action as string) === "preview-draft") {
          return PreviewDraftAction as any
        }
        return action
      }),
      ViewLiveAction as any,
      PreviewDraftAction as any,
    ],
  },
  studio: {
    components: {
      navbar: CustomNavbar,
    }
  },
})

