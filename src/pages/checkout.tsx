import { useState, useCallback } from 'react'
import Layout from '@/components/Layout'
import CheckoutSteps, { CheckoutStep } from '@/components/checkout/CheckoutSteps'
import IdentificationForm from '@/components/checkout/IdentificationForm'
import AddressForm from '@/components/checkout/AddressForm'
import PaymentForm from '@/components/checkout/PaymentForm'
import ReviewOrder from '@/components/checkout/ReviewOrder'
import { useCart } from '@/hooks/useCart'
import Head from 'next/head'
import { useRouter } from 'next/router'

// Mantém dados do fluxo de checkout em um único componente page-level para simplicidade (Single Responsibility: orquestrar o fluxo)
export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, subtotal, total, totalWithDiscount, savings, clearCart } = useCart()
  const [step, setStep] = useState<CheckoutStep>('identificacao')
  const [identificacao, setIdentificacao] = useState({ nome: '', email: '', cpf: '' })
  const [endereco, setEndereco] = useState({ cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' })
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [orderPlaced, setOrderPlaced] = useState(false)

  const go = useCallback((s: CheckoutStep) => setStep(s), [])

  const totals = { subtotal, total, totalWithDiscount, savings }

  const confirm = () => {
    // Simula confirmação de pedido (poderia chamar API). Mínimo de efeitos colaterais aqui.
    setOrderPlaced(true)
    clearCart()
    setTimeout(() => router.push('/'), 4000)
  }

  // Guarda de rota se carrinho vazio
  if (!orderPlaced && cartItems.length === 0) {
    return (
      <Layout>
        <Head><title>Checkout | DevWear</title></Head>
        <div className="max-w-xl mx-auto text-center py-20">
          <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
          <p className="text-slate-400">Seu carrinho está vazio. Adicione itens antes de continuar.</p>
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
          {!orderPlaced && <CheckoutSteps current={step} onChange={go} />}
        </div>

        {orderPlaced ? (
          <div className="card p-8 max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-xl font-semibold">Pedido Confirmado ✅</h2>
            <p className="text-slate-300 text-sm">Obrigado por comprar na DevWear. Você será redirecionado para a página inicial em instantes.</p>
            <button className="btn btn-primary" onClick={() => router.push('/')}>Ir para início agora</button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {step === 'identificacao' && (
                <IdentificationForm
                  value={identificacao}
                  onChange={setIdentificacao}
                  onNext={() => go('endereco')}
                />
              )}
              {step === 'endereco' && (
                <AddressForm
                  value={endereco}
                  onChange={setEndereco}
                  onPrev={() => go('identificacao')}
                  onNext={() => go('pagamento')}
                />
              )}
              {step === 'pagamento' && (
                <PaymentForm
                  total={total}
                  onPrev={() => go('endereco')}
                  onNext={(method) => { setPaymentMethod(method); go('revisao') }}
                />
              )}
              {step === 'revisao' && (
                <ReviewOrder
                  items={cartItems}
                  totals={totals}
                  identification={identificacao}
                  address={endereco}
                  paymentMethod={paymentMethod}
                  onPrev={() => go('pagamento')}
                  onConfirm={confirm}
                />
              )}
            </div>
            <aside className="h-max lg:sticky lg:top-20 card p-6 space-y-4">
              <h2 className="text-lg font-semibold">Resumo</h2>
              <ul className="space-y-1 text-sm text-slate-300">
                <li className="flex justify-between"><span>Itens</span><span>{cartItems.reduce((acc,i)=>acc+i.quantity,0)}</span></li>
                <li className="flex justify-between"><span>Subtotal</span><span>{(subtotal).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></li>
                <li className="flex justify-between"><span>Total a prazo</span><span>{(total).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></li>
                <li className="flex justify-between"><span>Total Pix</span><span className="text-lime-400">{(totalWithDiscount).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></li>
                <li className="flex justify-between text-xs text-slate-400"><span>Economia</span><span>{(savings).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</span></li>
              </ul>
              <p className="text-xs text-slate-500">Frete e descontos de cupom serão aplicados após cálculo.</p>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  )
}
