export type InstallmentPlan = {
  installments: number
  amount: number
}

/**
 * Compute an installment plan constrained by maximum number of installments and minimum amount per installment.
 * Keeps it pure and easily testable (SRP). Rounds to 2 decimals for display.
 */
export function computeInstallment(total: number, options?: { maxInstallments?: number; minPerInstallment?: number }): InstallmentPlan {
  const max = Math.max(1, options?.maxInstallments ?? 10)
  const minAmt = Math.max(1, options?.minPerInstallment ?? 5)
  if (total <= 0) return { installments: 1, amount: 0 }

  let best = 1
  for (let i = 1; i <= max; i++) {
    const per = total / i
    if (per >= minAmt) best = i
    else break
  }
  const amount = Math.round((total / best) * 100) / 100
  return { installments: best, amount }
}
// Compute the best installment plan given a total amount
// Rules (simple): up to 10x, minimum R$10 per installment, no interest
export function computeBestInstallment(total: number) {
  const maxInstallments = 10
  const minPerInstallment = 10
  if (total <= 0 || !isFinite(total)) return { installments: 1, amount: 0 }
  const byMinValue = Math.floor(total / minPerInstallment)
  const installments = Math.max(1, Math.min(maxInstallments, byMinValue))
  const amount = Math.round((total / installments) * 100) / 100
  return { installments, amount }
}
