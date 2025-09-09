import React from 'react'
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import IdentificationForm from '@/components/checkout/IdentificationForm'
import PaymentForm from '@/components/checkout/PaymentForm'

expect.extend(toHaveNoViolations as any)

const noop = () => {}

describe('A11y - IdentificationForm', () => {
  it('has no basic accessibility violations (initial state)', async () => {
    const { container } = render(
      <IdentificationForm value={{ nome: '', email: '', cpf: '' }} onChange={noop} onNext={noop} />
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe('A11y - PaymentForm (PIX)', () => {
  it('has no basic accessibility violations (pix default)', async () => {
    const { container } = render(<PaymentForm total={100} onPrev={noop} onNext={noop} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
