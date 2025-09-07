import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { absoluteUrl } from '../utils/seo'
import { useRouter } from 'next/router'

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
      await new Promise(res => setTimeout(res, 600))
      // No-op: integrate with real auth provider later
      alert('Login simulado com sucesso. Integre com seu provedor de autenticação.')
    } catch (err: any) {
      setError('Não foi possível entrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const title = 'Entrar | DevWear'
  const description = 'Acesse sua conta para acompanhar pedidos e finalizar compras com mais rapidez.'

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
        <h1 className="text-2xl font-semibold mb-6">Entrar</h1>
        <form onSubmit={onSubmit} className="space-y-4" aria-label="Formulário de login">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="voce@exemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Sua senha"
            />
          </div>
          {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="btn w-full disabled:opacity-60 disabled:cursor-not-allowed" disabled={loading}>
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Novo por aqui?{' '}
          <Link className="text-cyan-400 hover:underline" href="/signup">Crie sua conta</Link>
        </p>
      </div>
    </>
  )
}
