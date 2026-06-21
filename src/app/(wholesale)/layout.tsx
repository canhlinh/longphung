import React from 'react'

import './bg/wholesale-board.css'

// Render at request time so Docker/CI builds do not need customer or pricing data.
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Bảng Giá Sỉ',
  description: 'Bảng giá sỉ hải sản cập nhật mỗi ngày. Xem giá, chọn sản phẩm và liên hệ đặt hàng.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0ea5b8',
}

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="wholesale-body">{children}</body>
    </html>
  )
}
