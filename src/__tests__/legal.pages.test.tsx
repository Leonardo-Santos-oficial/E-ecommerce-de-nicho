import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CookiesPolicyPage from '../pages/politicas/cookies'
import PrivacyPolicyPage from '../pages/politicas/privacidade'
import ConsumerRightsPage from '../pages/politicas/consumidor'
import { CartProvider } from '@/context/CartContext'

// Testes básicos garantindo renderização e headings principais (Smoke Tests). Mantidos mínimos para evitar fragilidade.

describe('Legal Pages', () => {
  it('renders Cookies Policy page with main heading', () => {
    render(
      <CartProvider>
        <CookiesPolicyPage />
      </CartProvider>
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /política de cookies/i })
    ).toBeInTheDocument()
  })

  it('renders Privacy Policy page with main heading', () => {
    render(
      <CartProvider>
        <PrivacyPolicyPage />
      </CartProvider>
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /política de privacidade/i })
    ).toBeInTheDocument()
  })

  it('renders Consumer Rights page with main heading', () => {
    render(
      <CartProvider>
        <ConsumerRightsPage />
      </CartProvider>
    )
    expect(
      screen.getByRole('heading', { level: 1, name: /código de defesa do consumidor/i })
    ).toBeInTheDocument()
  })
})
