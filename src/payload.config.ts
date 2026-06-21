import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { createStoragePlugins, isExternalStorageConfigured } from './lib/storage'
import { migrations } from './migrations'
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
import { WholesaleCustomers } from './collections/WholesaleCustomers'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isNextProductionBuild = process.env.NEXT_PHASE === 'phase-production-build'

if (process.env.NODE_ENV === 'production' && !isNextProductionBuild) {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error('PAYLOAD_SECRET is required in production')
  }
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    throw new Error('DATABASE_URL or POSTGRES_URL is required in production')
  }
}

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    theme: 'light',
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Minh Kiên',
    },
  },
  i18n: {
    supportedLanguages: { vi },
    fallbackLanguage: 'vi',
  },
  collections: [Users, Media, Categories, Products, DailyPrices, Banners, Posts, WholesaleCustomers],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
      idleTimeoutMillis: process.env.CI || process.env.VERCEL ? 500 : 10000, 
    },
    prodMigrations: migrations,
  }),
  // Basic startup validation to catch missing required envs early (Issue 21)
  onInit: async (payload) => {
    if (!process.env.PAYLOAD_SECRET) {
      payload.logger.warn('PAYLOAD_SECRET is not set - using empty secret (insecure for production)')
    }
    if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
      payload.logger.warn('DATABASE_URL/POSTGRES_URL is not set - database connection will fail')
    }
    if (process.env.NODE_ENV === 'production' && !isExternalStorageConfigured()) {
      payload.logger.warn(
        'External upload storage is not configured — uploads will use ephemeral local disk (not suitable for Vercel/Docker/K8s)',
      )
    }
  },
  sharp,
  plugins: createStoragePlugins(),
})
