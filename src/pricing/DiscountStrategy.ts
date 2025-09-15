export interface DiscountContext {
  subtotal: number
}

export interface DiscountResult {
  total: number
  discountedTotal: number
  savings: number
  label?: string
}

export interface DiscountStrategy {
  applies(ctx: DiscountContext): boolean
  compute(ctx: DiscountContext): DiscountResult
}

export class PixDiscountStrategy implements DiscountStrategy {
  constructor(private percent: number) {}
  applies(ctx: DiscountContext) {
    return ctx.subtotal > 0
  }
  compute(ctx: DiscountContext): DiscountResult {
    const total = ctx.subtotal
    const factor = Math.max(0, Math.min(100, this.percent)) / 100
    const discountedTotal = Math.round(total * (1 - factor) * 100) / 100
    const savings = Math.round((total - discountedTotal) * 100) / 100
    return { total, discountedTotal, savings, label: `${this.percent}% Pix` }
  }
}

export class CompositeDiscountStrategy implements DiscountStrategy {
  constructor(private readonly strategies: DiscountStrategy[]) {}
  applies(ctx: DiscountContext) {
    return this.strategies.some((s) => s.applies(ctx))
  }
  compute(ctx: DiscountContext): DiscountResult {
    let best: DiscountResult | null = null
    for (const strat of this.strategies) {
      if (!strat.applies(ctx)) continue
      const result = strat.compute(ctx)
      if (!best || result.savings > best.savings) best = result
    }
    if (!best) return { total: ctx.subtotal, discountedTotal: ctx.subtotal, savings: 0 }
    return best
  }
}

export function buildDefaultDiscountStrategy() {
  return new CompositeDiscountStrategy([new PixDiscountStrategy(5)])
}
