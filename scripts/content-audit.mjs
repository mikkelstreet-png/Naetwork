import { readFile } from 'node:fs/promises'

const files = [
  'lib/platform.ts',
  'lib/brand.ts',
  'lib/legal.ts',
  'lib/constants.ts',
  'lib/fieldGuides.ts',
  'components/HomeContent.tsx',
  'components/SituationStartContent.tsx',
  'components/HowItWorksContent.tsx',
  'components/SessionsContent.tsx',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/ImpactContent.tsx',
  'components/BookingDrawer.tsx',
  'components/AdminShell.tsx',
  'components/ProfessionalsDirectory.tsx',
  'app/contact/page.tsx',
  'app/auth/callback/route.ts',
  'app/api/bookings/route.ts',
  'lib/server/readiness.ts',
  'scripts/preflight.mjs',
  'app/professionals/page.tsx',
  'app/professionals/[id]/page.tsx',
  'app/start/page.tsx',
  'app/how-it-works/page.tsx',
  'app/sessions/page.tsx',
  'app/professional/signup/page.tsx',
  'app/profil/page.tsx',
  'app/profil/professionel/page.tsx',
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'app/cookies/page.tsx',
  'supabase/migrations/006_legal_release_gates.sql',
  'supabase/migrations/007_data_retention.sql',
  'supabase/migrations/008_consent_and_price_integrity.sql',
  'supabase/migrations/009_pricing_and_contribution_integrity.sql',
  'supabase/migrations/010_marketing_consent_audit.sql',
  'supabase/migrations/012_fixed_session_revenue_split.sql',
  'app/admin/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/professionals/page.tsx',
  'app/admin/bookings/page.tsx',
  'app/admin/contact/page.tsx',
  'app/admin/legal/page.tsx',
  'app/admin/payments/page.tsx',
  'app/admin/system/page.tsx',
]

const contents = Object.fromEntries(await Promise.all(files.map(async (file) => [file, await readFile(file, 'utf8')])))
const corpus = Object.values(contents).join('\n')
const productCorpus = Object.entries(contents)
  .filter(([file]) => !file.startsWith('supabase/migrations/'))
  .map(([, content]) => content)
  .join('\n')

