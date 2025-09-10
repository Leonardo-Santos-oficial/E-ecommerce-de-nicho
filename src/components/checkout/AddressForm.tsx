import React, { useState } from 'react'
import { maskCEP } from '@/utils/masks'
import { inputBase } from '@/components/form/styles'
import { AddressSchema, type AddressDTO } from '@/types/schemas'

interface Props {
  value: AddressDTO
  onChange: (value: AddressDTO) => void
  onPrev: () => void
  onNext: () => void
}

export default function AddressForm({ value, onChange, onPrev, onNext }: Props) {
  const update = (patch: Partial<AddressDTO>) => onChange({ ...value, ...patch })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const parsed = AddressSchema.safeParse(value)
  const issues = parsed.success ? [] : parsed.error.issues
  const errors = {
    cep: issues.find((i) => i.path[0] === 'cep')?.message || '',
    rua: issues.find((i) => i.path[0] === 'rua')?.message || '',
    numero: issues.find((i) => i.path[0] === 'numero')?.message || '',
    bairro: issues.find((i) => i.path[0] === 'bairro')?.message || '',
    cidade: issues.find((i) => i.path[0] === 'cidade')?.message || '',
    estado: issues.find((i) => i.path[0] === 'estado')?.message || '',
  }
  const ready = Object.values(errors).every((e) => e === '')

  return (
    <form
      aria-labelledby="etapa-endereco"
      className="card p-4 space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (ready) onNext()
      }}
    >
      <h2 id="etapa-endereco" className="text-lg font-semibold tracking-tight">
        Endereço de Entrega
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm sm:col-span-1 relative">
          <span>CEP</span>
          <input
            className={
              inputBase + (touched.cep && errors.cep ? ' border-red-500 focus:ring-red-500' : '')
            }
            value={value.cep}
            onChange={(e) => update({ cep: maskCEP(e.target.value) })}
            onBlur={() => setTouched((t) => ({ ...t, cep: true }))}
            placeholder="00000-000"
            required
            autoComplete="postal-code"
          />
          {value.cep && !errors.cep && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.cep && errors.cep && (
            <span className="text-xs text-red-400" role="alert">
              {errors.cep}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2 relative">
          <span>Rua</span>
          <input
            className={inputBase + (touched.rua && errors.rua ? ' border-red-500' : '')}
            value={value.rua}
            onChange={(e) => update({ rua: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, rua: true }))}
            required
            autoComplete="address-line1"
          />
          {value.rua && !errors.rua && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.rua && errors.rua && (
            <span className="text-xs text-red-400" role="alert">
              {errors.rua}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Número</span>
          <input
            className={inputBase + (touched.numero && errors.numero ? ' border-red-500' : '')}
            value={value.numero}
            onChange={(e) => update({ numero: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, numero: true }))}
            required
            autoComplete="address-line2"
          />
          {value.numero && !errors.numero && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.numero && errors.numero && (
            <span className="text-xs text-red-400" role="alert">
              {errors.numero}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Complemento</span>
          <input
            className={inputBase}
            value={value.complemento}
            onChange={(e) => update({ complemento: e.target.value })}
            autoComplete="additional-name"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Bairro</span>
          <input
            className={inputBase + (touched.bairro && errors.bairro ? ' border-red-500' : '')}
            value={value.bairro}
            onChange={(e) => update({ bairro: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, bairro: true }))}
            required
            autoComplete="address-level3"
          />
          {value.bairro && !errors.bairro && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.bairro && errors.bairro && (
            <span className="text-xs text-red-400" role="alert">
              {errors.bairro}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Cidade</span>
          <input
            className={inputBase + (touched.cidade && errors.cidade ? ' border-red-500' : '')}
            value={value.cidade}
            onChange={(e) => update({ cidade: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, cidade: true }))}
            required
            autoComplete="address-level2"
          />
          {value.cidade && !errors.cidade && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.cidade && errors.cidade && (
            <span className="text-xs text-red-400" role="alert">
              {errors.cidade}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1 text-sm relative">
          <span>Estado</span>
          <input
            className={inputBase + (touched.estado && errors.estado ? ' border-red-500' : '')}
            value={value.estado}
            onChange={(e) => update({ estado: e.target.value.toUpperCase().slice(0, 2) })}
            onBlur={() => setTouched((t) => ({ ...t, estado: true }))}
            required
            maxLength={2}
            autoComplete="address-level1"
          />
          {value.estado && !errors.estado && (
            <span className="absolute top-7 right-2 text-lime-400 text-xs">✔</span>
          )}
          {touched.estado && errors.estado && (
            <span className="text-xs text-red-400" role="alert">
              {errors.estado}
            </span>
          )}
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>
          Voltar
        </button>
        <button type="submit" className="btn btn-primary" disabled={!ready}>
          Continuar
        </button>
      </div>
    </form>
  )
}
