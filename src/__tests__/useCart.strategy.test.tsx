import React from 'react'
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
// Usando import relativo para contornar problema de resolução de alias no ambiente de testes (TS2307)
import { CartProvider } from '../context/CartContext'
import { useCart } from '../hooks/useCart'

function setupWithSubtotal(subtotal: number) {
  const items =
    subtotal > 0
      ? [
          {
            id: 'x',
            name: 'Item',
            price: subtotal,
            quantity: 1,
            image: '',
            slug: 'x',
            description: '',
            category: 'test',
            formattedPrice: '',
          },
        ]
      : []
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CartProvider initialItems={items}>{children}</CartProvider>
  )
  return renderHook(() => useCart(), { wrapper })
}

beforeEach(() => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear()
  }
})

describe('useCart with discount strategy', () => {
  it('computes 5% Pix discount', () => {
    const { result } = setupWithSubtotal(100)
    expect(result.current.total).toBe(100)
    expect(result.current.totalWithDiscount).toBe(95)
    expect(result.current.savings).toBe(5)
    expect(result.current.discountLabel).toContain('5')
  })

  it('handles empty subtotal gracefully', () => {
    const { result } = setupWithSubtotal(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.total).toBe(0)
    expect(result.current.totalWithDiscount).toBe(0)
    expect(result.current.savings).toBe(0)
  })
})
