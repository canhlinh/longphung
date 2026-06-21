import { slugify } from '@/lib/slugify'

const TOKEN_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

export function generateWholesaleToken(length = 6): string {
  let token = ''
  for (let i = 0; i < length; i += 1) {
    token += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)]
  }
  return token
}

export function createWholesaleSlug(name: string, token = generateWholesaleToken()): string {
  const base = slugify(name)
  return base ? `${base}-${token}` : token
}

export function getWholesaleLink(slug: string, siteUrl?: string): string {
  const base = (siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  return `${base}/bg/${slug}`
}