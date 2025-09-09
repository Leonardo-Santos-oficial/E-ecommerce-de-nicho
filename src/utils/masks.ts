// Utilidades de máscara e validação simples (Clean Code: funções puras e pequenas)
export const onlyDigits = (v: string) => v.replace(/\D/g, '')

export function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11)
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

export function validateCPF(v: string) {
  const d = onlyDigits(v)
  if (d.length !== 11) return false
  if (/^(\d)\1{10}$/.test(d)) return false // todos iguais
  const calcDigit = (len: number) => {
    let sum = 0
    for (let i = 0; i < len; i++) sum += parseInt(d[i], 10) * (len + 1 - i)
    const mod = (sum * 10) % 11
    return mod === 10 ? 0 : mod
  }
  const d1 = calcDigit(9)
  if (d1 !== parseInt(d[9], 10)) return false
  const d2 = calcDigit(10)
  if (d2 !== parseInt(d[10], 10)) return false
  return true
}

export function maskCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8)
  return d.replace(/(\d{5})(\d{1,3})$/, '$1-$2')
}

export function validateCEP(v: string) {
  return onlyDigits(v).length === 8
}

export function maskCardNumber(v: string) {
  const d = onlyDigits(v).slice(0, 16)
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

export function maskExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4)
  if (d.length <= 2) return d
  return d.slice(0, 2) + '/' + d.slice(2)
}

export function maskCVV(v: string) {
  return onlyDigits(v).slice(0, 4)
}

export function validateEmail(v: string) {
  return /.+@.+\..+/.test(v)
}
