import { describe, expect, it } from 'vitest'
import {
  IdentificationSchema,
  AddressSchema,
  PaymentMethodSchema,
  ProductSchema,
} from '@/types/schemas'

describe('Schemas validation', () => {
  it('IdentificationSchema: accepts valid data (happy path)', () => {
    const ok = IdentificationSchema.safeParse({
      nome: 'João da Silva',
      email: 'joao@example.com',
      cpf: '123.456.789-09',
    })
    expect(ok.success).toBe(true)
  })

  it('IdentificationSchema: rejects invalid email and cpf (including masked but invalid)', () => {
    const bad = IdentificationSchema.safeParse({
      nome: 'João',
      email: 'invalido',
      cpf: '123.456.789-10', // formato ok, dígitos inválidos
    })
    expect(bad.success).toBe(false)
  })

  it('IdentificationSchema: accepts valid CPF masked and unmasked', () => {
    const masked = IdentificationSchema.safeParse({
      nome: 'João da Silva',
      email: 'joao@example.com',
      cpf: '529.982.247-25',
    })
    const unmasked = IdentificationSchema.safeParse({
      nome: 'João da Silva',
      email: 'joao@example.com',
      cpf: '52998224725',
    })
    expect(masked.success).toBe(true)
    expect(unmasked.success).toBe(true)
  })

  it('AddressSchema: accepts a valid address', () => {
    const ok = AddressSchema.safeParse({
      cep: '12345-678',
      rua: 'Rua A',
      numero: '100',
      complemento: '',
      bairro: 'Centro',
      cidade: 'SP City',
      estado: 'SP',
    })
    expect(ok.success).toBe(true)
  })

  it('AddressSchema: rejects invalid CEP and UF', () => {
    const bad = AddressSchema.safeParse({
      cep: '1234',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: 'S',
    })
    expect(bad.success).toBe(false)
  })

  it('PaymentMethodSchema: only allows supported methods', () => {
    expect(PaymentMethodSchema.safeParse('pix').success).toBe(true)
    expect(PaymentMethodSchema.safeParse('cartao').success).toBe(true)
    expect(PaymentMethodSchema.safeParse('boleto').success).toBe(false)
  })

  it('ProductSchema: accepts a mapped product with formattedPrice', () => {
    const ok = ProductSchema.safeParse({
      id: 'p1',
      slug: 'produto-1',
      name: 'Produto 1',
      description: 'Desc',
      price: 10,
      formattedPrice: 'R$ 10,00',
      image: '/placeholder.svg',
      imageAlt: 'alt',
      category: 'geral',
    })
    expect(ok.success).toBe(true)
  })
})
