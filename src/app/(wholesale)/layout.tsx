import React from 'react'

import './bg/wholesale-board.css'

export const metadata = {
  title: 'Bảng Giá Hải Sản',
  description: 'Bảng giá hải sản cập nhật mỗi ngày.',
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