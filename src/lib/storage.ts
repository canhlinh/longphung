import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import type { Plugin } from 'payload'

function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT,
  )
}

function isVercelBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

export function isExternalStorageConfigured(): boolean {
  return isVercelBlobConfigured() || isS3Configured()
}

export function createStoragePlugins(): Plugin[] {
  if (isVercelBlobConfigured()) {
    return [
      vercelBlobStorage({
        enabled: true,
        alwaysInsertFields: true,
        clientUploads: true,
        collections: {
          media: true,
        },
        token: process.env.BLOB_READ_WRITE_TOKEN,
      }),
    ]
  }

  const configured = isS3Configured()
  const sdkEndpoint = process.env.S3_ENDPOINT || 'http://127.0.0.1:9000'
  const publicUrl = process.env.S3_PUBLIC_URL
  const useDirectUrls = configured && Boolean(publicUrl)

  // Always register the plugin so admin importMap stays consistent between
  // CI/Docker build (no S3 env) and production runtime (S3 configured).
  return [
    s3Storage({
      enabled: configured,
      alwaysInsertFields: true,
      acl: 'public-read',
      bucket: process.env.S3_BUCKET || 'placeholder',
      collections: {
        media: useDirectUrls ? { disablePayloadAccessControl: true } : true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || 'placeholder',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || 'placeholder',
        },
        endpoint: useDirectUrls && publicUrl ? publicUrl : sdkEndpoint,
        forcePathStyle: true,
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ]
}

type ImageRemotePattern = { protocol: 'http' | 'https'; hostname: string; port?: string }

export function getStorageImageRemotePatterns(): ImageRemotePattern[] {
  const patterns: ImageRemotePattern[] = [
    {
      protocol: 'https',
      hostname: '**.public.blob.vercel-storage.com',
    },
  ]

  const url = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT
  if (!url) return patterns

  try {
    const parsed = new URL(url)
    patterns.push({
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
    })
  } catch {
    return patterns
  }

  return patterns
}
