import { expect, test, type Page } from '@playwright/test'

const publicRoutes = [
  '/',
  '/professionals',
  '/match',
  '/impact',
  '/mission',
  '/contact',
  '/fields/ai',
  '/fields/banking',
  '/fields/consulting',
  '/fields/private-equity',
  '/professional/signup',
  '/login',
  '/signup',
  '/terms',
  '/privacy',
  '/cookies',
]

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(dimensions.content, `Horizontal overflow: ${dimensions.content}px > ${dimensions.viewport}px`).toBeLessThanOrEqual(dimensions.viewport + 1)
}

for (const route of publicRoutes) {
  test(`${route} renders without horizontal overflow`, async ({ page }) => {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), `${route} should return a successful document`).toBeLessThan(400)
    await expect(page.locator('#main-content')).toBeVisible()
    await expectNoHorizontalOverflow(page)
  })
}

test('mobile navigation exposes the primary journeys', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile navigation contract')
  await page.goto('/')
  await page.getByRole('button', { name: /åbn menu|open menu/i }).click()
  await expect(page.getByRole('navigation', { name: /primær navigation|primary navigation/i })).toContainText(/Priser|Pricing/)
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: /Find en professionel|Find a professional/i })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('profile filters remain usable on mobile and desktop', async ({ page, isMobile }) => {
  await page.goto('/professionals')
  await expect(page.getByRole('searchbox')).toBeVisible()
  if (isMobile) {
    await expect(page.getByRole('combobox', { name: /Vælg felt|Choose field/i })).toBeVisible()
  } else {
    await expect(page.getByRole('button', { name: 'Management Consulting' })).toBeVisible()
  }
  await expectNoHorizontalOverflow(page)
})

test('Danish public UI avoids mixed interface labels', async ({ page }) => {
  for (const route of ['/', '/professionals', '/impact', '/professional/signup']) {
    await page.goto(route)
    const body = await page.locator('body').innerText()
    expect(body).not.toMatch(/\b(?:Become a professional|Edit profile|Session brief|Best for|Account|Application Review|Career Direction|Professional profile)\b/)
  }
})

test('legal documents expose the launch disclosures', async ({ page }) => {
  const expectations = [
    ['/terms', ['Vilkår for brug', 'Fortrydelse og aflysning', 'Bidrag til Kræftens Bekæmpelse']],
    ['/privacy', ['Privatlivspolitik', 'Formål og behandlingsgrundlag', 'Opbevaring og sletning']],
    ['/cookies', ['Cookiepolitik', 'Aktuelle teknologier', 'Samtykke og fremtidige ændringer']],
  ] as const

  for (const [route, headings] of expectations) {
    await page.goto(route)
    for (const heading of headings) await expect(page.getByRole('heading', { name: heading })).toBeVisible()
    await expectNoHorizontalOverflow(page)
  }
})

test('core public actions remain clear', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /60 minutters sparring|60 minutes of guidance/i })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: /Find en professionel|Find a professional/i })).toBeVisible()
  await page.goto('/match')
  await expect(page.getByRole('heading', { name: /Hvad skal de 60 minutter løse|What should the 60 minutes solve/i })).toBeVisible()
})

test('protected member pages redirect to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard|\/login\?next=\/dashboard/)
  await expect(page.getByRole('heading', { name: /Fortsæt din karrieresparring/i })).toBeVisible()
})
