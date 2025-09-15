import { describe, it, expect } from 'vitest'
import {
  CompositeDiscountStrategy,
  PixDiscountStrategy,
  PercentageCouponDiscountStrategy,
} from '@/pricing/DiscountStrategy'

function ctx(subtotal: number, couponPercent?: number, couponCode?: string) {
  return { subtotal, couponPercent, couponCode }
}

describe('Coupon Discount Strategy', () => {
  it('applies coupon when present and better than Pix', () => {
    const strat = new CompositeDiscountStrategy([
      new PixDiscountStrategy(5),
      new PercentageCouponDiscountStrategy('SAVE10'),
    ])
    const result = strat.compute(ctx(100, 10, 'SAVE10'))
    expect(result.discountedTotal).toBe(90)
    expect(result.savings).toBe(10)
    expect(result.label?.toLowerCase()).toContain('cupom')
  })

  it('keeps Pix when coupon is worse', () => {
    const strat = new CompositeDiscountStrategy([
      new PixDiscountStrategy(5),
      new PercentageCouponDiscountStrategy('C3'),
    ])
    const result = strat.compute(ctx(100, 3, 'C3'))
    expect(result.discountedTotal).toBe(95)
    expect(result.savings).toBe(5)
    expect(result.label?.toLowerCase()).toContain('pix')
  })

  it('returns subtotal if no strategy applies', () => {
    const strat = new CompositeDiscountStrategy([
      new PixDiscountStrategy(5),
      new PercentageCouponDiscountStrategy('X'),
    ])
    const result = strat.compute(ctx(0, 0, 'X'))
    expect(result.discountedTotal).toBe(0)
    expect(result.savings).toBe(0)
  })
})
