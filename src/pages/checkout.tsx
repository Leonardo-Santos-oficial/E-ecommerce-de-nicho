import { useState, useCallback, useEffect } from 'react'
import CheckoutSteps, { CheckoutStep } from '@/components/checkout/CheckoutSteps'
import IdentificationForm from '@/components/checkout/IdentificationForm'
import AddressForm from '@/components/checkout/AddressForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import ReviewOrder from '@/components/checkout/ReviewOrder'
import { useCart } from '@/hooks/useCart'
import Head from 'next/head'
import { useRouter } from 'next/router'
import type { PaymentMethod, Identification, Address, OrderTotals } from '@/types/domain'
import { IdentificationSchema, AddressSchema, PaymentMethodSchema } from '@/types/schemas'
import { toDomainIdentification, toDomainAddress } from '@/types/mappers'

// Mantém dados do fluxo de checkout em um único componente page-level para simplicidade (Single Responsibility: orquestrar o fluxo)
export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, total, totalWithDiscount, savings, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>('identificacao')
  const [identificacao, setIdentificacao] = useState<Identification>({
    nome: '',
    email: '',
    cpf: '',
  })
  const [endereco, setEndereco] = useState<Address>({
    cep: '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('')
  const [guardMessage, setGuardMessage] = useState('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const go = useCallback((s: CheckoutStep) => setStep(s), [])

  const totals: OrderTotals = { subtotal, total, totalWithDiscount, savings }

  // Funções de validação replicando regras dos formulários (evita aceitar revisão direta sem preencher)
  const isIdentificationValid = useCallback(() => {
    return IdentificationSchema.safeParse(identificacao).success
  }, [identificacao])
  const isAddressValid = useCallback(() => {
    return AddressSchema.safeParse(endereco).success
  }, [endereco])
  const isPaymentValid = useCallback(
    (override?: string) => {
      const method = override ?? paymentMethod
      return PaymentMethodSchema.safeParse(method).success
    },
    [paymentMethod]
  )

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

  // Limpa mensagem assim que todos os blocos ficam válidos (deps apenas de estado)
  useEffect(() => {
    const allValid = isIdentificationValid() && isAddressValid() && isPaymentValid()
    if (allValid && guardMessage) setGuardMessage('')
  }, [isIdentificationValid, isAddressValid, isPaymentValid, guardMessage])

  const handleStepChange = (next: CheckoutStep, upcomingPaymentMethod?: PaymentMethod) => {
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
    // Ao avançar para a próxima etapa com blocos válidos, converte para tipos de domínio brandeds
    if (next === 'endereco') {
      const parsed = IdentificationSchema.safeParse(identificacao)
      if (parsed.success) setIdentificacao(toDomainIdentification(parsed.data))
    }
    if (next === 'pagamento') {
      const parsed = AddressSchema.safeParse(endereco)
      if (parsed.success) setEndereco(toDomainAddress(parsed.data))
    }
    if (upcomingPaymentMethod) {
      // Só atualiza se mudou
      setPaymentMethod(upcomingPaymentMethod)
    }
    setStep(next)
  }

  // Guarda de rota se carrinho vazio
  if (!orderPlaced && cartItems.length === 0) {
    return (
      <>
        <Head>
          <title>Checkout | DevWear</title>
        </Head>
        <div className="max-w-xl mx-auto text-center py-20">
          <h1 className="mb-4">Checkout</h1>
          <p className="text-white">Seu carrinho está vazio. Adicione itens antes de continuar.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Checkout | DevWear</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1>Checkout</h1>
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
            <h2>Pedido Confirmado ✅</h2>
            <p className="text-white text-sm">
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
              <ul className="space-y-1 text-sm text-white">
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
                <li className="flex justify-between text-xs text-white">
                  <span>Economia</span>
                  <span>
                    {savings.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              </ul>
              <p className="text-xs text-white">
                Frete e descontos de cupom serão aplicados após cálculo.
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}
