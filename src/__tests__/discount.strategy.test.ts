import { describe, it, expect } from 'vitest'
import {
  PixDiscountStrategy,
  CompositeDiscountStrategy,
  DiscountStrategy,
  DiscountContext,
} from '@/pricing/DiscountStrategy'

describe('PixDiscountStrategy', () => {
  it('applies percent discount correctly', () => {
    const strat = new PixDiscountStrategy(5)
    const r = strat.compute({ subtotal: 200 })
    expect(r.total).toBe(200)
    expect(r.discountedTotal).toBe(190)
    expect(r.savings).toBe(10)
    expect(r.label).toContain('5')
  })

  it('caps negative subtotal', () => {
    const strat = new PixDiscountStrategy(5)
    const r = strat.compute({ subtotal: 0 })
    expect(r.discountedTotal).toBe(0)
    expect(r.savings).toBe(0)
  })
})

describe('CompositeDiscountStrategy', () => {
  const mk = (savings: number, applies = true): DiscountStrategy => ({
    applies: () => applies,
    compute: (ctx: DiscountContext) => ({
      total: ctx.subtotal,
      discountedTotal: ctx.subtotal - savings,
      savings,
    }),
  })

  it('selects best savings among strategies', () => {
    const composite = new CompositeDiscountStrategy([mk(5), mk(12), mk(8)])
    const r = composite.compute({ subtotal: 100 })
    expect(r.discountedTotal).toBe(88) // 12 savings best
    expect(r.savings).toBe(12)
  })

  it('returns identity result if none applies', () => {
    const composite = new CompositeDiscountStrategy([mk(5, false), mk(1, false)])
    const r = composite.compute({ subtotal: 50 })
    expect(r.discountedTotal).toBe(50)
    expect(r.savings).toBe(0)
  })
})
