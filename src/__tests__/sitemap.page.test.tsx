import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SiteMapPage, { SITE_MAP_SECTIONS } from '../pages/mapa-do-site'
import { CartProvider } from '@/context/CartContext'

// Smoke test simples garantindo heading principal e número de links (legível e independente)

describe('SiteMapPage', () => {
  it('renders heading and all links', () => {
    render(
      <CartProvider>
        <SiteMapPage />
      </CartProvider>
    )

    expect(screen.getByRole('heading', { level: 1, name: /mapa do site/i })).toBeInTheDocument()

    const expectedLinks = SITE_MAP_SECTIONS.reduce((acc, s) => acc + s.links.length, 0)
    // Usamos screen.getAllByRole para robustez (a11y) filtrando links internos
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.getAttribute('href') && l.getAttribute('href')!.startsWith('/'))

    expect(links.length).toBeGreaterThanOrEqual(expectedLinks)
  })
})
