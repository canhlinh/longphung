import { getProductImage } from '@/lib/storefront'

const GROUP_STYLES: Record<string, { color: string; icon: string }> = {
  'combo-gia-dinh': { icon: '🍲', color: '#f97316' },
  'hai-san-tuoi': { icon: '🦐', color: '#0ea5b8' },
  sashimi: { icon: '🍣', color: '#1565c0' },
}

type AnyDoc = Record<string, unknown>

export type PriceTier = {
  name: string
  pco: number
  price: number
}

export type BoardVariant = {
  kv_id: string
  on_hand: number
  pco: number
  price: number
  prices?: PriceTier[]
  unit: string
}

export type BoardCard = {
  dir?: 'down' | 'up'
  group_id: number
  image?: string
  isNew?: boolean
  key: string
  name: string
  variants: BoardVariant[]
}

export type BoardGroup = {
  color: string
  count: number
  icon: string
  id: number
  name: string
}

export type BoardMeta = {
  boss_name?: string
  boss_phone?: string
  customer_name: string
  customer_phone?: string
  greeting?: string
  logo?: string
  popup: boolean
  promo_text?: string
  retail_only: boolean
  sale_name?: string
  sale_phone?: string
  show_stock: boolean
  store_name: string
  tier_name: string
}

export type BoardData = {
  cards: BoardCard[]
  groups: BoardGroup[]
  meta: BoardMeta
}

function asObject(value: unknown): AnyDoc | null {
  return value && typeof value === 'object' ? (value as AnyDoc) : null
}

