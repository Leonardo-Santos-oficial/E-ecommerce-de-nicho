import React from 'react'
import { inputBase } from '@/components/form/styles'

interface Address {
  cep: string
  rua: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
}

interface Props {
  value: Address
  onChange: (value: Address) => void
  onPrev: () => void
  onNext: () => void
}

export default function AddressForm({ value, onChange, onPrev, onNext }: Props) {
  const update = (patch: Partial<Address>) => onChange({ ...value, ...patch })
  const ready = value.cep.length >= 8 && value.rua && value.numero && value.bairro && value.cidade && value.estado

  return (
  <form aria-labelledby="etapa-endereco" className="card p-4 space-y-6" onSubmit={(e) => { e.preventDefault(); if (ready) onNext() }}>
      <h2 id="etapa-endereco" className="text-lg font-semibold tracking-tight">Endereço de Entrega</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm sm:col-span-1">
          <span>CEP</span>
          <input
            className={inputBase}
            value={value.cep}
            onChange={e => update({ cep: e.target.value.replace(/\D/g, '').slice(0,8) })}
            placeholder="00000000"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span>Rua</span>
          <input className={inputBase} value={value.rua} onChange={e => update({ rua: e.target.value })} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Número</span>
          <input className={inputBase} value={value.numero} onChange={e => update({ numero: e.target.value })} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Complemento</span>
            <input className={inputBase} value={value.complemento} onChange={e => update({ complemento: e.target.value })} />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Bairro</span>
          <input className={inputBase} value={value.bairro} onChange={e => update({ bairro: e.target.value })} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Cidade</span>
          <input className={inputBase} value={value.cidade} onChange={e => update({ cidade: e.target.value })} required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span>Estado</span>
          <input className={inputBase} value={value.estado} onChange={e => update({ estado: e.target.value.toUpperCase().slice(0,2) })} required maxLength={2} />
        </label>
      </div>
      <div className="flex gap-2 pt-2">
        <button type="button" className="btn btn-secondary" onClick={onPrev}>Voltar</button>
        <button type="submit" className="btn btn-primary" disabled={!ready}>Continuar</button>
      </div>
    </form>
  )
}
