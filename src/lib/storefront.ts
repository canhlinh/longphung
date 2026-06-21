import config from '@payload-config'
import { getPayload } from 'payload'

type AnyDoc = Record<string, any>

export const fallbackSettings: any = {
  brandName: 'Long Phung Seafood',
  tagline: 'Hai san tuoi moi ngay cho gia dinh va nha hang',
  hotline: '0900 000 000',
  zaloUrl: 'https://zalo.me/0900000000',
  address: 'Cap nhat dia chi cua Long Phung',
  businessHours: '06:00 - 20:00 hang ngay',
  seo: {
    title: 'Long Phung Seafood',
    description: 'Hai san tuoi song, sashimi, combo gia dinh va bang gia moi ngay.',
  },
}

export const fallbackImages = [
  'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1606851091851-e8c8c0fca5ba?auto=format&fit=crop&w=1200&q=80',
]

export const fallbackCategories: any[] = [
  {
    id: 'hai-san-tuoi',
    name: 'Hai san tuoi',
    slug: 'hai-san-tuoi',
    description: 'Tom, cua, ghe, muc va ca duoc cap nhat moi ngay.',
    featured: true,
  },
  {
    id: 'sashimi',
    name: 'Sashimi',
    slug: 'sashimi',
    description: 'Ca hoi, ca trich ep trung, bach tuoc va set an lien.',
    featured: true,
  },
  {
    id: 'combo',
    name: 'Combo gia dinh',
    slug: 'combo',
    description: 'Combo nau lau, tiec nho va bua an nhanh trong ngay.',
    featured: true,
  },
]

export const fallbackProducts: any[] = [
  {
    id: 'tom-su-song',
    name: 'Tom su song',
    slug: 'tom-su-song',
    unit: 'kg',
    retailPrice: 360000,
    wholesalePrice: 330000,
    stockStatus: 'in_stock',
    origin: 'Vung nuoi mien Tay',
    size: '20-25 con/kg',
    featured: true,
    bestSeller: true,
    shortDescription: 'Tom su con khoe, thit chac, hop hap bia, nuong muoi ot hoac nau lau.',
    category: fallbackCategories[0],
  },
  {
    id: 'ca-hoi-sashimi',
    name: 'Ca hoi sashimi',
    slug: 'ca-hoi-sashimi',
    unit: 'kg',
    retailPrice: 620000,
    wholesalePrice: 590000,
    stockStatus: 'in_stock',
    origin: 'Na Uy',
    size: 'Cat phan theo yeu cau',
    featured: true,
    bestSeller: true,
    shortDescription: 'Thit ca beo, mau dep, giao lanh trong ngay cho gia dinh va nha hang.',
    category: fallbackCategories[1],
  },
  {
    id: 'combo-lau-hai-san',
    name: 'Combo lau hai san',
    slug: 'combo-lau-hai-san',
    unit: 'set',
    retailPrice: 499000,
    stockStatus: 'in_stock',
    origin: 'Long Phung',
    size: '3-4 nguoi',
    featured: true,
    bestSeller: false,
    shortDescription: 'Set tien loi gom tom, muc, ca vien va rau gia vi co ban cho bua lau nhanh.',
    category: fallbackCategories[2],
  },
]

export const fallbackPosts: any[] = [
  {
    id: 'cach-chon-hai-san-tuoi',
    title: 'Cach chon hai san tuoi cho bua an gia dinh',
    slug: 'cach-chon-hai-san-tuoi',
    excerpt: 'Nhung dau hieu don gian de nhan biet tom, cua, muc va ca con tuoi khi dat hang.',
    featured: true,
  },
  {
    id: 'bao-quan-sashimi',
    title: 'Bao quan sashimi tai nha nhu the nao',
    slug: 'bao-quan-sashimi',
    excerpt: 'Cach giu lanh, thoi gian dung ngon va nhung luu y khi nhan hang sashimi.',
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
  note: index === 0 ? 'Gia tot cho don dat truoc 10h' : 'Cap nhat moi ngay',
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
      ...options,
    })

    return result.docs as T[]
  } catch {
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
    return (await payload.findGlobal({ slug: 'site-settings' as any })) as typeof fallbackSettings
  } catch {
    return fallbackSettings
  }
}

export function getMediaUrl(media: any, fallbackIndex = 0): string {
  if (media && typeof media === 'object' && media.url) {
    return media.url
  }

  return fallbackImages[fallbackIndex % fallbackImages.length]
}

export function getProductImage(product: any, fallbackIndex = 0): string {
  const image = product?.images?.[0]?.image
  return getMediaUrl(image, fallbackIndex)
}

export function formatPrice(value?: number | null, label?: string | null): string {
  if (label) {
    return label
  }

  if (!value) {
    return 'Lien he'
  }

  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

export function stockLabel(status?: string): string {
  if (status === 'preorder') return 'Sap ve'
  if (status === 'out_of_stock') return 'Het hang'
  return 'Con hang'
}

export function createZaloUrl(zaloUrl: string, message: string): string {
  const separator = zaloUrl.includes('?') ? '&' : '?'
  return `${zaloUrl}${separator}text=${encodeURIComponent(message)}`
}

export function plainTextFromRichText(value: any): string {
  const children = value?.root?.children
  if (!Array.isArray(children)) {
    return ''
  }

  return children
    .map((child) => child?.children?.map((item: any) => item.text).join(' '))
    .filter(Boolean)
    .join(' ')
}
