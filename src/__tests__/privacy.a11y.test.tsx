import React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PrivacyPolicyPage from '../pages/politicas/privacidade'
import { CartProvider } from '@/context/CartContext'
import { axe } from 'jest-axe'

// Teste focado: valida que a página de privacidade não possui violações de acessibilidade básicas.
// Mantido isolado e rápido (Clean Test). SRP: apenas verificação axe.

describe('PrivacyPolicyPage a11y', () => {
  it('should have no a11y violations', async () => {
    const { container } = render(
      <CartProvider>
        <PrivacyPolicyPage />
      </CartProvider>
    )
    // Aguarda microtasks de possíveis atualizações assíncronas (ex.: links)
    await new Promise((r) => setTimeout(r, 0))
    const results = await axe(container)
    if (results.violations.length > 0) {
      const details = results.violations
        .map((v) => `${v.id}: ${v.help} (nodes: ${v.nodes.length})`)
        .join('\n')
      throw new Error(`A11y violations found:\n${details}`)
    }
    expect(results.violations.length).toBe(0)
  })
})
