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
  // Se o carrinho já tem uma estratégia vencedora (Pix ou Cupom), retornamos essa
  if (savings > 0 && discountLabel) {
    return { discounted: totalWithDiscount, savings, label: discountLabel }
  }
  // Fallback: cálculo isolado (Pix default)
  return computeDefaultDiscount(price)
}
