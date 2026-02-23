import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { Users } from './payload/collections/Users'
import { Media } from './payload/collections/Media'
import { Posts } from './payload/collections/Posts'
import { Categories } from './payload/collections/Categories'
import { JobPostings } from './payload/collections/JobPostings'
import { AuditSubmissions } from './payload/collections/AuditSubmissions'

import { HomePage } from './payload/globals/HomePage'
import { AboutPage } from './payload/globals/AboutPage'
import { CareersPage } from './payload/globals/CareersPage'
import { ScalingBlueprintPage } from './payload/globals/ScalingBlueprintPage'
import { KolatBooksPage } from './payload/globals/KolatBooksPage'
import { WorkshopsPage } from './payload/globals/WorkshopsPage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '- Startup Bodyshop CMS',
    },
  },
  routes: {
    admin: '/cms',
  },
  collections: [Users, Media, Posts, Categories, JobPostings, AuditSubmissions],
  globals: [HomePage, AboutPage, CareersPage, ScalingBlueprintPage, KolatBooksPage, WorkshopsPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
})
