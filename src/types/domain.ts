import type { CEP, CPF, Email, MoneyBRL } from './brands'

export type PaymentMethod = 'pix' | 'cartao'

export type Identification = {
  nome: string
  email: Email | string
  cpf: CPF | string
}

export type Address = {
  cep: CEP | string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string // UF
}

export type OrderTotals = {
  subtotal: MoneyBRL | number
  total: MoneyBRL | number
  totalWithDiscount: MoneyBRL | number
  savings: MoneyBRL | number
}
