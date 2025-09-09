import { useState, useCallback, useEffect } from 'react'
import Layout from '@/components/Layout'
import CheckoutSteps, { CheckoutStep } from '@/components/checkout/CheckoutSteps'
import IdentificationForm from '@/components/checkout/IdentificationForm'
import AddressForm from '@/components/checkout/AddressForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import ReviewOrder from '@/components/checkout/ReviewOrder'
import { useCart } from '@/hooks/useCart'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { validateCPF, validateEmail, validateCEP } from '@/utils/masks'

// Mantém dados do fluxo de checkout em um único componente page-level para simplicidade (Single Responsibility: orquestrar o fluxo)
export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, total, totalWithDiscount, savings, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>('identificacao')
  const [identificacao, setIdentificacao] = useState({ nome: '', email: '', cpf: '' })
  const [endereco, setEndereco] = useState({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [guardMessage, setGuardMessage] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const go = useCallback((s: CheckoutStep) => setStep(s), [])

  const totals = { subtotal, total, totalWithDiscount, savings }

  // Funções de validação replicando regras dos formulários (evita aceitar revisão direta sem preencher)
  const isIdentificationValid = () => {
    return (
      identificacao.nome.trim().length >= 3 &&
      !!identificacao.email &&
      validateEmail(identificacao.email) &&
      !!identificacao.cpf &&
      validateCPF(identificacao.cpf)
    )
  }
  const isAddressValid = () => {
    return (
      validateCEP(endereco.cep) &&
      !!endereco.rua &&
      !!endereco.numero &&
      !!endereco.bairro &&
      !!endereco.cidade &&
      endereco.estado.length === 2
    )
  }
  const isPaymentValid = (override?: string) => {
    const method = override ?? paymentMethod
    return method === 'pix' || method === 'cartao'
  }

  const firstInvalidStep = (): CheckoutStep | null => {
    if (!isIdentificationValid()) return 'identificacao'
    if (!isAddressValid()) return 'endereco'
    if (!isPaymentValid()) return 'pagamento'
    return null
  }

  const confirm = () => {
    const invalid = firstInvalidStep()
    if (invalid) {
      setGuardMessage('Preencha todos os campos obrigatórios antes de confirmar o pedido.')
      setStep(invalid)
      return
    }
    setGuardMessage('')
    setOrderPlaced(true)
    clearCart()
    setTimeout(() => router.push('/'), 4000)
  }

  // Limpa mensagem assim que todos os blocos ficam válidos
  useEffect(() => {
    if (!firstInvalidStep() && guardMessage) {
      setGuardMessage('')
    }
  }, [identificacao, endereco, paymentMethod])

  const handleStepChange = (next: CheckoutStep, upcomingPaymentMethod?: string) => {
    // Bloqueia pular etapas sem completar anteriores
    if (next === step) return
    const order: CheckoutStep[] = ['identificacao', 'endereco', 'pagamento', 'revisao']
    const targetIndex = order.indexOf(next)
    // Verifica cada etapa anterior
    for (let i = 0; i < targetIndex; i++) {
      const s = order[i]
      if (s === 'identificacao' && !isIdentificationValid()) {
        setGuardMessage('Complete a identificação antes de avançar.')
        setStep('identificacao')
        return
      }
      if (s === 'endereco' && !isAddressValid()) {
        setGuardMessage('Complete o endereço antes de avançar.')
        setStep('endereco')
        return
      }
      if (s === 'pagamento' && !isPaymentValid(upcomingPaymentMethod)) {
        setGuardMessage('Selecione o método de pagamento antes de revisar.')
        setStep('pagamento')
        return
      }
    }
    setGuardMessage('')
    if (upcomingPaymentMethod) {
      // Só atualiza se mudou
      setPaymentMethod(upcomingPaymentMethod)
    }
    setStep(next)
  }

  // Guarda de rota se carrinho vazio
  if (!orderPlaced && cartItems.length === 0) {
    return (
      <Layout>
        <Head>
          <title>Checkout | DevWear</title>
        </Head>
        <div className="max-w-xl mx-auto text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
          <p className="text-slate-400">
            Seu carrinho está vazio. Adicione itens antes de continuar.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Checkout | DevWear</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Checkout</h1>
          {!orderPlaced && <CheckoutSteps current={step} onChange={handleStepChange} />}
        </div>
        {guardMessage && (
          <div
            role="alert"
            aria-live="assertive"
            className="border border-red-500/40 bg-red-900/20 text-red-300 text-sm px-4 py-2 rounded"
          >
            {guardMessage}
          </div>
        )}

        {orderPlaced ? (
          <div className="card p-8 max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-xl font-semibold">Pedido Confirmado ✅</h2>
            <p className="text-slate-300 text-sm">
              Obrigado por comprar na DevWear. Você será redirecionado para a página inicial em
              instantes.
            </p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>
              Ir para início agora
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {step === 'identificacao' && (
                <IdentificationForm
                  value={identificacao}
                  onChange={(v) => {
                    setIdentificacao(v)
                  }}
                  onNext={() => handleStepChange('endereco')}
                />
              )}
              {step === 'endereco' && (
                <AddressForm
                  value={endereco}
                  onChange={(v) => {
                    setEndereco(v)
                  }}
                  onPrev={() => handleStepChange('identificacao')}
                  onNext={() => handleStepChange('pagamento')}
                />
              )}
              {step === 'pagamento' && (
                <PaymentForm
                  total={total}
                  onPrev={() => handleStepChange('endereco')}
                  onNext={(method) => {
                    // Passa método para validação antecipada garantindo avanço em um clique
                    handleStepChange('revisao', method)
                  }}
                />
              )}
              {step === 'revisao' && (
                <ReviewOrder
                  items={cartItems}
                  totals={totals}
                  identification={identificacao}
                  address={endereco}
                  paymentMethod={paymentMethod}
                  onPrev={() => handleStepChange('pagamento')}
                  onConfirm={confirm}
                />
              )}
            </div>
            <aside className="h-max lg:sticky lg:top-20 card p-6 space-y-4">
              <h2 className="text-lg font-semibold">Resumo</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex justify-between">
                  <span>Itens</span>
                  <span>{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>
                </li>
                <li className="flex justify-between">
                  <span>Subtotal</span>
                  <span>
                    {subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total a prazo</span>
                  <span>
                    {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Total Pix</span>
                  <span className="text-lime-400">
                    {totalWithDiscount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </span>
                </li>
                <li className="flex justify-between text-xs text-slate-400">
                  <span>Economia</span>
                  <span>
                    {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              </ul>
              <p className="text-xs text-slate-500">
                Frete e descontos de cupom serão aplicados após cálculo.
              </p>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  )
}
