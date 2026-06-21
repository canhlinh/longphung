// Shared constants to reduce magic strings across collections, seed, frontend (Issue 25)

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  PREORDER: 'preorder',
  OUT_OF_STOCK: 'out_of_stock',
} as const

export const STOCK_LABELS: Record<string, string> = {
  [STOCK_STATUS.IN_STOCK]: 'Con hang',
  [STOCK_STATUS.PREORDER]: 'Sap ve',
  [STOCK_STATUS.OUT_OF_STOCK]: 'Het hang',
}

export const UNITS = ['kg', 'con', 'thung', 'hop', 'set'] as const

export const PLACEMENTS = {
  HOME: 'home',
} as const

export const PLACEMENT_LABELS: Record<string, string> = {
  [PLACEMENTS.HOME]: 'Trang chu',
}
