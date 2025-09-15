import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProductDetail, { getStaticProps } from '../pages/products/[slug]'
import { CartProvider } from '../context/CartContext'

// Testa apenas a presença do bloco de desconto na PDP para um produto válido
// Mantendo simples (SRP) e focado em comportamento observável.

describe('Product Page discount label', () => {
  it('renders discount label Pix', async () => {
    // Usa getStaticProps para simular build (slug conhecido do dataset products.json)
    const slug = 'camiseta-javascript'
    const result: any = await getStaticProps({ params: { slug } } as any)
    expect(result).toBeTruthy()
    expect(result.notFound).not.toBe(true)
    const { product, related } = result.props
    // Envolve em CartProvider pois ProductDetail usa useCart
    render(
      <CartProvider initialItems={[]}>
        <ProductDetail product={product} related={related} />
      </CartProvider>
    )
    // Procura padrão Pix (case-insensitive)
    expect(screen.getByText(/pix/i)).toBeInTheDocument()
  })
})
