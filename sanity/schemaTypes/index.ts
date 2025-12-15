import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'

import { jobPosting } from "./job-posting"
import { partner } from "./partner"
import { product } from "./product"

import { homePage } from "./homePageType"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType, categoryType, postType, authorType,
    homePage as any,
  ],
}
