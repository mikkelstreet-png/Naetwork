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
  '/forgot-password',
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
    await expect(page.locator('#main-content main')).toHaveCount(1)
    await expect(page.locator('#main-content h1')).toHaveCount(1)
    await expectNoHorizontalOverflow(page)
  })
}

test('responsive navigation exposes the primary journeys', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, 'Compact navigation contract')
  await page.goto('/')
  await page.getByRole('button', { name: /åbn menu|open menu/i }).click()
  await expect(page.getByRole('button', { name: /luk menu|close menu/i })).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: /primær navigation|primary navigation/i })).toContainText(/Priser|Pricing/)
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: /Book 60 min|Find en professionel|Find a professional/i })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('profile filters remain usable on mobile and desktop', async ({ page, isMobile }) => {
  await page.goto('/professionals')
  const serviceError = page.getByRole('alert')
  if (await serviceError.count()) {
    await expect(page.getByRole('searchbox')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Prøv igen|Try again/i })).toBeVisible()
  } else {
    await expect(page.getByRole('searchbox')).toBeVisible()
    if (isMobile) {
      await expect(page.getByRole('combobox', { name: /Vælg felt|Choose field/i })).toBeVisible()
    } else {
      await expect(page.getByRole('button', { name: 'Management Consulting' })).toBeVisible()
    }
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
  await expect(page.getByRole('heading', { name: /Karrieresparring fra den side af bordet|Career guidance from the side of the table/i })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: /Find den rette professionelle|Find the right professional/i })).toBeVisible()
  await expect(page.locator('#pricing')).toContainText('DKK 600')
  await expect(page.locator('#pricing')).toContainText('DKK 1.800')
  await expect(page.locator('#pricing')).toContainText('DKK 192')
  await expect(page.locator('#pricing')).toContainText(/ekskl\. moms|excl\. VAT/i)
  await expect(page.getByRole('heading', { name: /Klare svar|Clear answers/i })).toBeVisible()
  await page.goto('/match')
  await expect(page.getByRole('heading', { name: /Find den rigtige erfaring på to valg|Find the right experience in two choices/i })).toBeVisible()
})

test('critical public routes expose specific metadata', async ({ page }) => {
  for (const [route, title] of [
    ['/professionals', 'Find en professionel'],
    ['/match', 'Find dit fokus'],
    ['/contact', 'Kontakt'],
    ['/professional/signup', 'Bliv professionel'],
  ] as const) {
    await page.goto(route)
    await expect(page).toHaveTitle(new RegExp(title, 'i'))
  }
})

test('homepage publishes complete brand and offer metadata', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/manifest.webmanifest')

  const structuredData = await page.locator('script[type="application/ld+json"]').textContent()
  expect(structuredData).toBeTruthy()
  const service = JSON.parse(structuredData ?? '{}')
  expect(service['@type']).toBe('Service')
  expect(service.hasOfferCatalog.itemListElement.map((offer: { price: number }) => offer.price)).toEqual([600, 900, 1200, 1800])
})

test('account creation distinguishes terms acceptance from privacy notice', async ({ page }) => {
  await page.goto('/signup')
  const notice = page.getByText(/Jeg accepterer Naetworks vilkår og bekræfter/i)
  await expect(notice).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/accepterer Naetworks vilkår og privatlivspolitik/i)
})

test('legal documents expose the current policy date', async ({ page }) => {
  for (const route of ['/terms', '/privacy', '/cookies']) {
    await page.goto(route)
    await expect(page.getByText('Senest opdateret 12. juli 2026', { exact: true })).toBeVisible()
  }
})

test('professional application keeps pricing and review expectations concrete', async ({ page }) => {
  await page.goto('/professional/signup')
  await page.getByLabel('Fulde navn').fill('Test Professionel')
  await page.getByLabel('E-mail').fill('professionel@example.com')
  await page.getByLabel('Adgangskode').fill('test-password-123')
  await page.getByLabel('Jobtitel').fill('Senior Manager')
  await page.getByLabel('Virksomhed').fill('Testvirksomhed')
  await page.getByLabel('Industri').selectOption('Management Consulting')
  await page.getByLabel('LinkedIn').fill('https://linkedin.com/in/test-professionel')
  await page.getByRole('button', { name: 'Næste' }).click()

  await page.getByRole('button', { name: 'CV og LinkedIn' }).click()
  for (const amount of ['DKK 600', 'DKK 900', 'DKK 1.200', 'DKK 1.800']) {
    await expect(page.getByRole('button', { name: amount })).toBeVisible()
  }
  await page.getByRole('button', { name: 'DKK 600' }).click()
  await page.getByRole('button', { name: 'Næste' }).click()
  for (const percentage of ['40%', '60%', '80%', '90%']) {
    await expect(page.getByRole('button', { name: percentage })).toBeVisible()
  }
  await page.getByRole('button', { name: '80%' }).click()
  await expect(page.getByText(/Procenten beregnes af prisen ekskl\. moms/i)).toBeVisible()
  await expect(page.getByText('DKK 384', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Næste' }).click()
  await expect(page.getByText(/accepterer Naetworks vilkår og bekræfter/i)).toBeVisible()
})

test('security contact is published in the standard location', async ({ page }) => {
  const response = await page.goto('/.well-known/security.txt')
  expect(response?.status()).toBe(200)
  await expect(page.locator('body')).toContainText('Contact: mailto:kontakt@naetwork.dk')
})

test('contact flow explains privacy without claiming consent', async ({ page }) => {
  await page.goto('/contact')
  await expect(page.getByRole('link', { name: /privatlivspolitikken|privacy policy/i })).toBeVisible()
  await expect(page.locator('body')).not.toContainText('Ved at sende formularen accepterer du')
})

test('focused account pages omit the marketing footer', async ({ page }) => {
  for (const route of ['/login', '/signup', '/forgot-password']) {
    await page.goto(route)
    await expect(page.locator('footer')).toHaveCount(0)
  }
})

test('protected member pages redirect to login', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/login\?(?:next=(?:%2F|\/)dashboard|error=service_unavailable)/)
  await expect(page.getByRole('heading', { name: /Fortsæt din karrieresparring/i })).toBeVisible()
  if (page.url().includes('service_unavailable')) {
    await expect(page.getByText('Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.', { exact: true })).toBeVisible()
  }
})
