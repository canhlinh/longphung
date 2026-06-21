import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'pino',
    'pino-pretty',
    'pino-abstract-transport',
    'thread-stream',
  ],
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
  },
  webpack: (webpackConfig, { isServer }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    if (!isServer) {
      // Vercel forces webpack for Payload; avoid pulling server-only utilities into client bundles.
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@payloadcms/plugin-cloud-storage/utilities$': path.resolve(
          dirname,
          'node_modules/@payloadcms/plugin-cloud-storage/dist/utilities/getFileKey.js',
        ),
      }

      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        worker_threads: false,
      }
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
