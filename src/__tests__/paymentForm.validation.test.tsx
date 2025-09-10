import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PaymentForm from '@/components/checkout/PaymentForm'

const noop = () => {}

describe('PaymentForm (cartão) validações básicas', () => {
  it('bloqueia submit com número curto, nome vazio, validade inválida e CVV curto', () => {
    const onNext = vi.fn()
    render(<PaymentForm total={100} onPrev={noop} onNext={onNext} />)

    // Seleciona cartão
    fireEvent.click(screen.getByText(/cartão/i))

    const num = screen.getByPlaceholderText('0000 0000 0000 0000') as HTMLInputElement
    const nome = screen.getByLabelText(/nome impresso/i) as HTMLInputElement
    const validade = screen.getByPlaceholderText('07/28') as HTMLInputElement
    const cvv = screen.getByPlaceholderText('123') as HTMLInputElement

    // Preenche valores inválidos
    fireEvent.change(num, { target: { value: '4111 1111 111' } }) // 11 dígitos
    fireEvent.blur(num)
    fireEvent.change(nome, { target: { value: '' } })
    fireEvent.blur(nome)
    fireEvent.change(validade, { target: { value: '13/28' } }) // mês inválido
    fireEvent.blur(validade)
    fireEvent.change(cvv, { target: { value: '1' } })
    fireEvent.blur(cvv)

    const submit = screen.getByRole('button', { name: /revisar pedido/i })
    expect(submit).toBeDisabled()
    // Mensagens curtas exibidas (via role=alert para evitar colisão com labels)
    const alerts = screen.getAllByRole('alert')
    const texts = alerts.map((a) => a.textContent || '')
    expect(texts.some((t) => /número inválido/i.test(t))).toBe(true)
    expect(texts.some((t) => /obrigatório/i.test(t))).toBe(true)
    expect(texts.some((t) => /mm\/aa/i.test(t))).toBe(true)
    expect(texts.some((t) => /cvv/i.test(t))).toBe(true)
  })

  it('permite submit quando os campos são válidos', () => {
    const onNext = vi.fn()
    render(<PaymentForm total={100} onPrev={noop} onNext={onNext} />)

    // Seleciona cartão e preenche
    fireEvent.click(screen.getByText(/cartão/i))

    fireEvent.change(screen.getByPlaceholderText('0000 0000 0000 0000'), {
      target: { value: '4111 1111 1111 1111' },
    })
    fireEvent.change(screen.getByLabelText(/nome impresso/i), {
      target: { value: 'FULANO DE TAL' },
    })
    fireEvent.change(screen.getByPlaceholderText('07/28'), {
      target: { value: '07/28' },
    })
    fireEvent.change(screen.getByPlaceholderText('123'), {
      target: { value: '123' },
    })

    const submit = screen.getByRole('button', { name: /revisar pedido/i })
    expect(submit).not.toBeDisabled()
  })
})
