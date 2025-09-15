import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider } from '@/context/CartContext'
import OrderSummary from '@/components/cart/OrderSummary'

// Integration style test focusing on coupon UI behavior and cart discount reflection.
// Keeps scenario minimal: one item with known subtotal to assert savings easily.

describe('CouponForm UI integration', () => {
  const renderSummary = () => {
    return render(
      <CartProvider
        initialItems={[
          {
            id: '1',
            name: 'Item',
            description: 'Desc',
            price: 100,
            formattedPrice: 'R$ 100,00',
            image: '/placeholder.svg',
            slug: 'item',
            category: 'x',
            quantity: 1,
          } as any,
        ]}
      >
        {/* OrderSummary will compute its totals via useCart */}
        <OrderSummary
          subtotal={100}
          total={100}
          totalWithDiscount={100}
          savings={0}
          installment={{ installments: 1, amount: 100 }}
        />
      </CartProvider>
    )
  }

  it('applies a valid coupon and shows updated badge', async () => {
    renderSummary()
    const input = screen.getByPlaceholderText(/insira seu cupom/i)
    fireEvent.change(input, { target: { value: 'save10' } })
    fireEvent.click(screen.getByRole('button', { name: /aplicar/i }))

    await waitFor(() => {
      expect(screen.getByText(/cupom save10 aplicado/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid coupon', async () => {
    renderSummary()
    const input = screen.getByPlaceholderText(/insira seu cupom/i)
    fireEvent.change(input, { target: { value: 'abc' } })
    fireEvent.click(screen.getByRole('button', { name: /aplicar/i }))

    await waitFor(() => {
      expect(screen.getByText(/cupom inválido/i)).toBeInTheDocument()
    })
  })
})
