// Branded primitive helper
export type Brand<T, B extends string> = T & { readonly __brand: B }

// Common branded primitives for the domain
export type MoneyBRL = Brand<number, 'MoneyBRL'>
export type CPF = Brand<string, 'CPF'>
export type CEP = Brand<string, 'CEP'>
export type Email = Brand<string, 'Email'>

// Helpers to apply brands after validation
export const brandMoneyBRL = (n: number) => n as MoneyBRL
export const brandCPF = (v: string) => v as CPF
export const brandCEP = (v: string) => v as CEP
export const brandEmail = (v: string) => v as Email
