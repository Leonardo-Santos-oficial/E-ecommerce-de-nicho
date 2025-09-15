import React from 'react'
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, CartItem } from '@/context/CartContext'
import { useEffectiveDiscount } from '@/utils/discount'
import { useCart } from '@/hooks/useCart'

// Factory returning a named wrapper component so eslint (react/display-name) passes during Next build
const wrapperFactory = (items: CartItem[] = []) => {
  const CartProviderTestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CartProvider initialItems={items}>{children}</CartProvider>
  )
  CartProviderTestWrapper.displayName = 'CartProviderTestWrapper'
  return CartProviderTestWrapper
}

describe('useEffectiveDiscount', () => {
  it('falls back to default Pix when cart has no savings', () => {
    const { result } = renderHook(() => useEffectiveDiscount(200), { wrapper: wrapperFactory([]) })
    expect(result.current.savings).toBeGreaterThan(0)
    expect(result.current.label?.toLowerCase()).toContain('pix')
  })

  it('reflects cart discount when coupon applied', () => {
    const item: any = {
      id: '1',
      slug: '1',
      name: 'Test',
      description: 'desc',
      price: 100,
      formattedPrice: 'R$ 100,00',
      image: '/placeholder.svg',
      category: 'x',
      quantity: 1,
    }
    const Wrapper = wrapperFactory([item])
    const { result } = renderHook(
      () => {
        const cart = useCart()
        const effective = useEffectiveDiscount(100)
        return { cart, effective }
      },
      { wrapper: Wrapper }
    )

    act(() => {
      result.current.cart.applyCoupon('SAVE20', 20)
    })

    // Re-read after state update
    expect(result.current.effective.label?.toLowerCase()).toContain('cupom')
    expect(result.current.effective.savings).toBe(20)
  })
})
