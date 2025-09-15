import React, { useState, useId, useRef } from 'react'
import { inputBase } from '@/components/form/styles'
import { maskCPF, validateCPF } from '@/utils/masks'
import { IdentificationSchema, type IdentificationDTO } from '@/types/schemas'
import { handleDigitKeyDown, handlePasteDigits } from '@/utils/inputGuards'

interface Props {
  value: IdentificationDTO
  onChange: (value: IdentificationDTO) => void
  onNext: () => void
}

export default function IdentificationForm({ value, onChange, onNext }: Props) {
  const update = (patch: Partial<Props['value']>) => onChange({ ...value, ...patch })
  const [touched, setTouched] = useState<{ nome?: boolean; email?: boolean; cpf?: boolean }>({})
  const parsed = IdentificationSchema.safeParse(value)
  const issues = parsed.success ? [] : parsed.error.issues
  const errors = {
    nome: issues.find((i) => i.path[0] === 'nome')?.message || '',
    email: issues.find((i) => i.path[0] === 'email')?.message || '',
    cpf: issues.find((i) => i.path[0] === 'cpf')?.message || '',
  }
  const ready = Object.values(errors).every((e) => e === '')
  const descId = useId()
  const emailRef = useRef<HTMLInputElement | null>(null)
  const cpfRef = useRef<HTMLInputElement | null>(null)
  // Auto-avança para email ao completar CPF válido
  if (
    cpfRef.current &&
    emailRef.current &&
    validateCPF(value.cpf) &&
    document.activeElement === cpfRef.current
  ) {
    emailRef.current.focus()
  }
  return (
    <form
      aria-labelledby="etapa-identificacao"
      className="card p-4 space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onNext()
      }}
    >
      <h2 id="etapa-identificacao" className="text-lg font-semibold tracking-tight">
        Identificação
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Nome completo</span>
          <input
            value={value.nome}
            onChange={(e) => update({ nome: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
            required
            className={inputBase}
            placeholder="Ex: João da Silva"
            autoComplete="name"
          />
          {value.nome && !errors.nome && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs" aria-label="Válido">
              ✔
            </span>
          )}
          {touched.nome && errors.nome && (
            <span className="text-xs text-red-400" role="alert">
              {errors.nome}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Email</span>
          <input
            type="email"
            value={value.email}
            onChange={(e) => update({ email: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            required
            className={inputBase}
            placeholder="voce@exemplo.com"
            autoComplete="email"
            ref={emailRef}
          />
          {value.email && !errors.email && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs" aria-label="Válido">
              ✔
            </span>
          )}
          {touched.email && errors.email && (
            <span className="text-xs text-red-400" role="alert">
              {errors.email}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2 relative">
          <span>CPF</span>
          <input
            inputMode="numeric"
            value={value.cpf}
            onChange={(e) => update({ cpf: maskCPF(e.target.value) })}
            onBlur={() => setTouched((t) => ({ ...t, cpf: true }))}
            onKeyDown={handleDigitKeyDown}
            onPaste={(e) => handlePasteDigits(e, (digits) => update({ cpf: maskCPF(digits) }), 11)}
            required
            className={inputBase}
            placeholder="Somente números"
            autoComplete="off"
            aria-describedby={touched.cpf && errors.cpf ? 'erro-cpf' : undefined}
            ref={cpfRef}
          />
          {touched.cpf && errors.cpf && (
            <span id="erro-cpf" className="text-xs text-red-400" role="alert">
              {errors.cpf}
            </span>
          )}
          {value.cpf && !errors.cpf && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs" aria-label="Válido">
              ✔
            </span>
          )}
        </label>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          aria-describedby={descId}
          className="btn btn-primary disabled:opacity-60"
          disabled={!ready}
        >
          Continuar
        </button>
        <p id={descId} className="sr-only">
          Avança para a próxima etapa do checkout
        </p>
      </div>
    </form>
  )
}
