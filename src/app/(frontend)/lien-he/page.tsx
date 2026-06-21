import type { Metadata } from 'next'
import { MessageCircle, Phone } from 'lucide-react'
import React from 'react'

import { AddressBlock, ContactBand } from '../components'
import { getSettings } from '@/lib/storefront'

export const metadata: Metadata = {
  title: 'Liên hệ | Minh Kiên Seafood',
  description: 'Liên hệ Minh Kiên Seafood để đặt hải sản, nhận bảng giá sỉ và bảng giá mỗi ngày.',
}

export default async function ContactPage() {
  const settings = await getSettings()

  return (
    <>
      <section className="page-hero compact">
        <p className="eyebrow">Liên hệ</p>
        <h1>Đặt hải sản nhanh qua Zalo hoặc hotline</h1>
        <p>Gửi danh sách sản phẩm, số lượng và thời gian cần nhận. Minh Kiên sẽ phản hồi nhanh.</p>
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
          <h2>Thông tin cần gửi khi đặt hàng</h2>
          <p>Tên sản phẩm, số lượng, quy cách, địa chỉ giao và thời gian mong muốn.</p>
          <p>Đơn sỉ/nhà hàng có thể gửi danh sách nhiều món để nhận báo giá riêng.</p>
        </div>
      </section>
      <ContactBand settings={settings} />
    </>
  )
}
