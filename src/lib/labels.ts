// Vietnamese UI labels shared across admin, storefront, and seed data.

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  PREORDER: 'preorder',
  OUT_OF_STOCK: 'out_of_stock',
} as const

export const STOCK_LABELS: Record<string, string> = {
  [STOCK_STATUS.IN_STOCK]: 'Còn hàng',
  [STOCK_STATUS.PREORDER]: 'Sắp về',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Hết hàng',
}

export const STOCK_OPTIONS = [
  { label: STOCK_LABELS[STOCK_STATUS.IN_STOCK], value: STOCK_STATUS.IN_STOCK },
  { label: STOCK_LABELS[STOCK_STATUS.PREORDER], value: STOCK_STATUS.PREORDER },
  { label: STOCK_LABELS[STOCK_STATUS.OUT_OF_STOCK], value: STOCK_STATUS.OUT_OF_STOCK },
]

export const UNITS = ['kg', 'con', 'thung', 'hop', 'set'] as const

export const UNIT_OPTIONS = [
  { label: 'Kg', value: 'kg' },
  { label: 'Con', value: 'con' },
  { label: 'Thùng', value: 'thung' },
  { label: 'Hộp', value: 'hop' },
  { label: 'Set', value: 'set' },
]

export const PLACEMENTS = {
  HOME: 'home',
} as const

export const PLACEMENT_LABELS: Record<string, string> = {
  [PLACEMENTS.HOME]: 'Trang chủ',
}