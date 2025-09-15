import { useCart } from '../hooks/useCart'

/**
 * Pure function to compute a default isolated discount when product is not yet in cart.
 * Keeps strategy fallback centralized (currently 5% Pix). Open for future extension.
 */
export function computeDefaultDiscount(price: number, percent = 5) {
  const discounted = Math.round(price * (1 - percent / 100) * 100) / 100
  const savings = Math.round((price - discounted) * 100) / 100
  return { discounted, savings, label: `${percent}% Pix` }
}

/**
 * Hook wrapper that tries cart values first, then falls back to isolated computation.
 */
export function useEffectiveDiscount(price: number) {
  const { totalWithDiscount, savings, discountLabel } = useCart()
  if (savings > 0 || (totalWithDiscount !== 0 && totalWithDiscount !== price)) {
    return { discounted: totalWithDiscount, savings, label: discountLabel }
  }
  return computeDefaultDiscount(price)
}
