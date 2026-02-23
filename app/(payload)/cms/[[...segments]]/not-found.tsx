import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export default async function NotFound() {
  return NotFoundPage({ config, importMap })
}
