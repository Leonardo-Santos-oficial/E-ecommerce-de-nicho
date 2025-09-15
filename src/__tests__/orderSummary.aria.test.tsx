import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import OrderSummary from '@/components/cart/OrderSummary'
import { CartProvider } from '@/context/CartContext'

function renderOrderSummary() {
  render(
    <CartProvider initialItems={[]}>
      <OrderSummary
        subtotal={100}
        total={100}
        totalWithDiscount={95}
        savings={5}
        onContinue={() => {}}
        installment={{ installments: 10, amount: 10 }}
      />
    </CartProvider>
  )
}

describe('OrderSummary accessibility', () => {
  it('renders labels and aria-live regions for shipping and coupon', () => {
    renderOrderSummary()
    // Labels
    expect(screen.getByLabelText(/calcular frete/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cupom de desconto/i)).toBeInTheDocument()

    // aria-live regions exist (messages may be empty initially)
    const politeRegions = document.querySelectorAll('[aria-live="polite"]')
    expect(politeRegions.length).toBeGreaterThan(0)
  })

  it('shows savings badge above continue button', () => {
    renderOrderSummary()
    const continueBtn = screen.getByRole('button', { name: /continuar/i })
    const actionsContainer = continueBtn.closest('div') as HTMLElement
    expect(actionsContainer).toBeTruthy()
    expect(within(actionsContainer).getByText(/você economiza/i)).toBeInTheDocument()
  })
})
