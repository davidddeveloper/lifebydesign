import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

const studioUrl =
  process.env.NEXT_PUBLIC_BASE_URL
    ? `${process.env.NEXT_PUBLIC_BASE_URL}/studio`
    : 'http://localhost:3000/studio'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  stega: {
    enabled: true,
    studioUrl,
  },
})
