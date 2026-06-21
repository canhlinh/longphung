import type { Metadata } from 'next'
import { MessageCircle, Phone } from 'lucide-react'
import React from 'react'

import { AddressBlock, ContactBand } from '../components'
import { getSettings } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Lien he | Long Phung Seafood',
  description: 'Lien he Long Phung Seafood de dat hai san, nhan bang gia si va bang gia moi ngay.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Lien he</p>
        <h1>Dat hai san nhanh qua Zalo hoac hotline</h1>
        <p>Gui danh sach san pham, so luong va thoi gian can nhan. Long Phung se phan hoi nhanh.</p>
        <div className="hero-actions">
          <a className="button primary" href={(settings as any).zaloUrl}>
            <MessageCircle size={18} /> Chat Zalo
          </a>
          <a className="button secondary" href={`tel:${(settings as any).hotline.replace(/\s/g, '')}`}>
            <Phone size={18} /> {(settings as any).hotline}
          </a>
        </div>
      </section>
      <section className="page-section contact-layout">
        <AddressBlock settings={settings} />
        <div className="policy-panel">
          <h2>Thong tin can gui khi dat hang</h2>
          <p>Ten san pham, so luong, quy cach, dia chi giao va thoi gian mong muon.</p>
          <p>Don si/nha hang co the gui danh sach nhieu mon de nhan bao gia rieng.</p>
        </div>
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
