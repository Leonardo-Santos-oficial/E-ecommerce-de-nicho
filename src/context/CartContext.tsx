import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { Product } from '../types/Product'

export type CartItem = Product & { quantity: number }

type CartState = {
  items: CartItem[]
  coupon?: {
    code: string
    percent: number
  } | null
}

const initialState: CartState = { items: [], coupon: null }

type Action =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'HYDRATE'; payload: CartState }
  | { type: 'CLEAR' }
  | { type: 'APPLY_COUPON'; payload: { code: string; percent: number } }
  | { type: 'CLEAR_COUPON' }

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload
    case 'ADD_ITEM': {
      const exists = state.items.find((i) => i.id === action.payload.id)
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.id !== action.payload.id) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i
        ),
      }
    case 'CLEAR':
      return { items: [], coupon: null }
    case 'APPLY_COUPON':
      return { ...state, coupon: { code: action.payload.code, percent: action.payload.percent } }
    case 'CLEAR_COUPON':
      return { ...state, coupon: null }
    default:
      return state
  }
}

// Persistência simples desacoplada de SSR; não usar condicionalmente o custom hook
function writeLocalStorage(key: string, value: any) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  } catch {
    /* noop */
  }
}

const CartContext = createContext<{
  items: CartItem[]
  totalItems: number
  subtotal: number
  coupon: CartState['coupon']
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
  applyCoupon: (code: string, percent: number) => void
  clearCoupon: () => void
} | null>(null)

export function CartProvider({
  children,
  initialItems,
}: {
  children: React.ReactNode
  initialItems?: CartItem[]
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialItems ? { items: initialItems } : initialState
  )

  // hydrate from localStorage after mount to avoid hydration mismatches
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart-state') : null
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      /* noop */
    }
  }, [])

  // Persistência fora de condições de hook: efeito sempre registrado, guarda interna controla execução
  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return
    writeLocalStorage('cart-state', state)
  }, [state])

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0)
    const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0)
    return {
      items: state.items,
      subtotal,
      totalItems,
      coupon: state.coupon,
      addItem: (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      updateQuantity: (id: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' }),
      applyCoupon: (code: string, percent: number) =>
        dispatch({ type: 'APPLY_COUPON', payload: { code, percent } }),
      clearCoupon: () => dispatch({ type: 'CLEAR_COUPON' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
