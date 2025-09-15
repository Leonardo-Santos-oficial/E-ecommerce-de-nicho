import { useMemo } from 'react'
import { useCartContext } from '@/context/CartContext'
import { computeInstallment } from '@/utils/payments'
import { buildDefaultDiscountStrategy } from '@/pricing/DiscountStrategy'

export const useCart = () => {
  const ctx = useCartContext()
  const discountStrategy = useMemo(() => buildDefaultDiscountStrategy(), [])
  const totals = useMemo(() => {
    const subtotal = ctx.subtotal
    const result = discountStrategy.compute({ subtotal })
    return {
      subtotal,
      total: result.total,
      totalWithDiscount: result.discountedTotal,
      savings: result.savings,
      discountLabel: result.label,
    }
  }, [ctx.subtotal, discountStrategy])

  return {
    ...ctx,
    cartItems: ctx.items,
    clearCart: ctx.clear,
    ...totals,
    installment: computeInstallment(totals.total, { maxInstallments: 10, minPerInstallment: 5 }),
  }
}
