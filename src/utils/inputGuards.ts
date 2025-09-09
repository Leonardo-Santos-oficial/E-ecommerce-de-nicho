// Utilidades para controle de entrada numérica / colagem (Clean Code: funções pequenas e puras)
// Regras: apenas dígitos, permitir teclas de controle, sanitizar colagem, evitar duplicação

const controlKeys = new Set([
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'Tab',
  'Home',
  'End',
])

export function isControlKey(e: KeyboardEvent | React.KeyboardEvent) {
  return controlKeys.has(e.key) || e.ctrlKey || e.metaKey // permitir atalhos
}

export function handleDigitKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (isControlKey(e)) return
  if (!/\d/.test(e.key)) {
    e.preventDefault()
  }
}

export function sanitizeDigits(value: string) {
  return value.replace(/\D+/g, '')
}

export function handlePasteDigits(
  e: React.ClipboardEvent<HTMLInputElement>,
  apply: (digits: string) => void,
  maxLen?: number
) {
  e.preventDefault()
  const text = e.clipboardData.getData('text')
  let digits = sanitizeDigits(text)
  if (maxLen) digits = digits.slice(0, maxLen)
  apply(digits)
}
