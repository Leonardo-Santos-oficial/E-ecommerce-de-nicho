import { z } from 'zod'
import { validateCPF } from '@/utils/masks'
import { validateCardLuhn, validateExpiryNotPast } from '@/utils/masks'

export const PaymentMethodSchema = z.enum(['pix', 'cartao'])

export const IdentificationSchema = z.object({
  nome: z.string().min(3, 'Informe nome completo'),
  email: z.string().email('Email inválido'),
  // Aceita com ou sem máscara e valida dígitos verificadores
  cpf: z.string().refine((v) => validateCPF(v), 'CPF inválido'),
})

export const AddressSchema = z.object({
  cep: z.string().regex(/^(\d{5}-\d{3}|\d{8})$/, 'CEP inválido'),
  rua: z.string().min(1, 'Obrigatório'),
  numero: z.string().min(1, 'Obrigatório'),
  complemento: z.string().optional().default(''),
  bairro: z.string().min(1, 'Obrigatório'),
  cidade: z.string().min(1, 'Obrigatório'),
  estado: z.string().length(2, 'UF'),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  formattedPrice: z.string(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  category: z.string(),
})

export const ProductsArraySchema = z.array(ProductSchema)

// Raw product (as read from data/products.json) without formattedPrice
export const RawProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  images: z.array(z.string()).optional(),
  category: z.string(),
})

export const RawProductsArraySchema = z.array(RawProductSchema)

// Card data (client-side form validation only; do NOT store CVV)
export const CardSchema = z.object({
  numero: z.string().refine((v) => validateCardLuhn(v), { message: 'Número inválido' }),
  nome: z.string().min(1, 'Obrigatório'),
  validade: z.string().refine((v) => validateExpiryNotPast(v), { message: 'MM/AA' }),
  cvv: z.string().regex(/^\d{3,4}$/, 'CVV'),
})

export type CardDTO = z.infer<typeof CardSchema>

export type IdentificationDTO = z.infer<typeof IdentificationSchema>
export type AddressDTO = z.infer<typeof AddressSchema>
export type PaymentMethodDTO = z.infer<typeof PaymentMethodSchema>
