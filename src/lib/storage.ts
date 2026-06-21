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