import { test, expect } from '@playwright/test'

test('checkout happy path with Pix', async ({ page }) => {
  await page.goto('/')
  // Adiciona primeiro produto
  const addButtons = page.getByRole('button', { name: /adicionar/i })
  await addButtons.first().click()

  await page.goto('/cart')
  await page.getByRole('link', { name: /finalizar compra|checkout/i }).click()

  // Identificação
  await page.getByLabel('Nome completo').fill('Fulano de Tal')
  await page.getByLabel('Email').fill('fulano@example.com')
  await page.getByLabel('CPF').fill('52998224725')
  await page.getByRole('button', { name: /continuar/i }).click()

  // Endereço
  await page.getByLabel('CEP').fill('12345678')
  await page.getByLabel('Rua').fill('Rua A')
  await page.getByLabel('Número').fill('100')
  await page.getByLabel('Bairro').fill('Centro')
  await page.getByLabel('Cidade').fill('São Paulo')
  await page.getByLabel('Estado').fill('SP')
  await page.getByRole('button', { name: /continuar/i }).click()

  // Pagamento: Pix (default)
  await page.getByRole('button', { name: /revisar pedido/i }).click()

  // Revisão
  await page.getByRole('button', { name: /confirmar pedido/i }).click()

  await expect(page.getByText(/pedido confirmado/i)).toBeVisible()
})
