import { useMemo } from 'react'
import { useCartContext } from '@/context/CartContext'
import { computeInstallment } from '@/utils/payments'
import { buildDiscountStrategyWithCoupon } from '@/pricing/DiscountStrategy'

export const useCart = () => {
  const ctx = useCartContext()
  const discountStrategy = useMemo(
    () =>
      buildDiscountStrategyWithCoupon(
        ctx.coupon ? { code: ctx.coupon.code, percent: ctx.coupon.percent } : null
      ),
    [ctx.coupon]
  )
  const totals = useMemo(() => {
    const subtotal = ctx.subtotal
    const result = discountStrategy.compute({
      subtotal,
      couponPercent: ctx.coupon?.percent,
      couponCode: ctx.coupon?.code,
    })
    return {
      subtotal,
      total: result.total,
      totalWithDiscount: result.discountedTotal,
      savings: result.savings,
      discountLabel: result.label,
    }
  }, [ctx.subtotal, ctx.coupon, discountStrategy])

  return {
    ...ctx,
    cartItems: ctx.items,
    clearCart: ctx.clear,
    applyCoupon: ctx.applyCoupon,
    clearCoupon: ctx.clearCoupon,
    ...totals,
    installment: computeInstallment(totals.total, { maxInstallments: 10, minPerInstallment: 5 }),
  }
}
