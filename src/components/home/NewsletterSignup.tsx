import { FormEvent, useState } from 'react'
import { inputBase } from '@/components/form/styles'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [ok, setOk] = useState<null | 'ok' | 'err'>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    // fake success for now
    if (/.+@.+\..+/.test(email)) {
      setOk('ok')
      setEmail('')
    } else {
      setOk('err')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col md:flex-row gap-3 md:items-center">
      <label htmlFor="nl" className="text-sm md:w-56">
        Receba ofertas por e-mail
      </label>
      <input
        id="nl"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className={`${inputBase} flex-1`}
        aria-invalid={ok === 'err'}
      />
      <button className="btn btn-primary" type="submit">
        Assinar
      </button>
      <div className="text-xs" role="status" aria-live="polite">
        {ok === 'ok' && <span className="text-emerald-400">Inscrito com sucesso.</span>}
        {ok === 'err' && <span className="text-rose-400">Digite um e-mail válido.</span>}
      </div>
    </form>
  )
}
