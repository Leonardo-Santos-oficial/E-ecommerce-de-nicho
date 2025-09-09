import '@testing-library/jest-dom'
import { toHaveNoViolations } from 'jest-axe'
import { expect } from 'vitest'

// Registrar matcher de acessibilidade uma única vez
// @ts-ignore - assinatura simplificada
expect.extend({ toHaveNoViolations })
