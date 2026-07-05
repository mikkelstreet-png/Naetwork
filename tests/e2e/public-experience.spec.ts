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
  await expect(page.getByRole('link', { name: /Se profiler|Browse profiles/i })).toBeVisible()
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
    expect(body).not.toMatch(/\b(?:Become a professional|Edit profile|Session brief|Best for|Account)\b/)
  }
})

test('protected member pages redirect to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login\?next=%2Fdashboard|\/login\?next=\/dashboard/)
  await expect(page.getByRole('heading', { name: /Fortsæt din karrieresparring/i })).toBeVisible()
})