const forbidden = [
  ['legacy minimum price', /PRICE_MIN\s*=\s*300\b/],
  ['legacy maximum price', /PRICE_MAX\s*=\s*2000\b/],
  ['ASCII charity placeholder', /Kraeftens Bekaempelse/],
  ['mixed application label', /Ansøgning Application Review/],
  ['mixed career label', /Karriereretning Career Direction/],
  ['unfinished impact promise', /Når platformen modnes/],
  ['invalid Tailwind opacity', /bg-white\/94\b/],
  ['legacy indigo admin theme', /(?:bg|text|border|ring)-indigo-/],
  ['incorrect contact consent wording', /Ved at sende formularen accepterer du/],
  ['privacy policy framed as consent', /accepterer Naetworks[^\n]{0,120}privatlivspolitik/i],
  ['misleading contribution certainty', /Minimum 40% af hver betalt session går til/],
  ['unsupported identity verification claim', /gennemgår identitet/i],
  ['outdated legal date', /7\. juli 2026|2026[-]07[-]07/],
  ['overstated contribution in social image', new RegExp('Minimum 40% til Kræftens ' + 'Bekæmpelse')],
  ['legacy browse-first homepage CTA', /Find den rette professionelle/],
  ['legacy match route in public navigation', /href=["']\/match/],
]

const errors = forbidden.filter(([, pattern]) => pattern.test(corpus)).map(([label]) => `Forbidden content: ${label}`)

const productForbidden = [
  ['legacy variable contribution range', /40-90%|40%, 60%, 80%|40% · 60% · 80% · 90%/],
  ['legacy fixed platform fee', /DKK 49|fast gebyr pr\. gennemført session/i],
]

errors.push(...productForbidden.filter(([, pattern]) => pattern.test(productCorpus)).map(([label]) => `Forbidden product content: ${label}`))

const required = [
  ['lib/platform.ts', /export const PRICE_MIN = 600/],
  ['lib/platform.ts', /export const PRICE_MAX = 1800/],
  ['lib/platform.ts', /export const PRICE_OPTIONS = \[600, 900, 1200, 1800\]/],
  ['lib/platform.ts', /export const PLATFORM_SHARE_PERCENT = 20/],
  ['lib/platform.ts', /export const CONTRIBUTION_PERCENT = 30/],
  ['lib/platform.ts', /export const PROFESSIONAL_SHARE_PERCENT = 50/],
  ['lib/brand.ts', /category: 'Career Access'/],
  ['lib/brand.ts', /primaryLine: 'Talent is widely distributed\. Access is not\.'/],
  ['lib/brand.ts', /primaryLine: 'Talent er bredt fordelt\. Adgang er det ikke\.'/],
  ['lib/brand.ts', /positioning: 'Relevant experience for real career decisions\.'/],
  ['lib/brand.ts', /id: 'explore'/],
  ['lib/brand.ts', /id: 'perform'/],
  ['lib/legal.ts', /export const LEGAL_OPERATOR/],
  ['lib/legal.ts', /export const LEGAL_UPDATED_ISO = '2026-07-13'/],
  ['app/terms/page.tsx', /14 dages fortrydelsesret/],
  ['app/terms/page.tsx', /ikke officielt tilknyttet/],
  ['app/terms/page.tsx', /aftaler, tilladelser, regnskabsprocesser og dokumentationskrav/],
  ['supabase/migrations/006_legal_release_gates.sql', /Indsamling gennem salg og aftalegrundlag/],
  ['supabase/migrations/007_data_retention.sql', /run_data_retention/],
  ['supabase/migrations/008_consent_and_price_integrity.sql', /privacy_noticed_at/],
  ['supabase/migrations/008_consent_and_price_integrity.sql', /price_dkk IN \(600, 900, 1200, 1800\)/],
  ['supabase/migrations/012_fixed_session_revenue_split.sql', /contribution_percent = 30/],
  ['supabase/migrations/012_fixed_session_revenue_split.sql', /platform_share_percent = 20/],
  ['supabase/migrations/012_fixed_session_revenue_split.sql', /professional_share_percent = 50/],
  ['supabase/migrations/010_marketing_consent_audit.sql', /marketing_consent_events/],
  ['supabase/migrations/010_marketing_consent_audit.sql', /profiles_marketing_consent_evidence/],
  ['app/profil/page.tsx', /marketing_consent_at/],
  ['app/privacy/page.tsx', /ændringshistorik for et eventuelt markedsføringssamtykke/],
  ['app/terms/page.tsx', /sessionsprisen eksklusive moms/],
  ['app/privacy/page.tsx', /behandlingsgrundlag/i],
  ['app/privacy/page.tsx', /Overførsler uden for EU\/EØS/],
  ['app/privacy/page.tsx', /Opbevaring og sletning/],
  ['app/cookies/page.tsx', /Kun nødvendige teknologier/],
  ['components/BookingDrawer.tsx', /authState === 'error'/],
  ['components/BookingDrawer.tsx', /goal\.length < 20|sessionGoal\.trim\(\)\.length < 20/],
  ['components/AdminShell.tsx', /Administration/],
  ['app/admin/payments/page.tsx', /Ingen betalinger kan gennemføres/],
  ['lib/server/readiness.ts', /hasValidLegalIdentity/],
  ['scripts/preflight.mjs', /8-digit CVR number/],
  ['app/professionals/page.tsx', /initialProfessionals/],
  ['components/HomeContent.tsx', /<main>/],
  ['components/HomeContent.tsx', /href="\/start"/],
  ['components/HomeContent.tsx', /DKK 96 til Naetwork, DKK 144 til Kræftens Bekæmpelse og DKK 240 til den professionelle/],
  ['components/Navbar.tsx', /Start med din situation/],
  ['components/SituationStartContent.tsx', /Hvad står du overfor/],
  ['app/start/page.tsx', /Start med din karrieresituation/],
]

for (const [file, pattern] of required) {
  if (!pattern.test(contents[file])) errors.push(`Missing release disclosure in ${file}: ${pattern}`)
}

if (errors.length) {
  console.error('Content audit failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Content audit passed across ${files.length} critical files.`)
