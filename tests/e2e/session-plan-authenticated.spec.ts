import { randomUUID } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  expect,
  test,
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  type Locator,
  type Page,
  type TestInfo,
} from '@playwright/test'

const runAuthenticatedFlow = process.env.RUN_SESSION_PLAN_E2E === '1'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteAccessCode = process.env.SITE_ACCESS_CODE
const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const automationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const previewShareUrl = process.env.VERCEL_PREVIEW_SHARE_URL

test.skip(
  !runAuthenticatedFlow || !supabaseUrl || !anonKey || !serviceRoleKey,
  'Set RUN_SESSION_PLAN_E2E=1 and Supabase credentials to run the isolated authenticated flow.',
)

type ParticipantRole = 'candidate' | 'professional'
type NextMoveResponsible = ParticipantRole | 'shared'
type ApiMethod = 'GET' | 'PATCH' | 'POST' | 'PUT'

interface TestActor {
  authUserId: string
  profileId: string
  email: string
  password: string
}

interface CleanupState {
  authUserIds: Set<string>
  bookingIds: Set<string>
  slotIds: Set<string>
  contexts: Set<BrowserContext>
}

interface PreparationRow {
  problem: string | null
  context: string | null
  desired_outcome: string | null
  definition_of_done: string | null
  key_questions: string[]
  anything_else: string | null
  preparation_status: 'draft' | 'ready'
  updated_at: string
}

interface NextMoveRow {
  id: string
  position: number
  action: string
  responsible: NextMoveResponsible
  due_at: string | null
  status: 'pending' | 'completed'
  completed_at: string | null
}

interface OutcomeRow {
  id: string
  summary: string
  recommendation: string
  decisions: string[]
  definition_of_done_status: 'achieved' | 'partially_achieved' | 'not_achieved_yet'
  open_questions: string[]
  result_status: 'draft' | 'published'
  result_schema_version: number
  updated_at: string
  next_moves: NextMoveRow[]
}

interface SessionPlanBody {
  viewerRole: ParticipantRole
  preparation: PreparationRow
  privateNote?: string
  privateNoteUpdatedAt?: string | null
  outcome: OutcomeRow | null
}

interface PreparationMutationBody {
  preparation: PreparationRow
}

interface NoteMutationBody {
  privateNote: string
  privateNoteUpdatedAt: string
}

interface OutcomeMutationBody {
  outcome: OutcomeRow
}

interface NextMoveMutationBody {
  nextMove: NextMoveRow
}

interface BookingCreationBody {
  bookingId?: string
}

interface OutcomeSavePayload {
  keyInsights: string
  recommendation: string
  decisions: string[]
  definitionOfDoneStatus: OutcomeRow['definition_of_done_status']
  openQuestions: string[]
  nextMoves: Array<{
    action: string
    responsible: NextMoveResponsible
    dueAt: string
  }>
  publish: boolean
  expectedUpdatedAt: string | null
}

const primedContexts = new WeakSet<BrowserContext>()

function contextOptions(testInfo: TestInfo): BrowserContextOptions {
  const use = testInfo.project.use
  return {
    baseURL: typeof use.baseURL === 'string'
      ? use.baseURL
      : previewBaseUrl ?? 'http://127.0.0.1:3100',
    viewport: use.viewport,
    userAgent: use.userAgent,
    deviceScaleFactor: use.deviceScaleFactor,
    isMobile: use.isMobile,
    hasTouch: use.hasTouch,
    locale: use.locale,
    timezoneId: use.timezoneId,
  }
}

async function openContext(
  browser: Browser,
  testInfo: TestInfo,
  cleanup: CleanupState,
) {
  const context = await browser.newContext(contextOptions(testInfo))
  cleanup.contexts.add(context)
  return context
}

async function primeDeploymentAccess(page: Page) {
  const context = page.context()
  if (primedContexts.has(context)) return

  try {
    if (previewBaseUrl && automationBypassSecret) {
      const deploymentOrigin = new URL(previewBaseUrl).origin
      const response = await page.request.get(`${deploymentOrigin}/`, {
        headers: {
          'x-vercel-protection-bypass': automationBypassSecret,
          'x-vercel-set-bypass-cookie': 'true',
        },
      })
      if (response.status() >= 500 || new URL(response.url()).origin !== deploymentOrigin) {
        throw new Error('The Vercel automation bypass did not open the deployment.')
      }
    } else if (previewShareUrl) {
      const response = await page.request.get(new URL(previewShareUrl).toString())
      if (response.status() >= 500) {
        throw new Error('The Vercel preview share link did not open the deployment.')
      }
      if (
        previewBaseUrl
        && new URL(response.url()).origin !== new URL(previewBaseUrl).origin
      ) {
        throw new Error('The Vercel preview share link did not reach the expected deployment.')
      }
    }
    primedContexts.add(context)
  } catch {
    throw new Error('Vercel preview access could not be primed for this browser context.')
  }
}

async function createActor(
  admin: SupabaseClient,
  cleanup: CleanupState,
  label: string,
  role: ParticipantRole,
  runId: string,
): Promise<TestActor> {
  const email = `codex-${label}-${runId}@example.invalid`
  const password = `Naetwork-${runId}-Aa1!`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: `Codex ${label}`, role },
  })
  if (error || !data.user) throw error ?? new Error(`Could not create ${label}.`)

  // Track the auth id before any follow-up query can fail.
  cleanup.authUserIds.add(data.user.id)

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id')
    .eq('auth_user_id', data.user.id)
    .single()
  if (profileError || !profile) throw profileError ?? new Error(`Profile missing for ${label}.`)
  return {
    authUserId: data.user.id,
    profileId: profile.id,
    email,
    password,
  }
}

