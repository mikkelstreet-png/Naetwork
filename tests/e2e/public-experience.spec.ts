import { expect, test, type Page } from '@playwright/test'

const publicRoutes = [
  '/',
  '/start',
  '/how-it-works',
  '/sessions',
  '/explore',
  '/prepare',
  '/apply',
  '/perform',
  '/professionals',
  '/impact',
  '/mission',
  '/contact',
  '/fields/consulting',
  '/fields/finance',
  '/fields/legal',
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
  await expect(page.getByRole('navigation', { name: /primær navigation|primary navigation/i })).toContainText(/Find erfaring|Find experience/)
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: /Find den erfaring, du mangler|Find the experience you need/i })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('profile filters remain usable on mobile and desktop', async ({ page, isMobile }) => {
  await page.goto('/professionals')
  const searchbox = page.getByRole('searchbox')
  const retryButton = page.getByRole('button', { name: /Prøv igen|Try again/i })
  await expect(searchbox.or(retryButton)).toBeVisible()

  if (await retryButton.isVisible()) {
    await expect(page.getByRole('searchbox')).toHaveCount(0)
    await expect(retryButton).toBeVisible()
  } else {
    await expect(searchbox).toBeVisible()
    await expect(page.getByRole('combobox', { name: /Fagområde|Professional area/i })).toBeVisible()
    await expect(page.getByRole('combobox', { name: /Hvad vil du have hjælp til|What do you need help with/i })).toBeVisible()
    if (isMobile) await expect(page.getByRole('button', { name: /Nulstil filtre|Clear filters/i })).toBeVisible()
  }
  await expectNoHorizontalOverflow(page)
})

test('homepage only shows selected professionals and directory does not book directly', async ({ page }) => {
  await page.goto('/')
  expect(await page.locator('.access-professional-card').count()).toBeLessThanOrEqual(3)
  await expect(page.locator('.access-professional-card').getByRole('button', { name: /Book/i })).toHaveCount(0)
  await page.goto('/professionals')
  await expect(page.getByRole('button', { name: /Book session|Book sessionen/i })).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test('Danish public UI avoids mixed interface labels', async ({ page }) => {
  for (const route of ['/', '/start', '/how-it-works', '/professionals', '/impact', '/professional/signup']) {
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
  await expect(page.getByRole('heading', { name: /Få adgang til det, andre får gennem deres netværk\.|Access what others get through their network\./i })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: /Find den erfaring, du mangler|Find the experience you need/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /De vigtigste karrieresvar står ikke i jobopslaget|The most important career answers are not in the job post/i })).toBeVisible()
  await expect(page.getByText(/Potentiale er overalt\. Adgang er det ikke\.|Potential is everywhere\. Access is not\./i)).toBeVisible()
  await expect(page.getByRole('heading', { name: /Hvad står du overfor|What are you facing/i })).toBeVisible()
  for (const amount of ['DKK 600', 'DKK 1.800', 'DKK 60', 'DKK 180']) await expect(page.getByText(amount, { exact: true }).first()).toBeVisible()
  await page.goto('/start')
  await expect(page.getByRole('heading', { name: /Hvad skal være bedre om 60 minutter|What should be better in 60 minutes/i })).toBeVisible()
})

test('category structure is consistent across the public journey', async ({ page }) => {
  await page.goto('/')
  for (const category of ['Consulting', 'Finance', 'Legal']) {
    await expect(page.getByRole('link', { name: new RegExp(category) }).first()).toBeVisible()
  }
  await page.goto('/sessions')
  for (const category of ['Consulting', 'Finance', 'Legal']) {
    await expect(page.getByRole('link', { name: new RegExp(category) }).first()).toBeVisible()
  }

  for (const [legacy, current] of [['ai', 'consulting'], ['banking', 'finance'], ['private-equity', 'finance']] as const) {
    await page.goto(`/fields/${legacy}`)
    await expect(page).toHaveURL(new RegExp(`/fields/${current}$`))
  }
})

test('focused hero communicates insight and impact before format', async ({ page }) => {
  await page.goto('/')
  const hero = page.locator('#home')
  await expect(hero).toContainText('Professionel adgang. For alle.')
  await expect(hero.getByRole('heading', { name: 'Få adgang til det, andre får gennem deres netværk.' })).toBeVisible()
  await expect(hero.getByRole('link', { name: 'Find den erfaring, du mangler' })).toHaveAttribute('href', '/professionals')
  await expect(hero.getByRole('link', { name: 'Se, hvordan Naetwork virker' })).toHaveAttribute('href', '/#how-it-works')
  await expect(hero).toContainText('Ingen introduktion nødvendig. Ét konkret mål. Erfaring, du kan handle på.')
  await expect(hero).toContainText('10 % af hver gennemført og betalt session går til Kræftens Bekæmpelse.')
  await expect(hero.locator('button')).toHaveCount(0)
  await expect(hero.locator('.insight-signature__marker')).toHaveCount(1)
  await expect(hero.locator('img')).toHaveCount(0)
  await expectNoHorizontalOverflow(page)
})

test('Access motion respects reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const duration = await page.locator('#home').getByRole('link', { name: 'Se, hvordan Naetwork virker' }).evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001)
})

