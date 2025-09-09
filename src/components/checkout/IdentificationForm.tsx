import React from 'react'
import { inputBase } from '@/components/form/styles'

interface Props {
  value: { nome: string; email: string; cpf: string }
  onChange: (value: Props['value']) => void
  onNext: () => void
}

export default function IdentificationForm({ value, onChange, onNext }: Props) {
  const update = (patch: Partial<Props['value']>) => onChange({ ...value, ...patch })
  const ready = value.nome && /.+@.+\..+/.test(value.email) && /^[0-9]{11}$/.test(value.cpf.replace(/\D/g, ''))
  return (
    <form
      aria-labelledby="etapa-identificacao"
      className="card p-4 space-y-6"
      onSubmit={(e) => { e.preventDefault(); if (ready) onNext() }}
    >
      <h2 id="etapa-identificacao" className="text-lg font-semibold tracking-tight">Identificação</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span>Nome completo</span>
          <input
            value={value.nome}
            onChange={e => update({ nome: e.target.value })}
            required
            className={inputBase}
            placeholder="Ex: João da Silva"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Email</span>
          <input
            type="email"
            value={value.email}
            onChange={e => update({ email: e.target.value })}
            required
            className={inputBase}
            placeholder="voce@exemplo.com"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span>CPF</span>
          <input
            inputMode="numeric"
            value={value.cpf}
            onChange={e => update({ cpf: e.target.value.replace(/\D/g, '') })}
            required
            className={inputBase}
            placeholder="Somente números"
            maxLength={11}
          />
        </label>
      </div>
      <div className="pt-2">
        <button type="submit" className="btn btn-primary" disabled={!ready}>Continuar</button>
      </div>
    </form>
  )
}
