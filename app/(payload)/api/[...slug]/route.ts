import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'
import config from '@payload-config'

export const GET = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_GET({ config, params, request: req })

export const POST = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_POST({ config, params, request: req })

export const DELETE = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_DELETE({ config, params, request: req })

export const PATCH = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_PATCH({ config, params, request: req })

export const PUT = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_PUT({ config, params, request: req })

export const OPTIONS = (req: Request, { params }: { params: Promise<{ slug: string[] }> }) =>
  REST_OPTIONS({ config, params, request: req })
