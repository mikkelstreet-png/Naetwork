import { createClient } from '@supabase/supabase-js'
import {
  expect,
  test,
  type Browser,
  type BrowserContext,
  type Page,
  type TestInfo,
} from '@playwright/test'

const runFixtureFlow = process.env.RUN_PHASE3_FIXTURE_E2E === '1'
const candidateEmail = process.env.E2E_CANDIDATE_EMAIL
const professionalEmail = process.env.E2E_PROFESSIONAL_EMAIL
const outsiderEmail = process.env.E2E_OUTSIDER_EMAIL
const adminEmail = process.env.E2E_ADMIN_EMAIL
const fixturePassword = process.env.E2E_FIXTURE_PASSWORD
const siteAccessCode = process.env.SITE_ACCESS_CODE
const previewShareUrl = process.env.VERCEL_PREVIEW_SHARE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const UPCOMING_BOOKING_ID = '73000000-0000-4000-8000-000000000001'
const COMPLETED_BOOKING_ID = '73000000-0000-4000-8000-000000000002'

test.skip(
  !runFixtureFlow
    || !candidateEmail
    || !professionalEmail
    || !outsiderEmail
    || !adminEmail
    || !fixturePassword
    || !supabaseUrl
    || !anonKey,
  'Set the approved Phase 3 fixture credentials to run this isolated live-preview flow.',
)

interface Actor {
  email: string
  password: string
}

const primedContexts = new WeakSet<BrowserContext>()

async function primeDeploymentAccess(page: Page) {
  if (primedContexts.has(page.context())) return
  if (previewShareUrl) {
    const deploymentOrigin = new URL(process.env.PLAYWRIGHT_BASE_URL!).origin
    await page.goto(new URL(previewShareUrl).toString(), { waitUntil: 'domcontentloaded' })
    await page.waitForURL((url) => url.origin === deploymentOrigin, { timeout: 30_000 })
  }
  primedContexts.add(page.context())
}

async function login(page: Page, actor: Actor) {
  await primeDeploymentAccess(page)
  await page.goto('/login')
  if (page.url().includes('/adgang')) {
    if (!siteAccessCode) throw new Error('SITE_ACCESS_CODE is required by this deployment.')
    await page.getByLabel('Adgangskode').fill(siteAccessCode)
    await page.getByRole('button', { name: 'Åbn Naetwork' }).click()
    await page.waitForURL(/\/login/)
  }
  await page.getByLabel('E-mail').fill(actor.email)
  await page.getByLabel('Adgangskode').fill(actor.password)
  await page.getByRole('button', { name: 'Log ind', exact: true }).click()
  await page.waitForURL(/\/profil/)
}

async function newSignedInPage(
  browser: Browser,
  testInfo: TestInfo,
  actor: Actor,
) {
  const context = await browser.newContext({
    baseURL: typeof testInfo.project.use.baseURL === 'string'
      ? testInfo.project.use.baseURL
      : process.env.PLAYWRIGHT_BASE_URL,
    viewport: testInfo.project.use.viewport,
    userAgent: testInfo.project.use.userAgent,
    deviceScaleFactor: testInfo.project.use.deviceScaleFactor,
    isMobile: testInfo.project.use.isMobile,
    hasTouch: testInfo.project.use.hasTouch,
    locale: testInfo.project.use.locale,
    timezoneId: testInfo.project.use.timezoneId,
  })
  const page = await context.newPage()
  await login(page, actor)
  return { context, page }
}

async function waitForAutosave(page: Page) {
  await expect(page.getByText('Gemmer…', { exact: true }).last()).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('Gemt', { exact: true }).last()).toBeVisible({ timeout: 10_000 })
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(size.content, `${label}: ${size.content}px > ${size.viewport}px`)
    .toBeLessThanOrEqual(size.viewport + 1)
}

