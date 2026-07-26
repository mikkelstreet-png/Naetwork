import { randomUUID } from 'node:crypto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import {
  expect,
  test,
  type Browser,
  type BrowserContext,
  type BrowserContextOptions,
  type Page,
  type TestInfo,
} from '@playwright/test'

const runProfessionalProfileFlow = process.env.RUN_PROFESSIONAL_PROFILE_E2E === '1'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const siteAccessCode = process.env.SITE_ACCESS_CODE
const previewBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const automationBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET
const previewShareUrl = process.env.VERCEL_PREVIEW_SHARE_URL

const fixtureCredentials = {
  professional: {
    email: process.env.E2E_PROFESSIONAL_EMAIL,
    password: process.env.E2E_PROFESSIONAL_PASSWORD,
  },
  admin: {
    email: process.env.E2E_ADMIN_EMAIL,
    password: process.env.E2E_ADMIN_PASSWORD,
  },
  candidate: {
    email: process.env.E2E_CANDIDATE_EMAIL,
    password: process.env.E2E_CANDIDATE_PASSWORD,
  },
  inactive: {
    email: process.env.E2E_INACTIVE_EMAIL,
    password: process.env.E2E_INACTIVE_PASSWORD,
  },
} as const

const hasFixtureCredentials = Object.values(fixtureCredentials).every(
  ({ email, password }) => Boolean(email && password),
)
const selfProvisioningMode = Boolean(serviceRoleKey)
const fixtureMode = !selfProvisioningMode && hasFixtureCredentials

test.skip(
  !runProfessionalProfileFlow
    || !supabaseUrl
    || !anonKey
    || (!selfProvisioningMode && !hasFixtureCredentials),
  'Set RUN_PROFESSIONAL_PROFILE_E2E=1 plus Supabase credentials and either SUPABASE_SERVICE_ROLE_KEY or all E2E actor credentials.',
)

type ProductRole = 'candidate' | 'professional'

interface TestActor {
  authUserId: string
  profileId: string
  name: string
  email: string
  password: string
}

interface CleanupState {
  authUserIds: Set<string>
  profileIds: Set<string>
  professionalProfileIds: Set<string>
  contexts: Set<BrowserContext>
  dataClients: Set<SupabaseClient>
}

interface ActorSession {
  actor: TestActor
  client: SupabaseClient
  profile: {
    role: string
    status: string
    is_admin: boolean
  }
}

interface ProfessionalRow {
  id: string
  profile_id: string
  title: string | null
  company: string | null
  experience_summary: string | null
  relevant_situations: string[]
  expected_outcomes: string[]
  payout_preference: 'receive' | 'donate'
  visibility: 'hidden' | 'published'
  review_status: 'pending' | 'approved' | 'rejected'
  review_feedback: string | null
  approved_at: string | null
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
  role: ProductRole,
  runId: string,
): Promise<TestActor> {
  const name = `Codex ${label} ${runId}`
  const email = `codex-${label.toLowerCase()}-${runId}@example.invalid`
  const password = `Naetwork-${runId}-Aa1!`
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  })
  if (error || !data.user) throw error ?? new Error(`Could not create ${label}.`)

  cleanup.authUserIds.add(data.user.id)

  const { data: profile, error: profileError } = await admin
    .from('profiles')
    .select('id')
    .eq('auth_user_id', data.user.id)
    .single()
  if (profileError || !profile) throw profileError ?? new Error(`Profile missing for ${label}.`)
  cleanup.profileIds.add(profile.id)

  return {
    authUserId: data.user.id,
    profileId: profile.id,
    name,
    email,
    password,
  }
}

function createAnonymousClient() {
  return createClient(supabaseUrl!, anonKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

async function signedInDataClient(actor: Pick<TestActor, 'email' | 'password'>) {
  const client = createAnonymousClient()
  const { data, error } = await client.auth.signInWithPassword({
    email: actor.email,
    password: actor.password,
  })
  if (error || !data.user) throw error ?? new Error(`Could not sign in ${actor.email}.`)
  return client
}

async function loadFixtureActor(
  label: keyof typeof fixtureCredentials,
): Promise<ActorSession> {
  const credentials = fixtureCredentials[label]
  if (!credentials.email || !credentials.password) {
    throw new Error(`Fixture credentials are incomplete for ${label}.`)
  }

  const client = createAnonymousClient()
  const { data: authData, error: authError } = await client.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  })
  if (authError || !authData.user) {
    throw authError ?? new Error(`Could not sign in the ${label} fixture.`)
  }

  const { data: profile, error: profileError } = await client
    .from('profiles')
    .select('id, name, role, status, is_admin')
    .eq('auth_user_id', authData.user.id)
    .single()
  if (profileError || !profile) {
    throw profileError ?? new Error(`Profile missing for the ${label} fixture.`)
  }

  return {
    actor: {
      authUserId: authData.user.id,
      profileId: profile.id,
      name: profile.name,
      email: credentials.email,
      password: credentials.password,
    },
    client,
    profile: {
      role: profile.role,
      status: profile.status,
      is_admin: profile.is_admin,
    },
  }
}

