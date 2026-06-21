import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'
import { slugify } from '@/lib/slugify'
import { admins, publishedOrAdmin } from '@/access/admins'
import { formatPrice, stockLabel, plainTextFromRichText } from '@/lib/storefront'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({ collection: 'users' })
    expect(users).toBeDefined()
  })

  it('slugify works', () => {
    expect(slugify('Combo gia dinh')).toBe('combo-gia-dinh')
  })

  it('formatPrice and stockLabel helpers work', () => {
    expect(formatPrice(360000)).toContain('360.000')
    expect(stockLabel('preorder')).toBe('Sap ve')
  })

  it('admins access requires role=admin', () => {
    const allow = admins({ req: { user: { role: 'admin' } } } as any)
    const deny = admins({ req: { user: { role: 'viewer' } } } as any)
    const noUser = admins({ req: { user: null } } as any)
    expect(!!allow).toBe(true)
    expect(!!deny).toBe(false)
    expect(!!noUser).toBe(false)
  })

  it('publishedOrAdmin returns filter when no user', () => {
    const res = publishedOrAdmin({ req: { user: null } } as any)
    expect(res).toHaveProperty('_status')
  })

  it('plainTextFromRichText handles lexical-ish shape', () => {
    const val = { root: { children: [{ children: [{ text: 'Hello' }] }] } }
    expect(plainTextFromRichText(val)).toBe('Hello')
  })
})
