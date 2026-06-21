import { describe, expect, it } from 'vitest'

import { buildWholesaleBoardData } from '@/lib/wholesale-board-data'

describe('buildWholesaleBoardData', () => {
  it('deduplicates daily prices that point to the same product', () => {
    const data = buildWholesaleBoardData({
      categories: [
        { id: '1', name: 'Hải sản tươi', slug: 'hai-san-tuoi' },
        { id: '2', name: 'Sashimi', slug: 'sashimi' },
      ],
      customer: { name: 'Trần Long', contactPerson: 'Anh Long' },
      settings: { brandName: 'Long Phụng Seafood', hotline: '0900 000 000' },
      prices: [
        {
          id: 'price-1',
          displayName: 'Tom su song',
          price: 360000,
          wholesalePrice: 330000,
          unit: 'kg',
          isActive: true,
          product: {
            id: 'prod-1',
            name: 'Tôm sú sống',
            slug: 'tom-su-song',
            retailPrice: 360000,
            wholesalePrice: 330000,
            unit: 'kg',
            stockStatus: 'in_stock',
            category: { slug: 'hai-san-tuoi' },
          },
        },
        {
          id: 'price-2',
          displayName: 'Tôm sú sống',
          price: 360000,
          wholesalePrice: 330000,
          unit: 'kg',
          isActive: true,
          product: {
            id: 'prod-1',
            name: 'Tôm sú sống',
            slug: 'tom-su-song',
            retailPrice: 360000,
            wholesalePrice: 330000,
            unit: 'kg',
            stockStatus: 'in_stock',
            category: { slug: 'hai-san-tuoi' },
          },
        },
      ],
    })

    expect(data.cards).toHaveLength(1)
    expect(data.cards[0]?.name).toBe('Tôm sú sống')
    expect(data.cards[0]?.key).toBe('product:prod-1')
  })
})