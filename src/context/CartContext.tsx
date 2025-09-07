import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { Product } from '../types/Product'

export type CartItem = Product & { quantity: number }

type CartState = {
  items: CartItem[]
}

const initialState: CartState = { items: [] }

type Action =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'HYDRATE'; payload: CartState }
  | { type: 'CLEAR' }

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload
    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (exists) {
        return {
          items: state.items.map(i => (i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i)),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter(i => i.id !== action.payload.id) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: Math.max(1, action.payload.quantity) } : i,
        ),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

function useLocalStorage(key: string, value: any) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])
}

const CartContext = createContext<{
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clear: () => void
} | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // hydrate from localStorage after mount to avoid hydration mismatches
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('cart-state') : null
      if (raw) {
        const parsed = JSON.parse(raw) as CartState
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      // ignore
    }
  }, [])

  useLocalStorage('cart-state', state)

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum: number, i: CartItem) => sum + i.price * i.quantity, 0)
    const totalItems = state.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0)
    return {
      items: state.items,
      subtotal,
      totalItems,
      addItem: (product: Product) => dispatch({ type: 'ADD_ITEM', payload: product }),
      removeItem: (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      updateQuantity: (id: string, quantity: number) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCartContext must be used within CartProvider')
  return ctx
}
