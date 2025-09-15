// Central coupon registry following OCP: extend by adding new entries, logic stays stable.
// Each coupon can express validation logic (e.g. minimum subtotal) without changing consumers.

export interface CouponRule {
  code: string
  percent: number
  minSubtotal?: number
  expiresAt?: string // ISO date
  // Future extension: stackable, usageLimit, customerSegment, etc.
}

// Simple in-memory registry. In real app fetch from API / CMS.
const REGISTRY: CouponRule[] = [
  { code: 'SAVE10', percent: 10 },
  { code: 'SAVE20', percent: 20, minSubtotal: 100 },
  { code: 'DEV5', percent: 5 },
]

export type CouponValidationResult =
  | { ok: true; code: string; percent: number }
  | { ok: false; reason: 'not-found' | 'expired' | 'min-subtotal'; message: string }

export function validateCoupon(rawCode: string, subtotal: number): CouponValidationResult {
  const code = rawCode.trim().toUpperCase()
  if (!code) return { ok: false, reason: 'not-found', message: 'Informe um código.' }
  const rule = REGISTRY.find((r) => r.code === code)
  if (!rule) return { ok: false, reason: 'not-found', message: 'Cupom inválido.' }
  if (rule.expiresAt && new Date(rule.expiresAt) < new Date()) {
    return { ok: false, reason: 'expired', message: 'Cupom expirado.' }
  }
  if (rule.minSubtotal && subtotal < rule.minSubtotal) {
    return {
      ok: false,
      reason: 'min-subtotal',
      message: `Valor mínimo de ${rule.minSubtotal.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}.`,
    }
  }
  return { ok: true, code: rule.code, percent: rule.percent }
}
