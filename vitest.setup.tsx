import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
import { expect, vi } from 'vitest'
import React from 'react'

// Registrar matcher de acessibilidade uma única vez
// @ts-ignore - assinatura simplificada
expect.extend({ toHaveNoViolations })

// Mock global de next/router para testes de componentes que usam useRouter (Layout, etc.)
vi.mock('next/router', () => {
  return {
    useRouter: () => ({
      pathname: '/',
      route: '/',
      asPath: '/',
      query: {},
      push: vi.fn().mockResolvedValue(true),
      replace: vi.fn().mockResolvedValue(true),
      prefetch: vi.fn().mockResolvedValue(undefined),
      back: vi.fn(),
      beforePopState: vi.fn(),
      events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
      isFallback: false,
    }),
  }
})

// Mock next/link preservando semântica de acessibilidade (<a>) mas sem prefetch
vi.mock('next/link', () => {
  const Link = ({ href, children, legacyBehavior, ...rest }: any) => {
    const resolvedHref = typeof href === 'string' ? href : href?.pathname || '#'
    return (
      <a href={resolvedHref} {...rest} data-test-link-mock>
        {children}
      </a>
    )
  }
  return { __esModule: true, default: Link }
})
