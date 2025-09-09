import { describe, it, expect } from 'vitest'
import {
  maskCPF,
  validateCPF,
  maskCEP,
  validateCEP,
  maskCardNumber,
  maskExpiry,
  maskCVV,
  validateEmail,
} from '@/utils/masks'

describe('mask & validation utilities', () => {
  it('masks CPF correctly', () => {
    expect(maskCPF('12345678901')).toBe('123.456.789-01')
  })
  it('rejects invalid CPF with repeating digits', () => {
    expect(validateCPF('111.111.111-11')).toBe(false)
  })
  it('validates a known valid CPF (529.982.247-25)', () => {
    expect(validateCPF('529.982.247-25')).toBe(true)
  })
  it('masks CEP', () => {
    expect(maskCEP('12345678')).toBe('12345-678')
  })
  it('validates CEP length', () => {
    expect(validateCEP('12345-678')).toBe(true)
    expect(validateCEP('1234')).toBe(false)
  })
  it('masks card number into groups', () => {
    expect(maskCardNumber('4111111111111111')).toBe('4111 1111 1111 1111')
  })
  it('masks expiry as MM/AA', () => {
    expect(maskExpiry('0728')).toBe('07/28')
  })
  it('limits CVV to 4 digits', () => {
    expect(maskCVV('12345')).toBe('1234')
  })
  it('validates simple email pattern', () => {
    expect(validateEmail('a@b.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)
  })
})
