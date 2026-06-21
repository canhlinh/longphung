import 'dotenv/config'

import fs from 'fs'
import path from 'path'

import config from '@payload-config'
import { getPayload } from 'payload'

import { slugify } from '@/lib/slugify'

const SOURCE_BASE = 'https://nv.haisankyha.vn'
const DEFAULT_CODE = 'tran-long-7bc3ps'
const code = process.argv[2] || DEFAULT_CODE

type SourceVariant = {
  kv_id: number
  unit?: string
  price?: number
  pco?: number
  on_hand?: number
  prices?: Array<{ name: string; price: number; pco: number }>
}

type SourceCard = {
  key: string
  group_id: number
  name: string
  image?: string
  isNew?: boolean
  dir?: 'down' | 'up'
  variants: SourceVariant[]
}

type SourceGroup = {
  id: number
  name: string
  icon?: string
  color?: string
  count?: number
}

type SourcePayload = {
  ok: boolean
  meta: Record<string, unknown>
  groups: SourceGroup[]
  cards: SourceCard[]
}

function mapUnit(raw?: string): 'con' | 'hop' | 'kg' | 'set' | 'thung' {
  const value = (raw || '').toLowerCase()
  if (value.includes('con')) return 'con'
  if (value.includes('thùng') || value.includes('thung')) return 'thung'
  if (value.includes('hộp') || value.includes('hop') || value.includes('gói') || value.includes('goi')) {
    return 'hop'
  }
  if (value.includes('khay') || value.includes('vĩ') || value.includes('vi') || value.includes('set')) {
    return 'set'
  }
  return 'kg'
}

function absoluteImageUrl(image?: string): string | undefined {
  if (!image) return undefined
  if (image.startsWith('http')) return image
  return `${SOURCE_BASE}${image.startsWith('/') ? '' : '/'}${image}`
}

function productSlug(name: string, kvId: number): string {
  const base = slugify(name) || 'san-pham'
  const suffix = String(kvId)
  const maxBase = Math.max(10, 80 - suffix.length - 1)
  return `${base.slice(0, maxBase)}-${suffix}`
}

async function upsertBySlug(payload: any, collection: string, slug: string, data: Record<string, any>) {
  const existing = await payload.find({
    collection,
    limit: 1,
    where: { slug: { equals: slug } },
  })

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection,
      data,
    })
  }

  return payload.create({ collection, data: { ...data, slug } })
}

async function upsertDailyPrice(payload: any, externalKey: string, data: Record<string, any>) {
  const existing = await payload.find({
    collection: 'daily-prices',
    limit: 1,
    where: { externalKey: { equals: externalKey } },
  })

  if (existing.docs[0]) {
    return payload.update({
      id: existing.docs[0].id,
      collection: 'daily-prices',
      data,
    })
  }

  return payload.create({
    collection: 'daily-prices',
    data: { ...data, externalKey },
  })
}

async function importData() {
  const apiUrl = `${SOURCE_BASE}/api/pl/public?code=${encodeURIComponent(code)}`
  const response = await fetch(apiUrl, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Không tải được API (${response.status})`)
  }

  const source = (await response.json()) as SourcePayload
  if (!source.ok) {
    throw new Error('API trả về dữ liệu không hợp lệ')
  }

  const snapshotDir = path.resolve('data/imports')
  fs.mkdirSync(snapshotDir, { recursive: true })
  const snapshotPath = path.join(snapshotDir, `haisankyha-${code}.json`)
  fs.writeFileSync(snapshotPath, JSON.stringify(source, null, 2))

  const payload = await getPayload({ config })

  const stalePrices = await payload.find({
    collection: 'daily-prices',
    limit: 500,
    where: {
      externalKey: {
        exists: false,
      },
    },
  })

  for (const doc of stalePrices.docs) {
    await payload.update({
      collection: 'daily-prices',
      id: doc.id,
      data: { isActive: false },
    })
  }

  const categoryBySourceId = new Map<number, any>()

  const extraGroups: SourceGroup[] = []
  if (source.cards.some((card) => card.group_id === 0)) {
    extraGroups.push({ id: 0, name: 'Khác', icon: '📦', color: '#90a4ae' })
  }

  for (const group of [...extraGroups, ...source.groups]) {
    const slug = group.id === 0 ? 'khac' : slugify(group.name)
    const doc = await upsertBySlug(payload, 'categories', slug, {
      name: group.name,
      description: `${group.count || 0} sản phẩm`,
      featured: true,
      sortOrder: group.id,
      icon: group.icon || '📦',
      color: group.color || '#0ea5b8',
      sourceGroupId: group.id,
    })
    categoryBySourceId.set(group.id, doc)
  }

  let importedProducts = 0
  let importedPrices = 0

  for (const [index, card] of source.cards.entries()) {
    const variant = card.variants[0]
    if (!variant) continue

    const category = categoryBySourceId.get(card.group_id) || categoryBySourceId.get(0)
    if (!category) continue

    const slug = productSlug(card.name, variant.kv_id)
    const retail = variant.price || 0
    const wholesale = variant.pco || variant.price || 0
    const stockStatus = (variant.on_hand || 0) > 0 ? 'in_stock' : 'preorder'
    const imageUrl = absoluteImageUrl(card.image)

    const existingProductQuery = await payload.find({
      collection: 'products',
      limit: 1,
      where: { slug: { equals: slug } },
    })
    const existingProduct = existingProductQuery.docs[0]

    let images = existingProduct?.images || []
    if (images.length === 0 && imageUrl) {
      try {
        const res = await fetch(imageUrl)
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const mimeType = res.headers.get('content-type') || 'image/jpeg'
          const extension = mimeType.split('/')[1] || 'jpg'
          const fileName = `${slug}-${Date.now()}.${extension}`

          const media = await payload.create({
            collection: 'media',
            data: { alt: card.name },
            file: {
              data: buffer,
              mimetype: mimeType,
              name: fileName,
              size: buffer.length,
            },
          })
          images = [{ image: media.id }]
        }
      } catch (err) {
        console.error(`Failed to download/upload image for ${slug}:`, err)
      }
    }

    const product = await upsertBySlug(payload, 'products', slug, {
      _status: 'published',
      name: card.name,
      category: category.id,
      unit: mapUnit(variant.unit),
      retailPrice: retail,
      wholesalePrice: wholesale,
      stockStatus,
      featured: index < 12,
      bestSeller: false,
      shortDescription: card.name,
      sourceImageUrl: imageUrl,
      images,
      externalKey: card.key,
      isNewListing: Boolean(card.isNew),
      priceDirection: card.dir || 'none',
    })
    importedProducts += 1

    await upsertDailyPrice(payload, String(variant.kv_id), {
      date: new Date().toISOString(),
      product: product.id,
      displayName: card.name,
      unit: mapUnit(variant.unit),
      displayUnit: variant.unit || 'kg',
      price: retail,
      wholesalePrice: wholesale,
      note: variant.prices?.length ? `${variant.prices.length} bậc giá` : undefined,
      priceTiers: variant.prices || [],
      isActive: true,
      sortOrder: index,
    })
    importedPrices += 1
  }

  console.log('Import complete (categories + products only, Long Phụng branding unchanged)')
  console.log(`Snapshot: ${snapshotPath}`)
  console.log(`Categories: ${categoryBySourceId.size}`)
  console.log(`Products: ${importedProducts}`)
  console.log(`Daily prices: ${importedPrices}`)
  process.exit(0)
}

importData().catch((error) => {
  console.error(error)
  process.exit(1)
})