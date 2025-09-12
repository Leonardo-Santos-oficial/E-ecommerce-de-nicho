import { useCart } from '@/hooks/useCart'
import CartItemsList from '@/components/cart/CartItemsList'
import AdditionalServices from '@/components/cart/AdditionalServices'
import OrderSummary from '@/components/cart/OrderSummary'
import { useRouter } from 'next/router'

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    total,
    totalWithDiscount,
    savings,
    installment,
  } = useCart()
  const router = useRouter()

  return (
    <>
      <h1 className="mb-4 sm:mb-6">Carrinho</h1>
      {cartItems.length === 0 ? (
        <p className="text-white">Seu carrinho está vazio.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <CartItemsList
              items={cartItems}
              onClearCart={clearCart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
            <AdditionalServices />
          </div>
          <OrderSummary
            subtotal={subtotal}
            total={total}
            totalWithDiscount={totalWithDiscount}
            savings={savings}
            installment={installment}
            onContinue={() => {
              router.push('/checkout')
            }}
          />
        </div>
      )}
    </>
  )
}