async function unlockAndLogin(page: Page, actor: TestActor) {
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

async function signedInDataClient(actor: TestActor) {
  const client = createClient(supabaseUrl!, anonKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error } = await client.auth.signInWithPassword({
    email: actor.email,
    password: actor.password,
  })
  if (error) throw error
  return client
}

async function apiRequest<T>(
  page: Page,
  path: string,
  method: ApiMethod = 'GET',
  body?: unknown,
): Promise<{ status: number; body: T; text: string }> {
  const result = await page.evaluate(async ({ requestPath, requestMethod, requestBody }) => {
    const response = await fetch(requestPath, {
      method: requestMethod,
      headers: requestBody === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: requestBody === undefined ? undefined : JSON.stringify(requestBody),
    })
    const text = await response.text()
    let parsed: unknown = {}
    if (text) {
      try {
        parsed = JSON.parse(text)
      } catch {
        parsed = {}
      }
    }
    return { status: response.status, body: parsed, text }
  }, {
    requestPath: path,
    requestMethod: method,
    requestBody: body,
  })
  return result as { status: number; body: T; text: string }
}

function outcomePayload(
  outcome: OutcomeRow,
  overrides: Partial<OutcomeSavePayload> = {},
): OutcomeSavePayload {
  return {
    keyInsights: outcome.summary,
    recommendation: outcome.recommendation,
    decisions: outcome.decisions,
    definitionOfDoneStatus: outcome.definition_of_done_status,
    openQuestions: outcome.open_questions,
    nextMoves: outcome.next_moves.map((move) => ({
      action: move.action,
      responsible: move.responsible,
      dueAt: move.due_at ?? '',
    })),
    publish: false,
    expectedUpdatedAt: outcome.updated_at,
    ...overrides,
  }
}

async function waitForAutosave(page: Page) {
  await expect(page.getByText('Gemmer…', { exact: true }).last()).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText('Gemt', { exact: true }).last()).toBeVisible({ timeout: 10_000 })
}

async function expectNoHorizontalOverflow(page: Page, label: string) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(
    dimensions.content,
    `${label} overflows horizontally (${dimensions.content}px > ${dimensions.viewport}px).`,
  ).toBeLessThanOrEqual(dimensions.viewport + 1)
}

function nextMoveCard(page: Page, action: string): Locator {
  return page
    .getByText(action, { exact: true })
    .locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " grid ")][1]')
}

async function cleanupTestData(admin: SupabaseClient, cleanup: CleanupState) {
  const failures: Error[] = []
  const capture = (label: string, error: unknown) => {
    if (!error) return
    failures.push(new Error(
      `${label}: ${error instanceof Error ? error.message : String(error)}`,
    ))
  }

  for (const context of cleanup.contexts) {
    try {
      await context.close()
    } catch (error) {
      capture('browser context cleanup', error)
    }
  }
  cleanup.contexts.clear()

  const slotIds = [...cleanup.slotIds]
  if (slotIds.length > 0) {
    const { data, error } = await admin
      .from('bookings')
      .select('id')
      .in('slot_id', slotIds)
    capture('booking discovery by tracked slot ids', error)
    for (const booking of data ?? []) cleanup.bookingIds.add(booking.id)
  }

  for (const bookingId of cleanup.bookingIds) {
    for (const table of ['email_delivery_events', 'analytics_events', 'payment_events']) {
      const { error } = await admin
        .from(table)
        .delete()
        .eq('booking_id', bookingId)
      capture(`${table} cleanup`, error)
    }
    const { error } = await admin
      .from('bookings')
      .delete()
      .eq('id', bookingId)
    capture('booking cleanup', error)
  }

  const bookingIds = [...cleanup.bookingIds]
  if (bookingIds.length > 0) {
    const { count, error } = await admin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .in('id', bookingIds)
    capture('booking cleanup verification', error)
    if (!error && count !== 0) {
      capture('booking cleanup verification', new Error(`${count ?? 'unknown'} tracked bookings remain.`))
    }
  }

  for (const slotId of cleanup.slotIds) {
    const { error } = await admin
      .from('availability_slots')
      .delete()
      .eq('id', slotId)
    capture('availability slot cleanup', error)
  }

  for (const userId of cleanup.authUserIds) {
    const { error } = await admin.auth.admin.deleteUser(userId)
    capture('auth user cleanup', error)
  }

  if (failures.length > 0) {
    throw new AggregateError(failures, 'Session Plan E2E cleanup failed.')
  }
}