async function signedInDataClient(actor: Actor) {
  const client = createClient(supabaseUrl!, anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await client.auth.signInWithPassword(actor)
  if (error) throw error
  return client
}

test('Phase 3 closes the authenticated value chain on the live preview', async ({ browser }, testInfo) => {
  // This story deliberately crosses four isolated authenticated browser
  // contexts and the remote preview/database boundary. Keep assertion
  // timeouts strict, but allow the complete live story enough wall time.
  test.setTimeout(420_000)

  const candidate = { email: candidateEmail!, password: fixturePassword! }
  const professional = { email: professionalEmail!, password: fixturePassword! }
  const outsider = { email: outsiderEmail!, password: fixturePassword! }
  const admin = { email: adminEmail!, password: fixturePassword! }
  const contexts: BrowserContext[] = []

  try {
    const candidateSession = await newSignedInPage(browser, testInfo, candidate)
    contexts.push(candidateSession.context)
    const candidatePage = candidateSession.page

    await candidatePage.goto(`/profil/bookings/${UPCOMING_BOOKING_ID}`)
    await expect(candidatePage.getByRole('heading', { name: 'Jobsamtaletræning' })).toBeVisible()
    const problem = 'Jeg skal vise mit match til rollen uden at gøre svarene generiske.'
    await candidatePage.getByLabel(/Hvad vil du have hjælp til/).fill(problem)
    await candidatePage.getByLabel(/Hvad er vigtigt at kende/).fill(
      'Jeg har relevant analyseerfaring, men har ikke haft den præcise jobtitel.',
    )
    await candidatePage.getByLabel(/Hvad vil du stå med bagefter/).fill(
      'Jeg vil kende de tre svar, der skal styrkes før interviewet.',
    )
    await candidatePage.getByLabel(/Hvornår har sessionen været værdifuld/).fill(
      'Når jeg ved præcis, hvad jeg skal øve først.',
    )
    await candidatePage.getByLabel('Vigtigt spørgsmål 1').fill(
      'Hvilket svar vil en interviewer udfordre mest?',
    )
    await waitForAutosave(candidatePage)
    await candidatePage.getByRole('button', { name: 'Markér forberedelsen som klar' }).click()
    await expect(candidatePage.getByRole('button', { name: 'Gem opdateret forberedelse' })).toBeVisible()
    await expectNoHorizontalOverflow(candidatePage, 'Candidate preparation')

    const outsiderSession = await newSignedInPage(browser, testInfo, outsider)
    contexts.push(outsiderSession.context)
    await outsiderSession.page.goto(`/profil/bookings/${UPCOMING_BOOKING_ID}`)
    await expect(outsiderSession.page.getByRole('heading', { name: 'Session Plan kunne ikke åbnes.' })).toBeVisible()
    await expect(outsiderSession.page.locator('body')).not.toContainText(problem)

    const professionalSession = await newSignedInPage(browser, testInfo, professional)
    contexts.push(professionalSession.context)
    const professionalPage = professionalSession.page
    await professionalPage.goto(`/profil/bookings/${UPCOMING_BOOKING_ID}`)
    await expect(professionalPage.getByText(problem, { exact: true })).toBeVisible()
    const privateNote = 'Privat fixture-note: start med kandidatens motivation.'
    await professionalPage.getByLabel('Privat forberedelsesnote').fill(privateNote)
    await waitForAutosave(professionalPage)
    await expectNoHorizontalOverflow(professionalPage, 'Professional preparation')

    await professionalPage.goto(`/profil/bookings/${COMPLETED_BOOKING_ID}`)
    await expect(professionalPage.getByLabel('Vigtigste indsigter')).toBeVisible()
    await professionalPage.getByLabel('Vigtigste indsigter').fill(
      'Kandidaten har stærke eksempler, men koblingen til den konkrete rolle skal være tydeligere.',
    )
    await professionalPage.getByLabel('Din klare anbefaling').fill(
      'Prioritér tre korte eksempler, og forbind hvert eksempel direkte til rollens vigtigste krav.',
    )
    await professionalPage.getByLabel(/Status på Definition of Done/).selectOption('partially_achieved')
    const moveActions = professionalPage.getByLabel('Handling', { exact: true })
    await expect(moveActions).toHaveCount(1)
    await professionalPage.getByRole('button', { name: 'Tilføj næste træk' }).click()
    await expect(moveActions).toHaveCount(2)
    await professionalPage.getByRole('button', { name: 'Tilføj næste træk' }).click()
    await expect(moveActions).toHaveCount(3)
    const responsibilitySelects = professionalPage.locator(
      'select:has(option[value="shared"]):has(option[value="professional"])',
    )
    await expect(responsibilitySelects).toHaveCount(3)
    const candidateMove = 'Omskriv tre intervieweksempler'
    const sharedMove = 'Gennemgå svarene sammen'
    const professionalMove = 'Send et brancheeksempel'
    await moveActions.nth(0).fill(candidateMove)
    await responsibilitySelects.nth(0).selectOption('candidate')
    await moveActions.nth(1).fill(sharedMove)
    await responsibilitySelects.nth(1).selectOption('shared')
    await moveActions.nth(2).fill(professionalMove)
    await responsibilitySelects.nth(2).selectOption('professional')
    await waitForAutosave(professionalPage)
    await professionalPage.getByRole('button', { name: 'Publicér resultat til kandidaten' }).click()
    await expect(professionalPage.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()

    await candidatePage.goto(`/profil/bookings/${COMPLETED_BOOKING_ID}`)
    await expect(candidatePage.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()
    await expect(candidatePage.locator('body')).not.toContainText(privateNote)
    const primaryAction = candidatePage.getByRole('region', { name: candidateMove })
    await expect(primaryAction).toContainText(candidateMove)
    await expect(candidatePage.getByRole('link', { name: /målrettet opfølgning/i })).toHaveCount(0)
    await primaryAction.getByRole('button', { name: 'Markér som udført' }).click()
    const sharedPrimaryAction = candidatePage.getByRole('region', { name: sharedMove })
    await expect(sharedPrimaryAction).toContainText(sharedMove)
    await sharedPrimaryAction.getByRole('button', { name: 'Markér som udført' }).click()
    await expect(candidatePage.getByRole('link', { name: /målrettet opfølgning/i })).toHaveCount(0)

    await professionalPage.reload()
    const professionalMoveCard = professionalPage
      .getByText(professionalMove, { exact: true })
      .locator('xpath=ancestor::div[contains(concat(\" \", normalize-space(@class), \" \"), \" grid \")][1]')
    await professionalMoveCard.getByRole('button', { name: 'Markér udført' }).click()
    await expect(professionalMoveCard.getByRole('button', { name: 'Udført' })).toBeVisible()

    await candidatePage.reload()
    await expect(candidatePage.getByRole('region', { name: 'En opfølgning skal løse noget konkret.' })).toBeVisible()

    const feedbackPayload = {
      bookingId: COMPLETED_BOOKING_ID,
      goalAchieved: 'partially_achieved',
      professionalRelevance: 5,
      professionalPreparedness: 4,
      greaterClarity: 5,
      concreteNextSteps: 5,
      overallExperience: 5,
      comment: 'Konkret fixture-feedback, som aldrig må sendes til analytics.',
    }
    const outsiderFeedbackStatus = await outsiderSession.page.evaluate(async (body) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return response.status
    }, feedbackPayload)
    expect(outsiderFeedbackStatus).toBe(409)
    const professionalFeedbackStatus = await professionalPage.evaluate(async (body) => {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return response.status
    }, feedbackPayload)
    expect(professionalFeedbackStatus).toBe(403)

    await candidatePage.goto('/profil/bookings?view=past')
    const bookingArticle = candidatePage
      .getByRole('article')
      .filter({ hasText: 'Codex Phase3 Professional' })
    await bookingArticle.getByRole('button', { name: 'Vurdér session' }).click()
    const feedbackForm = bookingArticle.locator(`#session-feedback-${COMPLETED_BOOKING_ID}`)
    await feedbackForm.getByLabel('Blev sessionens mål opnået? Delvist').locator('..').click()
    await feedbackForm.getByLabel('Hvor relevant var den professionelles erfaring? 5 ud af 5').locator('..').click()
    await feedbackForm.getByLabel('Hvor velforberedt var den professionelle? 4 ud af 5').locator('..').click()
    await feedbackForm.getByLabel('Hvor meget større klarhed fik du? 5 ud af 5').locator('..').click()
    await feedbackForm.getByLabel('Hvor konkrete blev dine næste skridt? 5 ud af 5').locator('..').click()
    await feedbackForm.getByLabel('Hvordan var den samlede oplevelse? 5 ud af 5').locator('..').click()
    await feedbackForm.getByLabel('Valgfri kommentar').fill(feedbackPayload.comment)
    await feedbackForm.getByRole('button', { name: 'Send vurdering' }).click()
    await expect(bookingArticle.getByRole('status')).toContainText('Din feedback er gemt')
    await expectNoHorizontalOverflow(candidatePage, 'Structured feedback')

    const candidateData = await signedInDataClient(candidate)
    const { data: hiddenReview, error: hiddenReviewError } = await candidateData
      .from('reviews')
      .select('id, feedback')
      .eq('booking_id', COMPLETED_BOOKING_ID)
    expect(hiddenReviewError).toBeNull()
    expect(hiddenReview).toEqual([])
    const { error: directInsertError } = await candidateData.from('reviews').insert({
      booking_id: COMPLETED_BOOKING_ID,
      rating: 5,
      feedback_schema_version: 2,
      goal_achieved: 'achieved',
      professional_relevance: 5,
      professional_preparedness: 5,
      greater_clarity: 5,
      concrete_next_steps: 5,
    })
    expect(directInsertError).not.toBeNull()

    const adminSession = await newSignedInPage(browser, testInfo, admin)
    contexts.push(adminSession.context)
    await adminSession.page.goto('/admin/reviews')
    await expect(adminSession.page.getByRole('heading', { name: 'Feedback og kvalitet' })).toBeVisible()
    await expect(adminSession.page.getByText('Codex Phase3 Professional')).toBeVisible()
    await expect(adminSession.page.getByText('Delvist opnået')).toBeVisible()
    await expectNoHorizontalOverflow(adminSession.page, 'Admin quality review')

    const adminData = await signedInDataClient(admin)
    const { data: events, error: eventsError } = await adminData
      .from('analytics_events')
      .select('event_name, properties')
      .eq('booking_id', COMPLETED_BOOKING_ID)
      .eq('event_name', 'session_feedback_completed')
    expect(eventsError).toBeNull()
    expect(events).toEqual([{ event_name: 'session_feedback_completed', properties: {} }])
    expect(JSON.stringify(events)).not.toContain(feedbackPayload.comment)
  } finally {
    await Promise.allSettled(contexts.map((context) => context.close()))
  }
})

test('Phase 3 authenticated workspaces remain usable on mobile', async ({ browser }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-standard', 'Mobile authenticated smoke test.')

  const candidate = { email: candidateEmail!, password: fixturePassword! }
  const professional = { email: professionalEmail!, password: fixturePassword! }
  const admin = { email: adminEmail!, password: fixturePassword! }
  const contexts: BrowserContext[] = []

  try {
    const candidateSession = await newSignedInPage(browser, testInfo, candidate)
    contexts.push(candidateSession.context)
    await candidateSession.page.goto(`/profil/bookings/${COMPLETED_BOOKING_ID}`)
    await expect(candidateSession.page.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()
    await expectNoHorizontalOverflow(candidateSession.page, 'Mobile candidate result')

    const professionalSession = await newSignedInPage(browser, testInfo, professional)
    contexts.push(professionalSession.context)
    await professionalSession.page.goto(`/profil/bookings/${UPCOMING_BOOKING_ID}`)
    await expect(professionalSession.page.getByText('Jeg skal vise mit match til rollen uden at gøre svarene generiske.')).toBeVisible()
    await expectNoHorizontalOverflow(professionalSession.page, 'Mobile professional brief')

    const adminSession = await newSignedInPage(browser, testInfo, admin)
    contexts.push(adminSession.context)
    await adminSession.page.goto('/admin/reviews')
    await expect(adminSession.page.getByRole('heading', { name: 'Feedback og kvalitet' })).toBeVisible()
    await expectNoHorizontalOverflow(adminSession.page, 'Mobile admin quality')
  } finally {
    await Promise.allSettled(contexts.map((context) => context.close()))
  }
})
