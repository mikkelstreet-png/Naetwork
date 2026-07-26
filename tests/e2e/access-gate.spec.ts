import { expect, test } from '@playwright/test'

const runAccessGateFlow = process.env.RUN_ACCESS_GATE_E2E === '1'
const accessCode = process.env.SITE_ACCESS_CODE

test.skip(
  !runAccessGateFlow || !accessCode,
  'Set RUN_ACCESS_GATE_E2E=1 and SITE_ACCESS_CODE to verify the private access gate.',
)

test('the existing access gate rejects the wrong code and unlocks the requested page', async ({ page }) => {
  await page.goto('/sessions')
  await expect(page).toHaveURL(/\/adgang\?next=%2Fsessions/)
  await expect(page.getByRole('heading', { name: 'Adgang til Naetwork.' })).toBeVisible()

  await page.getByLabel('Adgangskode').fill('forkert-kode')
  await page.getByRole('button', { name: 'Åbn Naetwork' }).click()
  await expect(page).toHaveURL((url) => (
    url.pathname === '/adgang'
    && url.searchParams.get('next') === '/sessions'
    && url.searchParams.get('error') === 'invalid'
  ))
  await expect(page.getByText('Koden er ikke korrekt. Prøv igen.')).toBeVisible()

  await page.getByLabel('Adgangskode').fill(accessCode!)
  await page.getByRole('button', { name: 'Åbn Naetwork' }).click()
  await expect(page).toHaveURL(/\/sessions$/)
  await expect(page.locator('#main-content')).toBeVisible()

  await page.reload()
  await expect(page).toHaveURL(/\/sessions$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
