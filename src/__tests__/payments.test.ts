import { describe, it, expect } from 'vitest'
import { computeInstallment } from '../utils/payments'

describe('computeInstallment', () => {
  it('returns 1 installment for non-positive totals', () => {
    expect(computeInstallment(0)).toEqual({ installments: 1, amount: 0 })
  })

  it('respects min per installment', () => {
    const plan = computeInstallment(20, { maxInstallments: 10, minPerInstallment: 9 })
    expect(plan.installments).toBe(2)
    expect(plan.amount).toBeCloseTo(10, 2)
  })

  it('caps at max installments', () => {
    const plan = computeInstallment(1000, { maxInstallments: 5, minPerInstallment: 1 })
    expect(plan.installments).toBe(5)
    expect(plan.amount).toBeCloseTo(200, 2)
  })

  it('rounds to 2 decimals', () => {
    const plan = computeInstallment(99.99, { maxInstallments: 10, minPerInstallment: 1 })
    expect(plan.amount).toBeCloseTo(10, 2)
  })
})
