import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY_ID &&
      process.env.S3_SECRET_ACCESS_KEY &&
      process.env.S3_ENDPOINT,
  )
}

export function createStoragePlugins(): Plugin[] {
  if (!isS3Configured()) {
    return []
  }

  const sdkEndpoint = process.env.S3_ENDPOINT!
  const publicUrl = process.env.S3_PUBLIC_URL
  const useDirectUrls = Boolean(publicUrl)

  return [
    s3Storage({
      acl: 'public-read',
      bucket: process.env.S3_BUCKET!,
      collections: {
        media: useDirectUrls
          ? { disablePayloadAccessControl: true }
          : true,
      },
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        endpoint: useDirectUrls ? publicUrl! : sdkEndpoint,
        forcePathStyle: true,
        region: process.env.S3_REGION || 'us-east-1',
      },
    }),
  ]
}

export function getS3ImageRemotePattern(): { protocol: 'http' | 'https'; hostname: string; port?: string } | null {
  const url = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT
  if (!url) return null

  try {
    const parsed = new URL(url)
    return {
      hostname: parsed.hostname,
      port: parsed.port || undefined,
      protocol: parsed.protocol.replace(':', '') as 'http' | 'https',
    }
  } catch {
    return null
  }
}