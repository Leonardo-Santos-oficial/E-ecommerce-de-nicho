import { describe, it, expect, vi } from 'vitest'
import { validateCardLuhn, validateExpiryNotPast } from '@/utils/masks'

// Common PANs for testing: Visa 4111111111111111 (passes Luhn)

describe('validateCardLuhn', () => {
  it('accepts a valid card number', () => {
    expect(validateCardLuhn('4111 1111 1111 1111')).toBe(true)
  })
  it('rejects invalid numbers and lengths', () => {
    expect(validateCardLuhn('4111 1111 1111 1112')).toBe(false)
    expect(validateCardLuhn('1234')).toBe(false)
  })
})

describe('validateExpiryNotPast', () => {
  it('accepts current or future months', () => {
    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const yy = String(now.getFullYear() % 100).padStart(2, '0')
    expect(validateExpiryNotPast(`${mm}/${yy}`)).toBe(true)
  })
  it('rejects past months', () => {
    const now = new Date()
    const past = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const mm = String(past.getMonth() + 1).padStart(2, '0')
    const yy = String(past.getFullYear() % 100).padStart(2, '0')
    expect(validateExpiryNotPast(`${mm}/${yy}`)).toBe(false)
  })
  it('rejects invalid formats', () => {
    expect(validateExpiryNotPast('13/28')).toBe(false)
    expect(validateExpiryNotPast('0728')).toBe(false)
  })
})
