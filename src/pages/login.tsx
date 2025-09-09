import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { absoluteUrl } from '../utils/seo'
import { useRouter } from 'next/router'
import { inputBase } from '@/components/form/styles'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      // Placeholder auth flow
      await new Promise((res) => setTimeout(res, 600))
      // No-op: integrate with real auth provider later
      alert('Login simulado com sucesso. Integre com seu provedor de autenticação.')
    } catch (err: any) {
      setError('Não foi possível entrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const title = 'Entrar | DevWear'
  const description =
    'Acesse sua conta para acompanhar pedidos e finalizar compras com mais rapidez.'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={absoluteUrl('/login')} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl('/login')} />
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
        <h1 className="mb-6">Entrar</h1>
        <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulário de login">
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputBase}
              placeholder="Sua senha"
            />
          </div>
          {error && (
            <p role="alert" className="text-red-400 text-sm">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-sm text-white text-center">ou</p>
          <Link
            className="btn btn-secondary w-full text-center"
            href="/signup"
            aria-label="Criar nova conta"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </>
  )
}