test('compact mobile hero keeps the primary action visible', async ({ page }) => {
  test.skip((page.viewportSize()?.height ?? 1000) > 720, 'Small-height mobile contract')
  await page.goto('/')
  await expect(page.locator('#home').getByRole('link', { name: 'Find den erfaring, du mangler' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

test('critical public routes expose specific metadata', async ({ page }) => {
  for (const [route, title] of [
    ['/start', 'Start med din karrieresituation'],
    ['/how-it-works', 'Sådan fungerer Naetwork'],
    ['/sessions', '7 konkrete karrieresessioner'],
    ['/professionals', 'Find den erfaring, du mangler'],
    ['/contact', 'Kontakt'],
    ['/professional/signup', 'Bliv professionel'],
  ] as const) {
    await page.goto(route)
    await expect(page).toHaveTitle(new RegExp(title, 'i'))
  }
})

test('legacy matching routes lead to the situation-first entry', async ({ page }) => {
  for (const route of ['/match', '/onboarding']) {
    await page.goto(route)
    await expect(page).toHaveURL(/\/start$/)
    await expect(page.getByRole('heading', { name: /Hvad skal være bedre om 60 minutter|What should be better in 60 minutes/i })).toBeVisible()
  }
})

test('situation-first entry produces a relevant directory route', async ({ page }) => {
  await page.goto('/start')
  await page.getByRole('button', { name: /Branche- og virksomhedsindsigt/i }).click()
  await page.getByRole('button', { name: /Consulting.*Management Consulting/i }).click()
  const next = page.locator('#main-content').getByRole('link', { name: /Find relevant erfaring/i })
  await expect(next).toBeVisible()
  await expect(next).toHaveAttribute('href', /\/professionals\?field=Consulting&session=industry-company-insight/)
})

test('English positioning mirrors the Danish product contract', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('naetwork_lang', 'en'))
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Access what others get through their network.' })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: 'Find the experience you need' })).toBeVisible()
  await page.goto('/how-it-works')
  await expect(page.getByRole('heading', { name: '60 minutes. One concrete goal. A stronger next step.' })).toBeVisible()
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

test('sitemap publishes the career-session information architecture', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  expect(response?.status()).toBe(200)
  const sitemap = await page.locator('body').innerText()
  for (const route of ['/start', '/how-it-works', '/sessions', '/explore', '/prepare', '/apply', '/perform']) {
    expect(sitemap).toContain(route)
  }
  expect(sitemap).not.toContain('/match')
  for (const route of ['/fields/consulting', '/fields/finance', '/fields/legal']) expect(sitemap).toContain(route)
  for (const route of ['/fields/ai', '/fields/banking', '/fields/private-equity']) expect(sitemap).not.toContain(route)
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
    await expect(page.getByText('Senest opdateret 13. juli 2026', { exact: true })).toBeVisible()
  }
})

test('professional application keeps pricing and review expectations concrete', async ({ page }) => {
  await page.goto('/professional/signup')
  await expect(page.locator('main section[data-interactive="true"]')).toBeVisible()
  await page.getByLabel('Fulde navn').fill('Test Professionel')
  await page.getByLabel('E-mail').fill('professionel@example.com')
  await page.getByLabel('Adgangskode').fill('test-password-123')
  await page.getByLabel('Jobtitel').fill('Senior Manager')
  await page.getByLabel('Virksomhed').fill('Testvirksomhed')
  await page.getByLabel('Kategori').selectOption('Consulting')
  await page.getByRole('button', { name: 'Management Consulting', exact: true }).click()
  await page.getByLabel('LinkedIn').fill('https://linkedin.com/in/test-professionel')
  await page.getByRole('button', { name: 'Næste' }).click()

  await expect(page.getByRole('heading', { name: 'Sessionstyper og pris' })).toBeVisible()
  await page.getByRole('button', { name: /CV-gennemgang/i }).click()
  for (const amount of ['DKK 600', 'DKK 900', 'DKK 1.200', 'DKK 1.800']) {
    await expect(page.getByRole('button', { name: amount })).toBeVisible()
  }
  await page.getByRole('button', { name: 'DKK 600' }).click()
  await page.getByRole('button', { name: 'Næste' }).click()
  await expect(page.getByRole('heading', { name: 'Fast fordeling pr. session' })).toBeVisible()
  await expect(page.getByText(/De tre andele nedenfor summerer altid til hele nettoprisen/i)).toBeVisible()
  await expect(page.getByText('DKK 96', { exact: true })).toBeVisible()
  await expect(page.getByText('DKK 48', { exact: true })).toBeVisible()
  await expect(page.getByText('DKK 336', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: /40%|60%|80%|90%/ })).toHaveCount(0)
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
  await expect(page.getByRole('heading', { name: /Fortsæt fra din situation/i })).toBeVisible()
  if (page.url().includes('service_unavailable')) {
    await expect(page.getByText('Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.', { exact: true })).toBeVisible()
  }
})

test('admin pages and APIs do not expose data to unauthenticated visitors', async ({ page, request }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/login/)

  const response = await request.get('/api/admin/system')
  // Local release checks can intentionally run without Supabase credentials;
  // both outcomes fail closed and expose no administration data.
  expect([401, 500]).toContain(response.status())
  const body = await response.text()
  expect(body).not.toContain('SUPABASE_SERVICE_ROLE_KEY')
  expect(body).not.toContain('"integrations"')
})
