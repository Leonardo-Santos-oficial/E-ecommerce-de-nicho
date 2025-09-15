export interface ShopPricingConfig {
  pixDiscountPercent: number
  freeShippingThreshold: number
  maxInstallments: number
  minPerInstallment: number
}

export const SHOP_PRICING: ShopPricingConfig = {
  pixDiscountPercent: 5,
  freeShippingThreshold: 250,
  maxInstallments: 10,
  minPerInstallment: 5,
}

export function applyPixDiscount(total: number, percent = SHOP_PRICING.pixDiscountPercent) {
  if (total <= 0) return { discounted: 0, savings: 0 }
  const factor = Math.max(0, Math.min(100, percent)) / 100
  const discounted = Math.round(total * (1 - factor) * 100) / 100
  const savings = Math.round((total - discounted) * 100) / 100
  return { discounted, savings }
}

export function remainingForFreeShipping(
  subtotal: number,
  threshold = SHOP_PRICING.freeShippingThreshold
) {
  const remaining = threshold - subtotal
  return remaining > 0 ? Math.round(remaining * 100) / 100 : 0
}