function assertFixtureRoles(sessions: {
  professional: ActorSession
  admin: ActorSession
  candidate: ActorSession
  inactive: ActorSession
}) {
  if (
    sessions.professional.profile.role !== 'professional'
    || sessions.professional.profile.status !== 'active'
  ) {
    throw new Error('The professional fixture must be an active professional.')
  }
  if (
    sessions.admin.profile.is_admin !== true
    || sessions.admin.profile.status !== 'active'
  ) {
    throw new Error('The admin fixture must be active and have is_admin=true.')
  }
  if (
    sessions.candidate.profile.role !== 'candidate'
    || sessions.candidate.profile.status !== 'active'
  ) {
    throw new Error('The candidate fixture must be an active candidate.')
  }
  if (
    sessions.inactive.profile.role !== 'professional'
    || sessions.inactive.profile.status !== 'deletion_requested'
  ) {
    throw new Error(
      'The inactive fixture must be a professional with status=deletion_requested.',
    )
  }
}

async function signOutDataClient(client: SupabaseClient) {
  await client.auth.signOut()
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

function profileStatusCard(page: Page) {
  return page.getByText('Status', { exact: true }).locator('..')
}

async function loadProfessional(
  admin: SupabaseClient,
  professionalProfileId: string,
): Promise<ProfessionalRow> {
  const { data, error } = await admin
    .from('professional_profiles')
    .select('id, profile_id, title, company, experience_summary, relevant_situations, expected_outcomes, payout_preference, visibility, review_status, review_feedback, approved_at')
    .eq('id', professionalProfileId)
    .single()
  if (error || !data) throw error ?? new Error('Professional profile could not be loaded.')
  return data as ProfessionalRow
}

function blockedProfileInsert(profileId: string, runId: string) {
  return {
    profile_id: profileId,
    title: 'RLS bypass attempt',
    company: 'Must never persist',
    bio: `This complete fixture should be rejected by ownership rules ${runId}.`,
    experience_summary: `Direct experience that is long enough to satisfy validation ${runId}.`,
    relevant_situations: [`Attempt an unauthorized professional profile ${runId}`],
    expected_outcomes: [`This row must never be visible ${runId}`],
    industries: ['Management Consulting'],
    focus_areas: ['cv_linkedin'],
    languages: ['da'],
    seniority: 'manager',
    years_experience: 5,
    response_time_hours: 24,
    price_dkk: 600,
    contribution_percent: 10,
    payout_preference: 'receive',
    linkedin_url: `https://www.linkedin.com/in/codex-blocked-${runId}`,
    visibility: 'hidden',
    review_status: 'pending',
  }
}

async function cleanupTestData(
  adminDataClient: SupabaseClient,
  cleanup: CleanupState,
  options: {
    serviceAdmin?: SupabaseClient
    professionalOwnerClient?: SupabaseClient
    professionalOwnerProfileId?: string
  },
) {
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

  if (options.professionalOwnerProfileId) {
    const { data: ownedRows, error: ownedRowsError } = await adminDataClient
      .from('professional_profiles')
      .select('id')
      .eq('profile_id', options.professionalOwnerProfileId)
    capture('professional cleanup discovery', ownedRowsError)
    for (const row of ownedRows ?? []) {
      cleanup.professionalProfileIds.add(row.id)
    }
  }

  const profileIds = [...cleanup.profileIds]
  const professionalProfileIds = [...cleanup.professionalProfileIds]

  if (options.serviceAdmin) {
    if (profileIds.length > 0) {
      const { error: emailError } = await options.serviceAdmin
        .from('email_delivery_events')
        .delete()
        .in('recipient_profile_id', profileIds)
      capture('email event cleanup', emailError)

      const { error: actorAuditError } = await options.serviceAdmin
        .from('admin_audit_log')
        .delete()
        .in('admin_user_id', profileIds)
      capture('admin audit actor cleanup', actorAuditError)
    }

    if (professionalProfileIds.length > 0) {
      const { error: targetAuditError } = await options.serviceAdmin
        .from('admin_audit_log')
        .delete()
        .in('target_id', professionalProfileIds)
      capture('admin audit target cleanup', targetAuditError)

      const { error: professionalError } = await options.serviceAdmin
        .from('professional_profiles')
        .delete()
        .in('id', professionalProfileIds)
      capture('professional profile cleanup', professionalError)
    }
  } else if (professionalProfileIds.length > 0) {
    // Fixture mode deliberately stays inside production RLS: the active
    // professional owns this row and may delete it. Audit/email rows and auth
    // actors are immutable to authenticated clients and are removed by the
    // external fixture teardown.
    if (!options.professionalOwnerClient) {
      capture(
        'professional profile cleanup',
        new Error('The authenticated professional owner client is missing.'),
      )
    } else {
      const { error: professionalError } = await options.professionalOwnerClient
        .from('professional_profiles')
        .delete()
        .in('id', professionalProfileIds)
      capture('professional owner cleanup', professionalError)
    }
  }

  if (professionalProfileIds.length > 0) {
    const { count, error } = await adminDataClient
      .from('professional_profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', professionalProfileIds)
    capture('professional cleanup verification', error)
    if (!error && count !== 0) {
      capture('professional cleanup verification', new Error(`${count ?? 'unknown'} tracked profiles remain.`))
    }
  }

  if (options.serviceAdmin) {
    for (const userId of cleanup.authUserIds) {
      const { error } = await options.serviceAdmin.auth.admin.deleteUser(userId)
      capture('auth user cleanup', error)
    }
  }

  for (const client of cleanup.dataClients) {
    try {
      await signOutDataClient(client)
    } catch (error) {
      capture('data client sign-out', error)
    }
  }
  cleanup.dataClients.clear()

  if (failures.length > 0) {
    throw new AggregateError(failures, 'Professional profile E2E cleanup failed.')
  }
}

test('professional profile review lifecycle, public value fields, payout choice and RLS remain coherent', async ({ browser }, testInfo) => {
  test.setTimeout(240_000)

  const runId = `${testInfo.project.name.replace(/\W+/g, '-')}-${randomUUID().slice(0, 8)}`
  const serviceAdmin = selfProvisioningMode
    ? createClient(supabaseUrl!, serviceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
    : undefined
  const cleanup: CleanupState = {
    authUserIds: new Set(),
    profileIds: new Set(),
    professionalProfileIds: new Set(),
    contexts: new Set(),
    dataClients: new Set(),
  }
  let adminDataClient: SupabaseClient | undefined
  let professionalOwnerClient: SupabaseClient | undefined
  let professionalOwnerProfileId: string | undefined

  try {
    let professional: TestActor
    let platformAdmin: TestActor
    let candidate: TestActor
    let inactiveProfessional: TestActor
    let candidateDataClient: SupabaseClient
    let inactiveDataClient: SupabaseClient

    if (serviceAdmin) {
      professional = await createActor(
        serviceAdmin,
        cleanup,
        'Professional',
        'professional',
        runId,
      )
      platformAdmin = await createActor(
        serviceAdmin,
        cleanup,
        'Admin',
        'candidate',
        runId,
      )
      candidate = await createActor(serviceAdmin, cleanup, 'Candidate', 'candidate', runId)
      inactiveProfessional = await createActor(
        serviceAdmin,
        cleanup,
        'Inactive',
        'professional',
        runId,
      )

      const { data: promotedAdmin, error: promoteError } = await serviceAdmin
        .from('profiles')
        .update({ is_admin: true })
        .eq('id', platformAdmin.profileId)
        .select('is_admin')
        .single()
      if (promoteError || !promotedAdmin?.is_admin) {
        throw promoteError ?? new Error('Admin fixture could not be promoted.')
      }

      adminDataClient = await signedInDataClient(platformAdmin)
      cleanup.dataClients.add(adminDataClient)
      const { data: inactiveProfile, error: inactiveError } = await adminDataClient
        .from('profiles')
        .update({ status: 'deletion_requested' })
        .eq('id', inactiveProfessional.profileId)
        .select('status')
        .single()
      if (inactiveError || inactiveProfile?.status !== 'deletion_requested') {
        throw inactiveError ?? new Error('Inactive professional fixture could not be prepared.')
      }

      professionalOwnerClient = await signedInDataClient(professional)
      candidateDataClient = await signedInDataClient(candidate)
      inactiveDataClient = await signedInDataClient(inactiveProfessional)
      cleanup.dataClients.add(professionalOwnerClient)
      cleanup.dataClients.add(candidateDataClient)
      cleanup.dataClients.add(inactiveDataClient)
    } else if (fixtureMode) {
      const fixtureSessions = {
        professional: await loadFixtureActor('professional'),
        admin: await loadFixtureActor('admin'),
        candidate: await loadFixtureActor('candidate'),
        inactive: await loadFixtureActor('inactive'),
      }
      assertFixtureRoles(fixtureSessions)

      professional = fixtureSessions.professional.actor
      platformAdmin = fixtureSessions.admin.actor
      candidate = fixtureSessions.candidate.actor
      inactiveProfessional = fixtureSessions.inactive.actor
      professionalOwnerClient = fixtureSessions.professional.client
      adminDataClient = fixtureSessions.admin.client
      candidateDataClient = fixtureSessions.candidate.client
      inactiveDataClient = fixtureSessions.inactive.client

      for (const session of Object.values(fixtureSessions)) {
        cleanup.profileIds.add(session.actor.profileId)
        cleanup.dataClients.add(session.client)
      }

      const { data: existingProfessionalRows, error: existingProfessionalError } =
        await adminDataClient
          .from('professional_profiles')
          .select('id, profile_id')
          .in('profile_id', [
            professional.profileId,
            candidate.profileId,
            inactiveProfessional.profileId,
          ])
      if (existingProfessionalError) throw existingProfessionalError
      if ((existingProfessionalRows ?? []).length > 0) {
        throw new Error(
          'Pre-created fixtures must not have professional_profiles rows before this test starts.',
        )
      }
    } else {
      throw new Error('No professional profile E2E credential mode is configured.')
    }

    if (!adminDataClient || !professionalOwnerClient) {
      throw new Error('Authenticated fixture clients could not be prepared.')
    }
    professionalOwnerProfileId = professional.profileId
    const authenticatedAdmin = adminDataClient

    const candidateInsert = await candidateDataClient
      .from('professional_profiles')
      .insert(blockedProfileInsert(candidate.profileId, runId))
      .select('id')
    expect(candidateInsert.error).not.toBeNull()
    expect(candidateInsert.data ?? []).toEqual([])

    const inactiveInsert = await inactiveDataClient
      .from('professional_profiles')
      .insert(blockedProfileInsert(inactiveProfessional.profileId, runId))
      .select('id')
    expect(inactiveInsert.error).not.toBeNull()
    expect(inactiveInsert.data ?? []).toEqual([])

    const { count: blockedRows, error: blockedRowsError } = await authenticatedAdmin
      .from('professional_profiles')
      .select('id', { count: 'exact', head: true })
      .in('profile_id', [candidate.profileId, inactiveProfessional.profileId])
    expect(blockedRowsError).toBeNull()
    expect(blockedRows).toBe(0)

    const professionalContext = await openContext(browser, testInfo, cleanup)
    const professionalPage = await professionalContext.newPage()
    await unlockAndLogin(professionalPage, professional)
    await professionalPage.goto('/profil/professionel')
    await expect(professionalPage.getByRole('heading', { name: 'Din profil.' })).toBeVisible()

    const initialExperience = `Jeg har selv vurderet kandidater og CV'er i management consulting gennem flere rekrutteringsforløb ${runId}.`
    const revisedExperience = `Jeg har ledet konkrete CV-screeninger og caseinterviews i management consulting og giver feedback fra den anden side af bordet ${runId}.`
    const relevantSituation = `Når du søger din første rolle i management consulting ${runId}`
    const initialOutcome = `Tre prioriterede forbedringer til dit CV ${runId}`
    const revisedOutcome = `En prioriteret plan for din næste ansøgning ${runId}`

    await professionalPage.getByLabel('Stillingsbetegnelse').fill('Engagement Manager')
    await professionalPage.getByLabel('Virksomhed / erfaring').fill(`Codex Consulting ${runId}`)
    await professionalPage.getByLabel(/^Bio/).fill(
      `Jeg arbejder med strategi og rekruttering og har direkte erfaring med at vurdere kandidater ${runId}.`,
    )
    await professionalPage.getByLabel(/Hvilken erfaring bygger din feedback på/).fill(initialExperience)
    await professionalPage.getByLabel('Relevant situation 1').fill(relevantSituation)
    await professionalPage.getByLabel('Forventet udbytte 1').fill(initialOutcome)
    await professionalPage.getByLabel('LinkedIn').fill(`https://www.linkedin.com/in/codex-professional-${runId}`)
    await professionalPage.getByRole('button', { name: 'Management Consulting', exact: true }).click()
    await professionalPage.getByRole('button', { name: 'CV-gennemgang', exact: true }).click()
    await expect(professionalPage.getByRole('radio', { name: /Modtag min andel/ })).toBeChecked()
    await professionalPage.locator('form button[type="submit"]').click()

    let professionalProfileId = ''
    await expect.poll(async () => {
      const { data } = await authenticatedAdmin
        .from('professional_profiles')
        .select('id, visibility, review_status, payout_preference')
        .eq('profile_id', professional.profileId)
        .maybeSingle()
      if (data?.id) {
        professionalProfileId = data.id
        cleanup.professionalProfileIds.add(data.id)
      }
      return data
    }).toMatchObject({
      visibility: 'hidden',
      review_status: 'pending',
      payout_preference: 'receive',
    })
    await expect(profileStatusCard(professionalPage).getByText('Kladde · ikke indsendt', { exact: true })).toBeVisible()

    await professionalPage.getByRole('button', { name: 'Send til gennemgang', exact: true }).click()
    await professionalPage.locator('form button[type="submit"]').click()
    await expect.poll(async () => {
      const row = await loadProfessional(authenticatedAdmin, professionalProfileId)
      return { visibility: row.visibility, reviewStatus: row.review_status }
    }).toEqual({ visibility: 'published', reviewStatus: 'pending' })
    await expect(profileStatusCard(professionalPage).getByText('Indsendt · afventer gennemgang', { exact: true })).toBeVisible()
    await expectNoHorizontalOverflow(professionalPage, 'Professional profile draft and submission')

    const adminContext = await openContext(browser, testInfo, cleanup)
    const adminPage = await adminContext.newPage()
    await unlockAndLogin(adminPage, platformAdmin)
    await adminPage.goto('/admin/professionals')
    await expect(adminPage.getByRole('heading', { name: 'Professionelle' })).toBeVisible()

    let reviewCard = adminPage.locator('article').filter({ hasText: professional.name })
    await expect(reviewCard).toBeVisible()
    await reviewCard.getByRole('button', { name: 'Afvis profil' }).click()
    const rejectionFeedback = `Gør erfaringsgrundlaget endnu mere konkret før godkendelse ${runId}.`
    await reviewCard.getByRole('textbox', { name: 'Hvad skal den professionelle konkret rette?' }).fill(rejectionFeedback)
    await reviewCard.getByRole('button', { name: 'Ja, afvis og skjul' }).click()
    await expect(adminPage.getByText(`${professional.name} kræver ændringer`, { exact: true })).toBeVisible()
    await expect.poll(async () => {
      const row = await loadProfessional(authenticatedAdmin, professionalProfileId)
      return {
        visibility: row.visibility,
        reviewStatus: row.review_status,
        feedback: row.review_feedback,
      }
    }).toEqual({
      visibility: 'hidden',
      reviewStatus: 'rejected',
      feedback: rejectionFeedback,
    })

    await professionalPage.reload()
    await expect(profileStatusCard(professionalPage).getByText('Kræver ændringer', { exact: true })).toBeVisible()
    await expect(professionalPage.getByText(rejectionFeedback, { exact: true })).toBeVisible()
    await professionalPage.getByLabel(/Hvilken erfaring bygger din feedback på/).fill(revisedExperience)
    await professionalPage.getByText('Donér også min andel', { exact: true }).click()
    await expect(professionalPage.getByRole('radio', { name: /Donér også min andel/ })).toBeChecked()
    await professionalPage.getByRole('button', { name: 'Send til gennemgang', exact: true }).click()
    await professionalPage.locator('form button[type="submit"]').click()

    await expect.poll(async () => {
      const row = await loadProfessional(authenticatedAdmin, professionalProfileId)
      return {
        experience: row.experience_summary,
        payout: row.payout_preference,
        visibility: row.visibility,
        reviewStatus: row.review_status,
        feedback: row.review_feedback,
      }
    }).toEqual({
      experience: revisedExperience,
      payout: 'donate',
      visibility: 'published',
      reviewStatus: 'pending',
      feedback: null,
    })

    await adminPage.reload()
    reviewCard = adminPage.locator('article').filter({ hasText: professional.name })
    await expect(reviewCard).toBeVisible()
    await expect(reviewCard.getByText(revisedExperience, { exact: true })).toBeVisible()
    await expect(reviewCard.getByText(relevantSituation)).toBeVisible()
    await expect(reviewCard.getByText(initialOutcome)).toBeVisible()
    await reviewCard.getByRole('button', { name: 'Godkend og publicér' }).click()
    await expect(adminPage.getByText(`${professional.name} er godkendt`, { exact: true })).toBeVisible()

    await expect.poll(async () => {
      const row = await loadProfessional(authenticatedAdmin, professionalProfileId)
      return {
        visibility: row.visibility,
        reviewStatus: row.review_status,
        approved: Boolean(row.approved_at),
      }
    }).toEqual({
      visibility: 'published',
      reviewStatus: 'approved',
      approved: true,
    })

    const publicClient = createClient(supabaseUrl!, anonKey!, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
    const { data: publicProfile, error: publicProfileError } = await publicClient
      .rpc('get_public_professionals', { requested_id: professionalProfileId })
      .maybeSingle()
    expect(publicProfileError).toBeNull()
    expect(publicProfile).toMatchObject({
      id: professionalProfileId,
      name: professional.name,
      experience_summary: revisedExperience,
      relevant_situations: [relevantSituation],
      expected_outcomes: [initialOutcome],
      payout_preference: 'donate',
    })

    await professionalPage.goto(`/professionals/${professionalProfileId}`)
    await expect(professionalPage.getByRole('heading', { name: professional.name })).toBeVisible()
    await expect(professionalPage.getByText(revisedExperience, { exact: true }).first()).toBeVisible()
    await expect(professionalPage.getByText(relevantSituation, { exact: true })).toBeVisible()
    await expect(professionalPage.getByText(initialOutcome, { exact: true })).toBeVisible()
    await expect(
      professionalPage
        .locator('.professional-booking-card__donation:visible, .professional-mobile-booking span:visible')
        .filter({ hasText: /donerer også sin egen 70%-andel/i }),
    ).toBeVisible()
    await expectNoHorizontalOverflow(professionalPage, 'Approved public professional profile')

    await professionalPage.goto('/profil/professionel')
    await expect(profileStatusCard(professionalPage).getByText('Godkendt og synlig', { exact: true })).toBeVisible()
    await professionalPage.getByLabel('Forventet udbytte 1').fill(revisedOutcome)
    await professionalPage.getByText('Modtag min andel', { exact: true }).click()
    await expect(professionalPage.getByRole('radio', { name: /Modtag min andel/ })).toBeChecked()
    await professionalPage.locator('form button[type="submit"]').click()

    await expect.poll(async () => {
      const row = await loadProfessional(authenticatedAdmin, professionalProfileId)
      return {
        outcomes: row.expected_outcomes,
        payout: row.payout_preference,
        visibility: row.visibility,
        reviewStatus: row.review_status,
        approvedAt: row.approved_at,
      }
    }).toEqual({
      outcomes: [revisedOutcome],
      payout: 'receive',
      visibility: 'published',
      reviewStatus: 'pending',
      approvedAt: null,
    })
    await expect(profileStatusCard(professionalPage).getByText('Indsendt · afventer gennemgang', { exact: true })).toBeVisible()

    const { data: hiddenAfterEdit, error: hiddenAfterEditError } = await publicClient
      .rpc('get_public_professionals', { requested_id: professionalProfileId })
    expect(hiddenAfterEditError).toBeNull()
    expect(hiddenAfterEdit).toEqual([])
  } finally {
    const cleanupAdmin = adminDataClient ?? serviceAdmin
    if (!cleanupAdmin) {
      for (const context of cleanup.contexts) {
        await context.close().catch(() => undefined)
      }
      for (const client of cleanup.dataClients) {
        await signOutDataClient(client).catch(() => undefined)
      }
      throw new Error('Professional profile E2E cleanup could not acquire an admin client.')
    }
    await cleanupTestData(cleanupAdmin, cleanup, {
      serviceAdmin,
      professionalOwnerClient,
      professionalOwnerProfileId,
    })
  }
})
