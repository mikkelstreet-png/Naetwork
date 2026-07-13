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
  await expect(page.getByRole('navigation', { name: /primær navigation|primary navigation/i })).toContainText(/Sessioner|Sessions/)
  await expect(page.locator('#mobile-navigation').getByRole('link', { name: /Beskriv din situation|Describe your situation/i })).toBeVisible()
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
  await expect(page.getByRole('heading', { name: /Få den viden, jobopslaget mangler|Get the insight the job description leaves out/i })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: /Beskriv din situation|Describe your situation/i })).toBeVisible()
  await expect(page.locator('#pricing')).toContainText('DKK 600')
  await expect(page.locator('#pricing')).toContainText('DKK 1.800')
  await expect(page.locator('#pricing')).toContainText('DKK 192')
  await expect(page.locator('#pricing')).toContainText(/ekskl\. moms|excl\. VAT/i)
  await expect(page.getByRole('heading', { name: /Det vigtigste, før du beslutter dig|What matters before you decide/i })).toBeVisible()
  await page.goto('/start')
  await expect(page.getByRole('heading', { name: /Hvad står du overfor|What are you facing/i })).toBeVisible()
})

test('interactive Access hero explains the selected situation without fake matching', async ({ page }) => {
  await page.goto('/')
  const cv = page.getByRole('button', { name: 'Jeg vil have vurderet mit CV' })
  await expect(cv).toHaveCount(1)
  await cv.click()
  await expect(cv).toHaveAttribute('aria-pressed', 'true')
  await expect(page.locator('.access-brief__result')).toContainText('Har vurderet lignende profiler')
  await expect(page.locator('.access-brief__result').getByRole('link', { name: 'Fortsæt' })).toHaveAttribute('href', '/start?situation=cv')
  await expect(page.locator('#home img')).toHaveAttribute('src', /naetwork-spectrum\.webp/)
  await expectNoHorizontalOverflow(page)
})

test('Access motion respects reduced-motion preferences', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const duration = await page.getByRole('button', { name: 'Jeg har en jobsamtale' }).evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001)
})

test('compact mobile hero leaves the next section in view', async ({ page }) => {
  test.skip((page.viewportSize()?.height ?? 1000) > 720, 'Small-height mobile contract')
  await page.goto('/')
  const position = await page.getByRole('heading', { name: 'Hvad står du overfor?' }).evaluate((element) => ({
    top: element.getBoundingClientRect().top,
    viewport: window.innerHeight,
  }))
  expect(position.top).toBeLessThan(position.viewport)
})

test('critical public routes expose specific metadata', async ({ page }) => {
  for (const [route, title] of [
    ['/start', 'Start med din karrieresituation'],
    ['/how-it-works', 'Sådan fungerer Career Access'],
    ['/sessions', 'Career Access-sessioner'],
    ['/professionals', 'Find relevant erfaring'],
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
    await expect(page.getByRole('heading', { name: /Hvad står du overfor|What are you facing/i })).toBeVisible()
  }
})

test('situation-first entry produces a relevant directory route', async ({ page }) => {
  await page.goto('/start')
  await page.getByRole('button', { name: /Jeg overvejer en bestemt rolle/i }).click()
  await page.getByRole('button', { name: 'AI' }).click()
  const next = page.getByRole('link', { name: /Se relevante profiler/i })
  await expect(next).toBeVisible()
  await expect(next).toHaveAttribute('href', /\/professionals\?field=AI&need=direction/)
})

test('English positioning mirrors the Danish product contract', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.setItem('naetwork_lang', 'en'))
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Get the insight the job description leaves out.' })).toBeVisible()
  await expect(page.locator('#home').getByRole('link', { name: 'Describe your situation' })).toBeVisible()
  await page.goto('/how-it-works')
  await expect(page.getByRole('heading', { name: 'From a question to an answer you can use.' })).toBeVisible()
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

test('sitemap publishes the Career Access information architecture', async ({ page }) => {
  const response = await page.goto('/sitemap.xml')
  expect(response?.status()).toBe(200)
  const sitemap = await page.locator('body').innerText()
  for (const route of ['/start', '/how-it-works', '/sessions', '/explore', '/prepare', '/apply', '/perform']) {
    expect(sitemap).toContain(route)
  }
  expect(sitemap).not.toContain('/match')
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
  await expect(page.locator('main section[data-interactive="true"]')).toBeVisible()
  await page.getByLabel('Fulde navn').fill('Test Professionel')
  await page.getByLabel('E-mail').fill('professionel@example.com')
  await page.getByLabel('Adgangskode').fill('test-password-123')
  await page.getByLabel('Jobtitel').fill('Senior Manager')
  await page.getByLabel('Virksomhed').fill('Testvirksomhed')
  await page.getByLabel('Industri').selectOption('Management Consulting')
  await page.getByLabel('LinkedIn').fill('https://linkedin.com/in/test-professionel')
  await page.getByRole('button', { name: 'Næste' }).click()

  await expect(page.getByRole('heading', { name: 'Fokusområder og pris' })).toBeVisible()
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
  await expect(page.getByRole('heading', { name: /Fortsæt fra din situation/i })).toBeVisible()
  if (page.url().includes('service_unavailable')) {
    await expect(page.getByText('Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.', { exact: true })).toBeVisible()
  }
})