function asNumber(value: unknown): number {
  return typeof value === 'number' ? value : 0
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

function asBoolean(value: unknown): boolean {
  return value === true
}

function stockOnHand(status?: unknown, onHand?: number): number {
  if (typeof onHand === 'number') return onHand
  if (status === 'out_of_stock') return 0
  return 1
}

function hasVietnameseDiacritics(value: string): boolean {
  return /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(
    value,
  )
}

function cardScore(card: BoardCard): number {
  let score = 0
  if (hasVietnameseDiacritics(card.name)) score += 4
  if (card.image) score += 2
  if (card.variants[0]?.price > 0 || card.variants[0]?.pco > 0) score += 1
  return score
}

function dedupeKey(item: AnyDoc, product: AnyDoc | null, index: number): string {
  const external = asString(item.externalKey)
  if (external) return `price:${external}`

  const productId = product?.id
  if (productId !== undefined && productId !== null) {
    return `product:${String(productId)}`
  }

  const slug = asString(product?.slug)
  if (slug) {
    return `slug:${slug}`
  }

  const priceId = asString(item.id)
  if (priceId) {
    return `price:${priceId}`
  }

  return `row:${index}`
}

function parsePriceTiers(value: unknown): PriceTier[] | undefined {
  if (!Array.isArray(value)) return undefined
  const tiers = value
    .map((entry) => {
      const row = asObject(entry)
      if (!row) return null
      return {
        name: asString(row.name),
        price: asNumber(row.price),
        pco: asNumber(row.pco) || asNumber(row.price),
      }
    })
    .filter((tier): tier is PriceTier => Boolean(tier?.name))

  return tiers.length ? tiers : undefined
}

function resolveImage(product: AnyDoc | null, index: number): string | undefined {
  const sourceImage = asString(product?.sourceImageUrl)
  if (sourceImage.startsWith('http')) {
    return sourceImage
  }

  const payloadImage = product ? getProductImage(product, index) : ''
  return payloadImage.startsWith('http') ? payloadImage : undefined
}

export function buildWholesaleBoardData({
  categories,
  customer,
  prices,
  settings,
}: {
  categories: AnyDoc[]
  customer: AnyDoc
  prices: AnyDoc[]
  settings: AnyDoc
}): BoardData {
  const sortedCategories = [...categories].sort(
    (a, b) => asNumber(a.sortOrder) - asNumber(b.sortOrder),
  )

  const groupBySourceId = new Map<number, number>()
  const groupBySlug = new Map<string, number>()
  const groups: BoardGroup[] = []

  sortedCategories.forEach((category, index) => {
    const slug = asString(category.slug)
    const sourceGroupId = asNumber(category.sourceGroupId)
    const id = sourceGroupId || index + 1
    const fallback = GROUP_STYLES[slug] || { icon: '📦', color: '#90a4ae' }

    groups.push({
      id,
      name: asString(category.name) || 'Khác',
      icon: asString(category.icon) || fallback.icon,
      color: asString(category.color) || fallback.color,
      count: 0,
    })

    if (sourceGroupId) {
      groupBySourceId.set(sourceGroupId, id)
    }
    groupBySlug.set(slug, id)
  })

  if (!groups.length) {
    groups.push({ id: 1, name: 'Tất cả sản phẩm', icon: '🛒', color: '#0ea5b8', count: 0 })
  }

  const cardMap = new Map<string, BoardCard>()
  const activePrices = prices.filter((item) => item.isActive !== false)

  activePrices.forEach((item, index) => {
    const product = asObject(item.product)
    const productCategory = asObject(product?.category)
    const sourceGroupId = asNumber(productCategory?.sourceGroupId)
    const categorySlug = asString(productCategory?.slug)
    const groupId =
      (sourceGroupId ? groupBySourceId.get(sourceGroupId) : undefined) ||
      groupBySlug.get(categorySlug) ||
      groups[0]?.id ||
      1

    const retail = asNumber(item.price) || asNumber(product?.retailPrice)
    const wholesale = asNumber(item.wholesalePrice) || asNumber(product?.wholesalePrice) || retail
    const unit = asString(item.displayUnit) || asString(item.unit) || asString(product?.unit) || 'kg'
    const name = asString(item.displayName) || asString(product?.name) || `Sản phẩm ${index + 1}`
    const key = dedupeKey(item, product, index)
    const imageUrl = resolveImage(product, index)
    const priceDirection = asString(product?.priceDirection)
    const dir = priceDirection === 'up' || priceDirection === 'down' ? priceDirection : undefined

    const card: BoardCard = {
      key,
      name,
      group_id: groupId,
      image: imageUrl,
      isNew: asBoolean(product?.isNewListing),
      dir,
      variants: [
        {
          kv_id: asString(item.externalKey) || `${key}-${unit}`,
          unit,
          price: retail,
          pco: wholesale,
          prices: parsePriceTiers(item.priceTiers),
          on_hand: stockOnHand(product?.stockStatus),
        },
      ],
    }

    const existing = cardMap.get(key)
    if (!existing || cardScore(card) > cardScore(existing)) {
      cardMap.set(key, card)
    }
  })

  const cards = Array.from(cardMap.values())

  cards.forEach((card) => {
    const group = groups.find((entry) => entry.id === card.group_id)
    if (group) {
      group.count += 1
    }
  })

  const visibleGroups = groups.filter((group) => group.count > 0)

  return {
    meta: {
      store_name:
        asString(settings.brandName) || asString(customer.storeDisplayName) || 'Hải Sản Minh Kiên',
      tier_name: asString(customer.tierName) || 'Khách sỉ',
      customer_name: asString(customer.contactPerson) || asString(customer.name),
      customer_phone: asString(customer.phone) || undefined,
      sale_name: asString(customer.saleName) || asString(settings.brandName) || 'Hải Sản Minh Kiên',
      sale_phone: asString(customer.salePhone) || asString(settings.hotline),
      boss_name: asString(customer.bossName) || undefined,
      boss_phone: asString(customer.bossPhone) || undefined,
      greeting: asString(customer.greeting) || undefined,
      show_stock: true,
      retail_only: false,
      popup: true,
      promo_text:
        asString(customer.promoText) ||
        'Hải sản tươi mỗi ngày — chọn món yêu thích và gửi danh sách qua Zalo để chốt đơn nhanh.',
    },
    groups: visibleGroups.length ? visibleGroups : groups,
    cards,
  }
}