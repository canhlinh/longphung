export function formatPrice(value?: number | null, label?: string | null): string {
  if (label) {
    return label
  }

  if (!value) {
    return 'Liên hệ'
  }

  return new Intl.NumberFormat('vi-VN', {
    currency: 'VND',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value)
}

export function createZaloUrl(zaloUrl: string, message: string): string {
  const separator = zaloUrl.includes('?') ? '&' : '?'
  return `${zaloUrl}${separator}text=${encodeURIComponent(message)}`
}