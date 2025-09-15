import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CheckoutPage from '../pages/checkout'
import { CartProvider } from '../context/CartContext'

// Testa se o resumo mostra economia e label de desconto

describe('Checkout discount visuals', () => {
  it('shows savings badge and discount label', () => {
    const items = [
      {
        id: 'sku-1',
        slug: 'sku-1',
        name: 'Produto Teste',
        description: 'Desc',
        price: 100,
        formattedPrice: 'R$ 100,00',
        image: '/placeholder.svg',
        category: 'test',
        quantity: 1,
      },
    ] as any

    render(
      <CartProvider initialItems={items}>
        <CheckoutPage />
      </CartProvider>
    )

    expect(screen.getByText(/você economiza/i)).toBeInTheDocument()
    expect(screen.getByText(/pix/i)).toBeInTheDocument()
  })
})
