import { useMemo } from 'react'
import { useCartContext } from '../context/CartContext'
import { computeInstallment } from '../utils/payments'

export const useCart = () => {
	const ctx = useCartContext()
	// Business rules (example): 5% off for Pix (à vista)
	const totals = useMemo(() => {
		const subtotal = ctx.subtotal
		const total = subtotal // a prazo (sem desconto)
		const totalWithDiscount = Math.max(0, Math.round(subtotal * 0.95 * 100) / 100)
		const savings = Math.max(0, Math.round((subtotal - totalWithDiscount) * 100) / 100)
		return { subtotal, total, totalWithDiscount, savings }
	}, [ctx.subtotal])

	return {
		...ctx,
		cartItems: ctx.items,
		clearCart: ctx.clear,
		...totals,
		installment: computeInstallment(totals.total, { maxInstallments: 10, minPerInstallment: 5 }),
	}
}
