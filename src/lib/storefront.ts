import config from '@payload-config'
import { getPayload } from 'payload'

import { STOCK_LABELS, STOCK_STATUS } from '@/lib/labels'
// Stronger types from '@/payload-types' can be adopted for findDocs/get* when desired.

type AnyDoc = Record<string, unknown>

export const fallbackSettings: Record<string, unknown> = {
  brandName: 'Hải Sản Minh Kiên',
  tagline: 'Hải sản tươi mỗi ngày cho gia đình và nhà hàng',
  hotline: '0900 000 000',
  zaloUrl: 'https://zalo.me/0900000000',
  address: 'Cập nhật địa chỉ của Minh Kiên',
  businessHours: '06:00 - 20:00 hằng ngày',
  seo: {
    title: 'Minh Kiên Seafood',
    description: 'Hải sản tươi sống, sashimi, combo gia đình và bảng giá mỗi ngày.',
  },
}

export const fallbackImages = [
  'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?auto=format&fit=crop&w=1200&q=80',
]

export const fallbackCategories = [
  {
    id: 'hai-san-tuoi',
    name: 'Hải sản tươi',
    slug: 'hai-san-tuoi',
    description: 'Tôm, cua, ghẹ, mực và cá được cập nhật mỗi ngày.',
    featured: true,
  },
  {
    id: 'sashimi',
    name: 'Sashimi',
    slug: 'sashimi',
    description: 'Cá hồi, cá trích ép trứng, bạch tuộc và set ăn liền.',
    featured: true,
  },
  {
    id: 'combo-gia-dinh',
    name: 'Combo gia đình',
    slug: 'combo-gia-dinh',
    description: 'Combo nấu lẩu, tiệc nhỏ và bữa ăn nhanh trong ngày.',
    featured: true,
  },
]

export const fallbackProducts: any[] = [
  {
    id: 'tom-su-song',
    name: 'Tôm sú sống',
    slug: 'tom-su-song',
    unit: 'kg',
    retailPrice: 360000,
    wholesalePrice: 330000,
    stockStatus: 'in_stock',
    origin: 'Vùng nuôi miền Tây',
    size: '20-25 con/kg',
    featured: true,
    bestSeller: true,
    shortDescription: 'Tôm sú còn khỏe, thịt chắc, hợp hấp bia, nướng muối ớt hoặc nấu lẩu.',
    category: fallbackCategories[0],
  },
  {
    id: 'ca-hoi-sashimi',
    name: 'Cá hồi sashimi',
    slug: 'ca-hoi-sashimi',
    unit: 'kg',
    retailPrice: 620000,
    wholesalePrice: 590000,
    stockStatus: 'in_stock',
    origin: 'Na Uy',
    size: 'Cắt phần theo yêu cầu',
    featured: true,
    bestSeller: true,
    shortDescription: 'Thịt cá béo, màu đẹp, giao lạnh trong ngày cho gia đình và nhà hàng.',
    category: fallbackCategories[1],
  },
  {
    id: 'combo-lau-hai-san',
    name: 'Combo lẩu hải sản',
    slug: 'combo-lau-hai-san',
    unit: 'set',
    retailPrice: 499000,
    stockStatus: 'in_stock',
    origin: 'Minh Kiên',
    size: '3-4 người',
    featured: true,
    bestSeller: false,
    shortDescription: 'Set tiện lợi gồm tôm, mực, cá viên và rau gia vị cơ bản cho bữa lẩu nhanh.',
    category: fallbackCategories[2],
  },
]

export const fallbackPosts: any[] = [
  {
    id: 'cach-chon-hai-san-tuoi',
    title: 'Cách chọn hải sản tươi cho bữa ăn gia đình',
    slug: 'cach-chon-hai-san-tuoi',
    excerpt: 'Những dấu hiệu đơn giản để nhận biết tôm, cua, mực và cá còn tươi khi đặt hàng.',
    featured: true,
  },
  {
    id: 'bao-quan-sashimi',
    title: 'Bảo quản sashimi tại nhà như thế nào',
    slug: 'bao-quan-sashimi',
    excerpt: 'Cách giữ lạnh, thời gian dùng ngon và những lưu ý khi nhận hàng sashimi.',
    featured: true,
  },
]