test('Session Plan enforces lifecycle, privacy, publication and Next Move responsibility', async ({ browser }, testInfo) => {
  test.setTimeout(180_000)

  const runId = `${testInfo.project.name.replace(/\W+/g, '-')}-${randomUUID().slice(0, 8)}`
  const admin = createClient(supabaseUrl!, serviceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const cleanup: CleanupState = {
    authUserIds: new Set(),
    bookingIds: new Set(),
    slotIds: new Set(),
    contexts: new Set(),
  }

  try {
    const candidate = await createActor(admin, cleanup, 'Candidate-A', 'candidate', runId)
    const otherCandidate = await createActor(admin, cleanup, 'Candidate-B', 'candidate', runId)
    const professional = await createActor(admin, cleanup, 'Professional-A', 'professional', runId)
    const otherProfessional = await createActor(admin, cleanup, 'Professional-B', 'professional', runId)

    const { data: professionalProfile, error: professionalError } = await admin
      .from('professional_profiles')
      .insert({
        profile_id: professional.profileId,
        title: 'Senior Manager',
        company: 'Codex Test',
        bio: 'Direkte relevant erfaring med interviewprocesser og kandidatvurdering.',
        experience_summary: 'Ti års direkte erfaring med interviewprocesser, kandidatvurdering og konkrete ansættelsesbeslutninger.',
        relevant_situations: ['Når du skal forberede et vigtigt interview'],
        expected_outcomes: ['Prioriterede forbedringer til dine stærkeste svar'],
        industries: ['Management Consulting'],
        focus_areas: ['interview_prep'],
        languages: ['da', 'en'],
        seniority: 'manager',
        years_experience: 10,
        response_time_hours: 24,
        price_dkk: 600,
        payout_preference: 'receive',
        contribution_percent: 10,
        linkedin_url: 'https://www.linkedin.com/in/codex-session-plan-test',
        visibility: 'published',
        review_status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .select('id')
      .single()
    if (professionalError || !professionalProfile) {
      throw professionalError ?? new Error('Professional setup failed.')
    }

    const startsAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    startsAt.setUTCMinutes(0, 0, 0)
    const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000)
    const slotId = randomUUID()
    cleanup.slotIds.add(slotId)
    const { data: slot, error: slotError } = await admin
      .from('availability_slots')
      .insert({
        id: slotId,
        professional_profile_id: professionalProfile.id,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        time_zone: 'Europe/Copenhagen',
        meeting_mode: 'video',
        is_available: true,
      })
      .select('id')
      .single()
    if (slotError || !slot) throw slotError ?? new Error('Slot setup failed.')

    const candidateContext = await openContext(browser, testInfo, cleanup)
    const candidatePage = await candidateContext.newPage()
    await unlockAndLogin(candidatePage, candidate)

    const bookingGoal = 'Jeg vil forstå, hvilke svar jeg konkret skal styrke før interviewet.'
    const bookingResult = await apiRequest<BookingCreationBody>(
      candidatePage,
      '/api/bookings',
      'POST',
      {
        professionalId: professionalProfile.id,
        slotId: slot.id,
        sessionType: 'interview-training',
        goal: bookingGoal,
        material: '',
      },
    )
    expect(bookingResult.status).toBe(201)
    if (typeof bookingResult.body.bookingId !== 'string') {
      throw new Error('Booking response did not include a booking id.')
    }
    const bookingId = bookingResult.body.bookingId
    cleanup.bookingIds.add(bookingId)

    // Two independent reads share one revision. Only the first PATCH may win.
    const firstPreparationRead = await apiRequest<SessionPlanBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    const secondPreparationRead = await apiRequest<SessionPlanBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(firstPreparationRead.status).toBe(200)
    expect(secondPreparationRead.status).toBe(200)
    expect(secondPreparationRead.body.preparation.updated_at)
      .toBe(firstPreparationRead.body.preparation.updated_at)

    const firstCasProblem = `Første samtidige forberedelse vandt ${runId}.`
    const staleCasProblem = `Denne forældede forberedelse må aldrig gemmes ${runId}.`
    const preparationPayload = {
      problem: firstCasProblem,
      context: 'Jeg har analyseerfaring, men ikke den præcise jobtitel.',
      desiredOutcome: bookingGoal,
      definitionOfDone: 'Jeg kender de tre vigtigste svar, som skal øves.',
      keyQuestions: ['Hvilket svar vil en interviewer udfordre mest?'],
      anythingElse: '',
      preparationStatus: 'draft',
      expectedUpdatedAt: firstPreparationRead.body.preparation.updated_at,
    }
    const acceptedPreparation = await apiRequest<PreparationMutationBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      preparationPayload,
    )
    expect(acceptedPreparation.status).toBe(200)
    const stalePreparation = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      { ...preparationPayload, problem: staleCasProblem },
    )
    expect(stalePreparation.status).toBe(409)
    const missingPreparationRevision = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      {
        ...preparationPayload,
        expectedUpdatedAt: undefined,
      },
    )
    expect(missingPreparationRevision.status).toBe(400)
    const preparationAfterCas = await apiRequest<SessionPlanBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(preparationAfterCas.body.preparation.problem).toBe(firstCasProblem)
    expect(preparationAfterCas.body.preparation.problem).not.toBe(staleCasProblem)
    expect(preparationAfterCas.body.preparation.updated_at)
      .toBe(acceptedPreparation.body.preparation.updated_at)

    await candidatePage.goto(`/profil/bookings/${bookingId}`)
    await expect(candidatePage.getByRole('heading', { name: 'Jobsamtaletræning' })).toBeVisible()
    await expect(candidatePage.getByLabel(/Hvad vil du stå med bagefter/)).toHaveValue(bookingGoal)
    await expect(candidatePage.getByLabel(/Hvad vil du have hjælp til/)).toHaveValue(firstCasProblem)
    const uniqueProblem = `Jeg skal bevise mit match til en ny rolle ${runId}.`
    await candidatePage.getByLabel(/Hvad vil du have hjælp til/).fill(uniqueProblem)
    await candidatePage.getByLabel(/Hvad er vigtigt at kende/).fill(
      'Jeg har relevant analyseerfaring, men ikke den præcise jobtitel.',
    )
    await candidatePage.getByLabel(/Hvornår har sessionen været værdifuld/).fill(
      'Når jeg har tre prioriterede svar og ved, hvad jeg skal øve først.',
    )
    await candidatePage.getByLabel('Vigtigt spørgsmål 1').fill(
      'Hvilket svar vil en interviewer udfordre mest?',
    )
    await waitForAutosave(candidatePage)
    await candidatePage.getByRole('button', { name: 'Markér forberedelsen som klar' }).click()
    await expect(candidatePage.getByRole('button', { name: 'Gem opdateret forberedelse' })).toBeVisible()
    await candidatePage.reload()
    await expect(candidatePage.getByLabel(/Hvad vil du have hjælp til/)).toHaveValue(uniqueProblem)
    await expectNoHorizontalOverflow(candidatePage, 'Candidate preparation')

    const candidatePlanAfterReady = await apiRequest<SessionPlanBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(candidatePlanAfterReady.body.preparation.preparation_status).toBe('ready')

    const candidateDataClient = await signedInDataClient(candidate)
    const { data: ownPlans, error: ownPlansError } = await candidateDataClient
      .from('session_plans')
      .select('booking_id, problem, preparation_status')
      .eq('booking_id', bookingId)
    expect(ownPlansError).toBeNull()
    expect(ownPlans).toEqual([{
      booking_id: bookingId,
      problem: uniqueProblem,
      preparation_status: 'ready',
    }])
    const { error: candidatePlanMutationError } = await candidateDataClient
      .from('session_plans')
      .update({ problem: `Direkte RLS-omgåelse ${runId}` })
      .eq('booking_id', bookingId)
    expect(candidatePlanMutationError).not.toBeNull()

    const outsiderContext = await openContext(browser, testInfo, cleanup)
    const outsiderPage = await outsiderContext.newPage()
    await unlockAndLogin(outsiderPage, otherCandidate)
    const outsiderRead = await apiRequest<Record<string, unknown>>(
      outsiderPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(outsiderRead.status).toBe(404)
    expect(outsiderRead.text).not.toContain(uniqueProblem)
    const outsiderWrite = await apiRequest<Record<string, unknown>>(
      outsiderPage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      {
        ...preparationPayload,
        expectedUpdatedAt: candidatePlanAfterReady.body.preparation.updated_at,
      },
    )
    expect(outsiderWrite.status).toBe(404)
    await outsiderPage.goto(`/profil/bookings/${bookingId}`)
    await expect(outsiderPage.getByRole('heading', { name: 'Session Plan kunne ikke åbnes.' })).toBeVisible()
    await expect(outsiderPage.locator('body')).not.toContainText(uniqueProblem)

    const otherCandidateDataClient = await signedInDataClient(otherCandidate)
    const { data: outsiderPlans, error: outsiderPlansError } = await otherCandidateDataClient
      .from('session_plans')
      .select('booking_id')
      .eq('booking_id', bookingId)
    expect(outsiderPlansError).toBeNull()
    expect(outsiderPlans).toEqual([])

    const professionalContext = await openContext(browser, testInfo, cleanup)
    const professionalPage = await professionalContext.newPage()
    await unlockAndLogin(professionalPage, professional)

    const professionalPreparationWrite = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      {
        ...preparationPayload,
        expectedUpdatedAt: candidatePlanAfterReady.body.preparation.updated_at,
      },
    )
    expect(professionalPreparationWrite.status).toBe(404)

    const preCompletionOutcome = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      {
        keyInsights: 'Dette resultat må først kunne gemmes efter den gennemførte session.',
        recommendation: 'Markér først sessionen som gennemført.',
        decisions: [],
        definitionOfDoneStatus: 'not_achieved_yet',
        openQuestions: [],
        nextMoves: [{
          action: 'Gennemfør sessionen',
          responsible: 'professional',
          dueAt: '',
        }],
        publish: false,
        expectedUpdatedAt: null,
      },
    )
    expect(preCompletionOutcome.status).toBe(409)

    const firstNoteRead = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    const secondNoteRead = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(firstNoteRead.status).toBe(200)
    expect(secondNoteRead.status).toBe(200)
    expect(firstNoteRead.body.privateNoteUpdatedAt).toBeNull()
    expect(secondNoteRead.body.privateNoteUpdatedAt).toBeNull()

    const initialPrivateNote = `Første private note ${runId}.`
    const stalePrivateNote = `Denne forældede private note må ikke gemmes ${runId}.`
    const acceptedPrivateNote = await apiRequest<NoteMutationBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/private-notes`,
      'PUT',
      {
        note: initialPrivateNote,
        expectedUpdatedAt: null,
      },
    )
    expect(acceptedPrivateNote.status).toBe(200)
    const staleNote = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/private-notes`,
      'PUT',
      {
        note: stalePrivateNote,
        expectedUpdatedAt: null,
      },
    )
    expect(staleNote.status).toBe(409)
    const noteAfterCas = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(noteAfterCas.body.privateNote).toBe(initialPrivateNote)
    expect(noteAfterCas.body.privateNote).not.toBe(stalePrivateNote)
    expect(noteAfterCas.body.privateNoteUpdatedAt)
      .toBe(acceptedPrivateNote.body.privateNoteUpdatedAt)

    const candidatePrivateNoteWrite = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan/private-notes`,
      'PUT',
      {
        note: 'Kandidaten må ikke skrive en privat professionel note.',
        expectedUpdatedAt: noteAfterCas.body.privateNoteUpdatedAt,
      },
    )
    expect(candidatePrivateNoteWrite.status).toBe(404)

    await professionalPage.goto(`/profil/bookings/${bookingId}`)
    await expect(professionalPage.getByText(uniqueProblem, { exact: true })).toBeVisible()
    await expect(professionalPage.getByLabel('Privat forberedelsesnote')).toHaveValue(initialPrivateNote)
    const privateNote = `Privat note ${runId}: start med motivationen.`
    await professionalPage.getByLabel('Privat forberedelsesnote').fill(privateNote)
    await waitForAutosave(professionalPage)
    await expectNoHorizontalOverflow(professionalPage, 'Professional preparation and private note')

    const noteAfterUiSave = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(noteAfterUiSave.body.privateNote).toBe(privateNote)

    const professionalDataClient = await signedInDataClient(professional)
    const { data: ownNotes, error: ownNotesError } = await professionalDataClient
      .from('professional_session_notes')
      .select('note')
      .eq('booking_id', bookingId)
    expect(ownNotesError).toBeNull()
    expect(ownNotes).toEqual([{ note: privateNote }])
    const { error: professionalNoteMutationError } = await professionalDataClient
      .from('professional_session_notes')
      .update({ note: `Direkte professionel RLS-omgåelse ${runId}` })
      .eq('booking_id', bookingId)
    expect(professionalNoteMutationError).not.toBeNull()

    const otherProfessionalContext = await openContext(browser, testInfo, cleanup)
    const otherProfessionalPage = await otherProfessionalContext.newPage()
    await unlockAndLogin(otherProfessionalPage, otherProfessional)
    const otherProfessionalRead = await apiRequest<Record<string, unknown>>(
      otherProfessionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(otherProfessionalRead.status).toBe(404)
    const otherProfessionalNoteWrite = await apiRequest<Record<string, unknown>>(
      otherProfessionalPage,
      `/api/bookings/${bookingId}/session-plan/private-notes`,
      'PUT',
      {
        note: 'En uvedkommende professionel må ikke kunne skrive her.',
        expectedUpdatedAt: noteAfterUiSave.body.privateNoteUpdatedAt,
      },
    )
    expect(otherProfessionalNoteWrite.status).toBe(404)

    const otherProfessionalDataClient = await signedInDataClient(otherProfessional)
    const { data: otherPlans, error: otherPlansError } = await otherProfessionalDataClient
      .from('session_plans')
      .select('booking_id')
      .eq('booking_id', bookingId)
    expect(otherPlansError).toBeNull()
    expect(otherPlans).toEqual([])
    const { data: otherNotes, error: otherNotesError } = await otherProfessionalDataClient
      .from('professional_session_notes')
      .select('booking_id')
      .eq('booking_id', bookingId)
    expect(otherNotesError).toBeNull()
    expect(otherNotes).toEqual([])

    const pastStart = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const pastEnd = new Date(Date.now() - 60 * 60 * 1000)
    const { data: completedBooking, error: completeError } = await admin
      .from('bookings')
      .update({
        status: 'completed',
        starts_at: pastStart.toISOString(),
        ends_at: pastEnd.toISOString(),
      })
      .eq('id', bookingId)
      .select('id')
      .single()
    if (completeError || !completedBooking) {
      throw completeError ?? new Error('Booking completion failed.')
    }

    const preparationAfterCompletion = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan`,
      'PATCH',
      {
        ...preparationPayload,
        problem: `For sent ændret ${runId}`,
        expectedUpdatedAt: candidatePlanAfterReady.body.preparation.updated_at,
      },
    )
    expect(preparationAfterCompletion.status).toBe(409)
    const noteAfterCompletion = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/private-notes`,
      'PUT',
      {
        note: `For sent ændret privat note ${runId}`,
        expectedUpdatedAt: noteAfterUiSave.body.privateNoteUpdatedAt,
      },
    )
    expect(noteAfterCompletion.status).toBe(409)
    const candidateOutcomeWrite = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      {
        keyInsights: 'Kandidaten må ikke dokumentere resultatet.',
        recommendation: 'Den professionelle ejer dette trin.',
        decisions: [],
        definitionOfDoneStatus: 'achieved',
        openQuestions: [],
        nextMoves: [{
          action: 'Forsøg ikke at omgå rollegrænsen',
          responsible: 'candidate',
          dueAt: '',
        }],
        publish: true,
        expectedUpdatedAt: null,
      },
    )
    expect(candidateOutcomeWrite.status).toBe(404)

    await professionalPage.reload()
    await expect(professionalPage.getByLabel('Vigtigste indsigter')).toBeVisible()
    await professionalPage.getByLabel('Vigtigste indsigter').fill(
      'Kandidaten har stærke eksempler, men koblingen til den konkrete rolle skal være tydeligere.',
    )
    await professionalPage.getByLabel('Din klare anbefaling').fill(
      'Prioritér tre korte eksempler og forbind hvert eksempel direkte til rollens vigtigste krav.',
    )
    await professionalPage.getByLabel(/Status på Definition of Done/).selectOption('partially_achieved')
    await professionalPage.getByRole('button', { name: 'Tilføj næste træk' }).click()
    await professionalPage.getByRole('button', { name: 'Tilføj næste træk' }).click()

    const candidateMove = `Omskriv tre intervieweksempler ${runId}`
    const sharedMove = `Gennemgå svarene sammen ${runId}`
    const professionalMove = `Send brancheeksempel ${runId}`
    await professionalPage.getByLabel('Handling', { exact: true }).nth(0).fill(candidateMove)
    await professionalPage.getByLabel('Ansvarlig', { exact: true }).nth(0).selectOption('candidate')
    await professionalPage.getByLabel('Deadline', { exact: true }).nth(0).fill(
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    )
    await professionalPage.getByLabel('Handling', { exact: true }).nth(1).fill(sharedMove)
    await professionalPage.getByLabel('Ansvarlig', { exact: true }).nth(1).selectOption('shared')
    await professionalPage.getByLabel('Handling', { exact: true }).nth(2).fill(professionalMove)
    await professionalPage.getByLabel('Ansvarlig', { exact: true }).nth(2).selectOption('professional')
    await waitForAutosave(professionalPage)
    await expectNoHorizontalOverflow(professionalPage, 'Professional outcome editor')

    const { data: hiddenDrafts, error: hiddenDraftError } = await candidateDataClient
      .from('session_outcomes')
      .select('id')
      .eq('booking_id', bookingId)
    expect(hiddenDraftError).toBeNull()
    expect(hiddenDrafts).toEqual([])
    const { data: hiddenNotes, error: hiddenNotesError } = await candidateDataClient
      .from('professional_session_notes')
      .select('note')
      .eq('booking_id', bookingId)
    expect(hiddenNotesError).toBeNull()
    expect(hiddenNotes).toEqual([])
    const { error: candidateOutcomeMutationError } = await candidateDataClient
      .from('session_outcomes')
      .update({ summary: `Direkte kandidat-RLS-omgåelse ${runId}` })
      .eq('booking_id', bookingId)
    expect(candidateOutcomeMutationError).not.toBeNull()

    const { error: legacyRpcPermissionError } = await candidateDataClient.rpc(
      'save_session_outcome_v1',
      {
        p_booking_id: bookingId,
        p_summary: 'Kandidaten må ikke kunne kalde den interne legacy-skriver.',
        p_priorities: ['Bevar adgangsgrænsen'],
        p_next_action: 'Forsøg ikke at omgå API-laget',
        p_next_action_due_at: null,
      },
    )
    expect(legacyRpcPermissionError).not.toBeNull()

    // Repeat the stale-write proof on the professional result draft.
    const firstOutcomeRead = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    const secondOutcomeRead = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(firstOutcomeRead.status).toBe(200)
    expect(secondOutcomeRead.status).toBe(200)
    expect(firstOutcomeRead.body.outcome).not.toBeNull()
    expect(secondOutcomeRead.body.outcome?.updated_at)
      .toBe(firstOutcomeRead.body.outcome?.updated_at)
    const draftOutcome = firstOutcomeRead.body.outcome
    if (!draftOutcome) throw new Error('Professional outcome draft is missing.')

    const acceptedRecommendation = `CAS-godkendt anbefaling ${runId}: prioritér de tre stærkeste eksempler.`
    const staleRecommendation = `Denne forældede anbefaling må ikke gemmes ${runId}.`
    const acceptedOutcome = await apiRequest<OutcomeMutationBody>(
      professionalPage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      outcomePayload(draftOutcome, { recommendation: acceptedRecommendation }),
    )
    expect(acceptedOutcome.status).toBe(200)
    const staleOutcome = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      outcomePayload(draftOutcome, { recommendation: staleRecommendation }),
    )
    expect(staleOutcome.status).toBe(409)
    const outcomeAfterCas = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(outcomeAfterCas.body.outcome?.recommendation).toBe(acceptedRecommendation)
    expect(outcomeAfterCas.body.outcome?.recommendation).not.toBe(staleRecommendation)
    expect(outcomeAfterCas.body.outcome?.updated_at)
      .toBe(acceptedOutcome.body.outcome.updated_at)

    await professionalPage.reload()
    await expect(professionalPage.getByLabel('Din klare anbefaling')).toHaveValue(acceptedRecommendation)
    await expect(professionalPage.getByLabel('Ansvarlig', { exact: true })).toHaveCount(3)
    await professionalPage.getByRole('button', { name: 'Publicér resultat til kandidaten' }).click()
    await expect(professionalPage.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()
    await expect(professionalPage.getByRole('button', { name: 'Publicér resultat til kandidaten' })).toHaveCount(0)
    await expectNoHorizontalOverflow(professionalPage, 'Professional published result')

    const publishedPlan = await apiRequest<SessionPlanBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan`,
    )
    expect(publishedPlan.status).toBe(200)
    expect(publishedPlan.body.outcome?.result_status).toBe('published')
    if (!publishedPlan.body.outcome) throw new Error('Published outcome is missing.')

    const publishedOverwrite = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      outcomePayload(publishedPlan.body.outcome, {
        recommendation: `Publiceret resultat må ikke overskrives ${runId}.`,
      }),
    )
    expect(publishedOverwrite.status).toBe(409)

    const legacyOverwrite = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/outcome`,
      'PUT',
      {
        summary: `Legacy må ikke overskrive version 2 ${runId}.`,
        priorities: ['Bevar det publicerede Session Plan-resultat'],
        nextAction: 'Denne handling må ikke gemmes',
        nextActionDueAt: '',
      },
    )
    expect(legacyOverwrite.status).toBe(409)

    const { data: protectedOutcome, error: protectedOutcomeError } = await admin
      .from('session_outcomes')
      .select('id, result_schema_version, result_status, summary, recommendation')
      .eq('booking_id', bookingId)
      .single()
    expect(protectedOutcomeError).toBeNull()
    expect(protectedOutcome).toMatchObject({
      result_schema_version: 2,
      result_status: 'published',
      summary: 'Kandidaten har stærke eksempler, men koblingen til den konkrete rolle skal være tydeligere.',
      recommendation: acceptedRecommendation,
    })

    const { data: publishedMoves, error: publishedMovesError } = await admin
      .from('session_plan_next_moves')
      .select('id, position, action, responsible, due_at, status, completed_at')
      .eq('session_outcome_id', protectedOutcome!.id)
      .order('position', { ascending: true })
    expect(publishedMovesError).toBeNull()
    expect(publishedMoves).toHaveLength(3)
    expect(publishedMoves?.map((move) => move.responsible))
      .toEqual(['candidate', 'shared', 'professional'])
    const [candidateMoveRow, sharedMoveRow, professionalMoveRow] = publishedMoves as NextMoveRow[]

    // A separate completed booking proves that the first publish is atomic:
    // one concurrent request succeeds and the stale peer receives 409.
    const secondBookingId = randomUUID()
    cleanup.bookingIds.add(secondBookingId)
    const secondStartsAt = new Date(Date.now() - 4 * 60 * 60 * 1000)
    const secondEndsAt = new Date(Date.now() - 3 * 60 * 60 * 1000)
    const { data: secondBooking, error: secondBookingError } = await admin
      .from('bookings')
      .insert({
        id: secondBookingId,
        candidate_profile_id: candidate.profileId,
        professional_profile_id: professionalProfile.id,
        slot_id: null,
        status: 'completed',
        starts_at: secondStartsAt.toISOString(),
        ends_at: secondEndsAt.toISOString(),
        price_dkk: 600,
        price_ex_vat_dkk: 480,
        vat_dkk: 120,
        contribution_percent: 10,
        minimum_contribution_dkk: 48,
        professional_donation_dkk: 0,
        contribution_dkk: 48,
        payout_preference: 'receive',
        platform_share_percent: 20,
        platform_fee_dkk: 96,
        professional_share_percent: 70,
        professional_payout_dkk: 336,
        session_type: 'interview-training',
        focus_area: 'interview_prep',
        goal: `Test en separat publiceringskonflikt ${runId}.`,
        time_zone: 'Europe/Copenhagen',
        meeting_mode: 'video',
        message_to_professional: 'Isoleret concurrency-fixture.',
        payment_status: 'pending',
      })
      .select('id')
      .single()
    if (secondBookingError || !secondBooking) {
      throw secondBookingError ?? new Error('Concurrent booking fixture failed.')
    }

    const foreignMoveAction = `Separat bookinghandling ${runId}`
    const concurrentPayload: OutcomeSavePayload = {
      keyInsights: `Begge samtidige requests læser samme tomme revision ${runId}.`,
      recommendation: 'Kun én request må publicere det atomiske resultat.',
      decisions: [],
      definitionOfDoneStatus: 'achieved',
      openQuestions: [],
      nextMoves: [{
        action: foreignMoveAction,
        responsible: 'candidate',
        dueAt: '',
      }],
      publish: true,
      expectedUpdatedAt: null,
    }
    const concurrentStatuses = await professionalPage.evaluate(async ({ id, payload }) => {
      const send = async () => {
        const response = await fetch(`/api/bookings/${id}/outcome`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        return response.status
      }
      return Promise.all([send(), send()])
    }, { id: secondBookingId, payload: concurrentPayload })
    expect([...concurrentStatuses].sort((left, right) => left - right)).toEqual([200, 409])

    const { data: secondOutcome, error: secondOutcomeError } = await admin
      .from('session_outcomes')
      .select('id, result_status')
      .eq('booking_id', secondBookingId)
      .single()
    expect(secondOutcomeError).toBeNull()
    expect(secondOutcome?.result_status).toBe('published')
    const { data: secondMoves, error: secondMovesError } = await admin
      .from('session_plan_next_moves')
      .select('id, action')
      .eq('session_outcome_id', secondOutcome!.id)
    expect(secondMovesError).toBeNull()
    expect(secondMoves).toEqual([expect.objectContaining({ action: foreignMoveAction })])
    const foreignMoveId = secondMoves![0].id

    await candidatePage.goto('/dashboard')
    const workspacePrimaryAction = candidatePage.getByRole('region', { name: 'Dit vigtigste næste træk' })
    await expect(workspacePrimaryAction).toContainText(candidateMove)
    await expect(workspacePrimaryAction.getByRole('button', { name: 'Markér som udført' })).toBeVisible()
    await expect(candidatePage.getByRole('link', { name: /målrettet opfølgning/i })).toHaveCount(0)
    await expectNoHorizontalOverflow(candidatePage, 'Candidate primary Next Move workspace')

    await candidatePage.goto(`/profil/bookings/${bookingId}`)
    await expect(candidatePage.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()
    await expect(candidatePage.getByText(candidateMove, { exact: true })).toBeVisible()
    await expect(candidatePage.getByText(sharedMove, { exact: true })).toBeVisible()
    await expect(candidatePage.getByText(professionalMove, { exact: true })).toBeVisible()
    await expect(candidatePage.locator('body')).not.toContainText(privateNote)
    await expect(candidatePage.getByText('Delvist opnået', { exact: true })).toBeVisible()
    await expect(nextMoveCard(candidatePage, professionalMove).getByText('Den professionelle følger op'))
      .toBeVisible()
    const primaryAction = candidatePage.getByRole('region', { name: 'Dit vigtigste næste træk' })
    await expect(primaryAction).toContainText(candidateMove)
    await expect(candidatePage.getByRole('link', { name: /målrettet opfølgning/i })).toHaveCount(0)
    await expectNoHorizontalOverflow(candidatePage, 'Candidate published result')

    await primaryAction.getByRole('button', { name: 'Markér som udført' }).click()
    await expect(primaryAction).toContainText(sharedMove)
    const candidateCard = nextMoveCard(candidatePage, candidateMove)
    await expect(candidateCard.getByRole('button', { name: 'Udført' })).toBeVisible()
    await candidatePage.reload()
    await expect(candidatePage.getByRole('region', { name: 'Dit vigtigste næste træk' })).toContainText(sharedMove)
    await expect(nextMoveCard(candidatePage, candidateMove).getByRole('button', { name: 'Udført' }))
      .toBeVisible()

    const candidateSharedMove = await apiRequest<NextMoveMutationBody>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${sharedMoveRow.id}`,
      'PATCH',
      { completed: true },
    )
    expect(candidateSharedMove.status).toBe(200)
    expect(candidateSharedMove.body.nextMove.status).toBe('completed')
    const candidateWrongRole = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${professionalMoveRow.id}`,
      'PATCH',
      { completed: true },
    )
    expect(candidateWrongRole.status).toBe(403)
    const candidateForeignMove = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${foreignMoveId}`,
      'PATCH',
      { completed: true },
    )
    expect(candidateForeignMove.status).toBe(404)

    const legacyCompletion = await apiRequest<Record<string, unknown>>(
      candidatePage,
      `/api/bookings/${bookingId}/outcome`,
      'PATCH',
      { completed: false },
    )
    expect(legacyCompletion.status).toBe(409)

    const { data: candidateVisibleMoves, error: candidateVisibleMovesError } = await candidateDataClient
      .from('session_plan_next_moves')
      .select('id')
      .eq('session_outcome_id', protectedOutcome!.id)
    expect(candidateVisibleMovesError).toBeNull()
    expect(candidateVisibleMoves).toHaveLength(3)
    const { error: candidateMoveMutationError } = await candidateDataClient
      .from('session_plan_next_moves')
      .update({ status: 'pending', completed_at: null })
      .eq('id', candidateMoveRow.id)
    expect(candidateMoveMutationError).not.toBeNull()

    await professionalPage.reload()
    await expect(professionalPage.getByRole('heading', { name: 'Det dokumenterede resultat.' })).toBeVisible()
    await expect(nextMoveCard(professionalPage, candidateMove).getByText('Kandidaten følger op'))
      .toBeVisible()
    const professionalCard = nextMoveCard(professionalPage, professionalMove)
    await professionalCard.getByRole('button', { name: 'Markér udført' }).click()
    await expect(professionalCard.getByRole('button', { name: 'Udført' })).toBeVisible()
    await professionalPage.reload()
    await expect(nextMoveCard(professionalPage, professionalMove).getByRole('button', { name: 'Udført' }))
      .toBeVisible()

    await candidatePage.reload()
    const contextualFollowUp = candidatePage.getByRole('region', { name: 'En opfølgning skal løse noget konkret.' })
    await expect(contextualFollowUp).toContainText('bragt dig helt i mål')
    await expect(contextualFollowUp.getByRole('link', { name: 'Åbn profilen for en målrettet opfølgning' })).toHaveAttribute(
      'href',
      `/professionals/${professionalProfile.id}`,
    )

    const professionalSharedMove = await apiRequest<NextMoveMutationBody>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${sharedMoveRow.id}`,
      'PATCH',
      { completed: false },
    )
    expect(professionalSharedMove.status).toBe(200)
    expect(professionalSharedMove.body.nextMove.status).toBe('pending')
    await candidatePage.reload()
    await expect(candidatePage.getByRole('region', { name: 'Dit vigtigste næste træk' })).toContainText(sharedMove)
    await expect(candidatePage.getByRole('link', { name: /målrettet opfølgning/i })).toHaveCount(0)
    const professionalWrongRole = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${candidateMoveRow.id}`,
      'PATCH',
      { completed: false },
    )
    expect(professionalWrongRole.status).toBe(403)
    const professionalForeignMove = await apiRequest<Record<string, unknown>>(
      professionalPage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${foreignMoveId}`,
      'PATCH',
      { completed: false },
    )
    expect(professionalForeignMove.status).toBe(404)
    await expectNoHorizontalOverflow(professionalPage, 'Professional Next Move result')

    const { data: professionalVisibleMoves, error: professionalVisibleMovesError } = await professionalDataClient
      .from('session_plan_next_moves')
      .select('id')
      .eq('session_outcome_id', protectedOutcome!.id)
    expect(professionalVisibleMovesError).toBeNull()
    expect(professionalVisibleMoves).toHaveLength(3)
    const { error: professionalMoveMutationError } = await professionalDataClient
      .from('session_plan_next_moves')
      .update({ status: 'pending', completed_at: null })
      .eq('id', professionalMoveRow.id)
    expect(professionalMoveMutationError).not.toBeNull()

    const outsiderMove = await apiRequest<Record<string, unknown>>(
      outsiderPage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${candidateMoveRow.id}`,
      'PATCH',
      { completed: true },
    )
    expect(outsiderMove.status).toBe(404)
    const otherProfessionalMove = await apiRequest<Record<string, unknown>>(
      otherProfessionalPage,
      `/api/bookings/${bookingId}/session-plan/next-moves/${professionalMoveRow.id}`,
      'PATCH',
      { completed: true },
    )
    expect(otherProfessionalMove.status).toBe(404)

    const { data: outsiderOutcomes, error: outsiderOutcomesError } = await otherCandidateDataClient
      .from('session_outcomes')
      .select('id')
      .eq('booking_id', bookingId)
    expect(outsiderOutcomesError).toBeNull()
    expect(outsiderOutcomes).toEqual([])
    const { data: otherProfessionalOutcomes, error: otherProfessionalOutcomesError } = await otherProfessionalDataClient
      .from('session_outcomes')
      .select('id')
      .eq('booking_id', bookingId)
    expect(otherProfessionalOutcomesError).toBeNull()
    expect(otherProfessionalOutcomes).toEqual([])
    const { data: outsiderMoves, error: outsiderMovesError } = await otherCandidateDataClient
      .from('session_plan_next_moves')
      .select('id')
      .eq('session_outcome_id', protectedOutcome!.id)
    expect(outsiderMovesError).toBeNull()
    expect(outsiderMoves).toEqual([])

    const validFeedback = {
      bookingId,
      goalAchieved: 'partially_achieved',
      professionalRelevance: 5,
      professionalPreparedness: 4,
      greaterClarity: 5,
      concreteNextSteps: 5,
      overallExperience: 5,
      comment: `Konkret og anvendelig sessionsfeedback ${runId}.`,
    }
    const legacyFeedback = await apiRequest<Record<string, unknown>>(
      candidatePage,
      '/api/reviews',
      'POST',
      { bookingId, rating: 5, feedback: 'Legacy-formatet må ikke accepteres.' },
    )
    expect(legacyFeedback.status).toBe(400)
    const outsiderFeedback = await apiRequest<Record<string, unknown>>(
      outsiderPage,
      '/api/reviews',
      'POST',
      validFeedback,
    )
    expect(outsiderFeedback.status).toBe(409)
    const professionalFeedback = await apiRequest<Record<string, unknown>>(
      professionalPage,
      '/api/reviews',
      'POST',
      validFeedback,
    )
    expect(professionalFeedback.status).toBe(403)

    await candidatePage.goto('/profil/bookings?view=past')
    const bookingArticle = candidatePage
      .getByRole('article')
      .filter({ hasText: 'Codex Professional-A' })
    await bookingArticle.getByRole('button', { name: 'Vurdér session' }).click()
    const feedbackForm = bookingArticle.locator(`#session-feedback-${bookingId}`)
    await expect(feedbackForm).toBeVisible()
    await feedbackForm.getByLabel('Blev sessionens mål opnået? Delvist').check()
    await feedbackForm.getByLabel('Hvor relevant var den professionelles erfaring? 5 ud af 5').check()
    await feedbackForm.getByLabel('Hvor velforberedt var den professionelle? 4 ud af 5').check()
    await feedbackForm.getByLabel('Hvor meget større klarhed fik du? 5 ud af 5').check()
    await feedbackForm.getByLabel('Hvor konkrete blev dine næste skridt? 5 ud af 5').check()
    await feedbackForm.getByLabel('Hvordan var den samlede oplevelse? 5 ud af 5').check()
    await feedbackForm.getByLabel('Valgfri kommentar').fill(validFeedback.comment)
    await feedbackForm.getByRole('button', { name: 'Send vurdering' }).click()
    await expect(bookingArticle.getByRole('status')).toContainText('Din feedback er gemt')
    await expect(bookingArticle.getByRole('button', { name: 'Vurdér session' })).toHaveCount(0)
    await expectNoHorizontalOverflow(candidatePage, 'Structured session feedback')

    const duplicateFeedback = await apiRequest<Record<string, unknown>>(
      candidatePage,
      '/api/reviews',
      'POST',
      validFeedback,
    )
    expect(duplicateFeedback.status).toBe(409)

    const { data: storedReviews, error: storedReviewError } = await admin
      .from('reviews')
      .select('booking_id, feedback_schema_version, goal_achieved, professional_relevance, professional_preparedness, greater_clarity, concrete_next_steps, rating, feedback')
      .eq('booking_id', bookingId)
    expect(storedReviewError).toBeNull()
    expect(storedReviews).toEqual([{
      booking_id: bookingId,
      feedback_schema_version: 2,
      goal_achieved: validFeedback.goalAchieved,
      professional_relevance: validFeedback.professionalRelevance,
      professional_preparedness: validFeedback.professionalPreparedness,
      greater_clarity: validFeedback.greaterClarity,
      concrete_next_steps: validFeedback.concreteNextSteps,
      rating: validFeedback.overallExperience,
      feedback: validFeedback.comment,
    }])

    const { data: candidateRawReviews, error: candidateRawReviewError } = await candidateDataClient
      .from('reviews')
      .select('id, feedback')
      .eq('booking_id', bookingId)
    expect(candidateRawReviewError).toBeNull()
    expect(candidateRawReviews).toEqual([])
    const { error: directReviewInsertError } = await candidateDataClient
      .from('reviews')
      .insert({
        booking_id: bookingId,
        candidate_profile_id: candidate.profileId,
        professional_profile_id: professionalProfile.id,
        rating: 5,
        feedback_schema_version: 2,
        goal_achieved: 'achieved',
        professional_relevance: 5,
        professional_preparedness: 5,
        greater_clarity: 5,
        concrete_next_steps: 5,
      })
    expect(directReviewInsertError).not.toBeNull()

    const { data: feedbackEvents, error: feedbackEventError } = await admin
      .from('analytics_events')
      .select('event_name, properties')
      .eq('booking_id', bookingId)
      .eq('event_name', 'session_feedback_completed')
    expect(feedbackEventError).toBeNull()
    expect(feedbackEvents).toEqual([{
      event_name: 'session_feedback_completed',
      properties: {},
    }])
    expect(JSON.stringify(feedbackEvents)).not.toContain(validFeedback.comment)

    const { data: finalMoves, error: finalMovesError } = await admin
      .from('session_plan_next_moves')
      .select('action, responsible, status')
      .eq('session_outcome_id', protectedOutcome!.id)
      .order('position', { ascending: true })
    expect(finalMovesError).toBeNull()
    expect(finalMoves).toEqual([
      { action: candidateMove, responsible: 'candidate', status: 'completed' },
      { action: sharedMove, responsible: 'shared', status: 'pending' },
      { action: professionalMove, responsible: 'professional', status: 'completed' },
    ])
  } finally {
    await cleanupTestData(admin, cleanup)
  }
})
