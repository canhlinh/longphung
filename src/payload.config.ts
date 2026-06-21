import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { vi } from '@payloadcms/translations/languages/vi'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Banners } from './collections/Banners'
import { Categories } from './collections/Categories'
import { DailyPrices } from './collections/DailyPrices'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Long Phụng',
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  collections: [Users, Media, Categories, Products, DailyPrices, Banners, Posts],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
    },
  }),
  // Basic startup validation to catch missing required envs early (Issue 21)
  onInit: async (payload) => {
    if (!process.env.PAYLOAD_SECRET) {
      payload.logger.warn('PAYLOAD_SECRET is not set - using empty secret (insecure for production)')
    }
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      payload.logger.warn('DATABASE_URL/POSTGRES_URL is not set - database connection will fail')
    }
  },
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
