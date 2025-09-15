import React from 'react'
import { render } from '@testing-library/react'
import { CartProvider, CartItem } from '@/context/CartContext'

interface Options {
  items?: CartItem[]
  coupon?: { code: string; percent: number }
}

export function renderWithCart(ui: React.ReactElement, { items = [], coupon }: Options = {}) {
  // Se houver cupom, aplicamos via provider pós-montagem usando um wrapper
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <CartProvider initialItems={items}>{children}</CartProvider>
  }
  const result = render(ui, { wrapper: Wrapper })
  // Não expomos applyCoupon aqui para manter util simples; testes que precisem podem usar useCart
  return result
}
