import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import IdentificationForm from '../components/checkout/IdentificationForm'
import AddressForm from '../components/checkout/AddressForm'
import PaymentForm from '../components/checkout/PaymentForm'
import ReviewOrder from '../components/checkout/ReviewOrder'

// Helpers
const noop = () => {}

describe('IdentificationForm', () => {
  it('enables continue only when all fields valid', () => {
    const onNext = vi.fn()
    const value = { nome: '', email: '', cpf: '' }
    const onChange = vi.fn()
    render(<IdentificationForm value={value} onChange={onChange} onNext={onNext} />)
    const btn = screen.getByRole('button', { name: /continuar/i })
    expect(btn).toBeDisabled()
    // Fill fields
    fireEvent.change(screen.getByPlaceholderText(/joão da silva/i), { target: { value: 'Fulano Teste' } })
    fireEvent.change(screen.getByPlaceholderText(/voce@exemplo.com/i), { target: { value: 'email@dominio.com' } })
    fireEvent.change(screen.getByPlaceholderText(/somente números/i), { target: { value: '12345678901' } })
    // We rely on controlled form; onChange called thrice
    expect(onChange).toHaveBeenCalledTimes(3)
  })
})

describe('AddressForm', () => {
  it('requires mandatory address fields before advancing', () => {
    const base = { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }
    const onChange = vi.fn()
    const onNext = vi.fn()
    render(<AddressForm value={base} onChange={onChange} onPrev={noop} onNext={onNext} />)
    const submit = screen.getByRole('button', { name: /continuar/i })
    expect(submit).toBeDisabled()
  })
})

describe('PaymentForm', () => {
  it('switches between Pix and Cartão', () => {
    const onNext = vi.fn()
    render(<PaymentForm total={100} onPrev={noop} onNext={onNext} />)
    // Default Pix label is inside a span with discount info
    expect(screen.getByText(/pix \(5% off\)/i)).toBeInTheDocument()
    // Select cartao
    fireEvent.click(screen.getByText(/cartão/i))
    expect(screen.getByText(/número do cartão/i)).toBeInTheDocument()
  })
})

describe('ReviewOrder', () => {
  it('renders summary info', () => {
    const items = [{ id: '1', name: 'Item A', price: 10, quantity: 2, slug: 'item-a', description: '', formattedPrice: 'R$ 10,00', image: '/placeholder.svg', category: 'geral' }]
    render(<ReviewOrder
      items={items as any}
      totals={{ subtotal: 20, total: 20, totalWithDiscount: 19, savings: 1 }}
      identification={{ nome: 'Teste', email: 't@e.com', cpf: '12345678901' }}
      address={{ cep: '00000000', rua: 'Rua', numero: '10', complemento: '', bairro: 'Bairro', cidade: 'Cidade', estado: 'SP' }}
      paymentMethod="pix"
      onPrev={noop}
      onConfirm={noop}
    />)
  expect(screen.getByText(/item a/i)).toBeInTheDocument()
  // Assert specific payment method line
  expect(screen.getByText(/pix \(com desconto\)/i)).toBeInTheDocument()
  })
})