export const fallbackPrices: any[] = fallbackProducts.map((product, index) => ({
  id: product.id,
  date: new Date().toISOString(),
  displayName: product.name,
  unit: product.unit,
  price: product.retailPrice,
  wholesalePrice: product.wholesalePrice,
  note: index === 0 ? 'Giá tốt cho đơn đặt trước 10h' : 'Cập nhật mỗi ngày',
  isActive: true,
  product,
}))

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function findDocs<T extends AnyDoc>(
  collection: string,
  options: Record<string, any> = {},
  fallback: T[] = [],
): Promise<T[]> {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: collection as any,
      depth: 2,
      limit: 20,
      overrideAccess: false,
      ...options,
    })

    return result.docs as T[]
  } catch (err) {
    // Log instead of silent failure so operators see real issues (DB down, misconfig etc.)
    console.error(`[storefront] findDocs failed for ${collection}:`, err)
    return fallback
  }
}

export async function findAllDocs<T extends AnyDoc>(
  collection: string,
  options: Record<string, any> = {},
  fallback: T[] = [],
  pageSize = 200,
): Promise<T[]> {
  try {
    const payload = await getPayloadClient()
    const docs: T[] = []
    let page = 1
    let hasNextPage = true

    while (hasNextPage) {
      const result = await payload.find({
        collection: collection as any,
        depth: 2,
        limit: pageSize,
        overrideAccess: false,
        page,
        ...options,
      })

      docs.push(...(result.docs as T[]))
      hasNextPage = result.hasNextPage
      page += 1
    }

    return docs
  } catch (err) {
    console.error(`[storefront] findAllDocs failed for ${collection}:`, err)
    return fallback
  }
}

export async function findOne<T extends AnyDoc>(
  collection: string,
  slug: string,
  fallback?: T,
): Promise<T | null> {
  const docs = await findDocs<T>(
    collection,
    {
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    },
    fallback ? [fallback] : [],
  )

  return docs[0] || null
}

export async function getSettings() {
  try {
    const payload = await getPayloadClient()
    return (await payload.findGlobal({
      slug: 'site-settings' as any,
      overrideAccess: false,
    })) as typeof fallbackSettings
  } catch (err) {
    console.error('[storefront] getSettings failed:', err)
    return fallbackSettings
  }
}

export function getMediaUrl(media: unknown, fallbackIndex = 0): string {
  const m = media as { url?: string } | null | undefined
  if (m && typeof m === 'object' && m.url) {
    return m.url
  }

  return fallbackImages[fallbackIndex % fallbackImages.length]
}

export function getProductImage(product: unknown, fallbackIndex = 0): string {
  const p = product as { images?: Array<{ image?: unknown }>; sourceImageUrl?: string } | null | undefined
  if (p?.sourceImageUrl) {
    return p.sourceImageUrl
  }
  const image = p?.images?.[0]?.image
  return getMediaUrl(image, fallbackIndex)
}

export { createZaloUrl, formatPrice } from '@/lib/client-pricing'

export function stockLabel(status?: string): string {
  if (status === STOCK_STATUS.PREORDER) return STOCK_LABELS[STOCK_STATUS.PREORDER]
  if (status === STOCK_STATUS.OUT_OF_STOCK) return STOCK_LABELS[STOCK_STATUS.OUT_OF_STOCK]
  return STOCK_LABELS[STOCK_STATUS.IN_STOCK]
}

export const fallbackWholesaleCustomer = {
  id: 'tran-long-demo',
  name: 'Trần Long',
  slug: 'tran-long-7bc3ps',
  contactPerson: 'Anh Long',
  greeting: 'Chào anh Long, đây là bảng giá sỉ dành riêng cho quán của anh.',
  isActive: true,
}

export async function findWholesaleCustomer(slug: string) {
  const fallback =
    slug === fallbackWholesaleCustomer.slug ? fallbackWholesaleCustomer : undefined

  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'wholesale-customers' as any,
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return (result.docs[0] as AnyDoc | undefined) || fallback || null
  } catch (err) {
    console.error(`[storefront] findWholesaleCustomer failed for ${slug}:`, err)
    return fallback || null
  }
}

export function plainTextFromRichText(value: unknown): string {
  const root = (value as { root?: { children?: unknown[] } })?.root
  const children = root?.children
  if (!Array.isArray(children)) {
    return ''
  }

  return children
    .map((child) => {
      const c = child as { children?: unknown[] }
      return c?.children?.map((item: unknown) => (item as { text?: string })?.text || '').join(' ')
    })
    .filter(Boolean)
    .join(' ')
}
