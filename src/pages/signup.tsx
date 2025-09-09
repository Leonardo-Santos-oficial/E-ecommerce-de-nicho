import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { absoluteUrl } from '../utils/seo'
import { inputBase } from '@/components/form/styles'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accepted, setAccepted] = useState(false)

  const passwordChecks = useMemo(() => {
    const len = password.length >= 8
    const upper = /[A-Z]/.test(password)
    const lower = /[a-z]/.test(password)
    const number = /[0-9]/.test(password)
    const special = /[^A-Za-z0-9]/.test(password)
    return { len, upper, lower, number, special }
  }, [password])

  const passwordStrength = useMemo(() => {
    const count = Object.values(passwordChecks).filter(Boolean).length
    return count // 0..5
  }, [passwordChecks])

  const isPasswordValid = passwordStrength === 5
  const isMatch = password === confirm && password.length > 0
  const canSubmit = isPasswordValid && isMatch && accepted && !loading

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isPasswordValid) {
      setError('A senha não atende à política de segurança.')
      return
    }
    if (!isMatch) {
      setError('As senhas não conferem.')
      return
    }
    if (!accepted) {
      setError('Você precisa aceitar a Política de Privacidade e os Termos para continuar.')
      return
    }
    setLoading(true)
    try {
      // Placeholder de criação de conta
      await new Promise((res) => setTimeout(res, 700))
      alert('Cadastro simulado com sucesso. Integre com seu backend/provedor de autenticação.')
    } catch (err: any) {
      setError('Não foi possível criar a conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const title = 'Criar conta | DevWear'
  const description =
    'Crie sua conta para comprar mais rápido, acompanhar pedidos e receber novidades.'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl('/signup')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl('/signup')} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <div className="max-w-md mx-auto py-10 relative">
        <button
          type="button"
          aria-label="Fechar"
          title="Fechar"
          className="absolute right-0 top-0 inline-flex w-9 h-9 items-center justify-center rounded hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          onClick={() => {
            if (typeof window !== 'undefined' && window.history.length > 1) {
              router.back()
            } else {
              router.push('/')
            }
          }}
        >
          ✕
        </button>
        <h1 className="text-2xl font-semibold mb-6">Criar conta</h1>
        <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulário de cadastro">
          <div>
            <label htmlFor="name" className="block text-sm mb-1">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputBase}
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputBase}
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Senha
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
              placeholder="Crie uma senha"
              aria-describedby="password-help"
            />
            <div className="mt-2" aria-live="polite" id="password-help">
              <div className="h-2 w-full bg-slate-800 rounded">
                <div
                  className={`h-2 rounded ${passwordStrength <= 2 ? 'bg-red-500' : passwordStrength === 3 ? 'bg-yellow-500' : passwordStrength === 4 ? 'bg-lime-500' : 'bg-green-500'}`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <ul className="mt-2 space-y-1 text-xs">
                <li className={passwordChecks.len ? 'text-lime-400' : 'text-slate-400'}>
                  • Pelo menos 8 caracteres
                </li>
                <li className={passwordChecks.upper ? 'text-lime-400' : 'text-slate-400'}>
                  • Uma letra maiúscula (A–Z)
                </li>
                <li className={passwordChecks.lower ? 'text-lime-400' : 'text-slate-400'}>
                  • Uma letra minúscula (a–z)
                </li>
                <li className={passwordChecks.number ? 'text-lime-400' : 'text-slate-400'}>
                  • Um número (0–9)
                </li>
                <li className={passwordChecks.special ? 'text-lime-400' : 'text-slate-400'}>
                  • Um caractere especial (!@#$%…)
                </li>
              </ul>
            </div>
          </div>
          <div>
            <label htmlFor="confirm" className="block text-sm mb-1">
              Confirmar senha
            </label>
            <input
              id="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={inputBase}
              placeholder="Repita a senha"
            />
            {!isMatch && confirm.length > 0 && (
              <p className="text-xs text-red-400 mt-1" role="alert">
                As senhas não coincidem.
              </p>
            )}
          </div>
          <div className="flex items-start gap-2">
            <input
              id="accept"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="accept" className="text-sm text-slate-300">
              Li e concordo com a{' '}
              <Link
                className="text-cyan-400 hover:underline"
                href="/politicas/privacidade"
                target="_blank"
              >
                Política de Privacidade
              </Link>{' '}
              e com os{' '}
              <Link className="text-cyan-400 hover:underline" href="/termos-de-uso" target="_blank">
                Termos de Uso
              </Link>
              .
            </label>
          </div>
          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!canSubmit}
          >
            {loading ? 'Criando…' : 'Criar conta'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Já tem conta?{' '}
          <Link className="text-cyan-400 hover:underline" href="/login">
            Entrar
          </Link>
        </p>
      </div>
    </>
  )
}
