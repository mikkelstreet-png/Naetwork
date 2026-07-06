import { readFile } from 'node:fs/promises'

const files = [
  'lib/platform.ts',
  'lib/constants.ts',
  'lib/content.ts',
  'lib/fieldGuides.ts',
  'components/HomeContent.tsx',
  'components/Navbar.tsx',
  'components/Footer.tsx',
  'components/ImpactContent.tsx',
  'components/BookingDrawer.tsx',
  'components/AdminShell.tsx',
  'app/contact/page.tsx',
  'app/auth/callback/route.ts',
  'app/api/bookings/route.ts',
  'lib/server/readiness.ts',
  'scripts/preflight.mjs',
  'app/professionals/page.tsx',
  'app/professionals/[id]/page.tsx',
  'app/professional/signup/page.tsx',
  'app/profil/professionel/page.tsx',
  'app/terms/page.tsx',
  'app/privacy/page.tsx',
  'app/cookies/page.tsx',
  'supabase/migrations/006_legal_release_gates.sql',
  'supabase/migrations/007_data_retention.sql',
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
]

const errors = forbidden.filter(([, pattern]) => pattern.test(corpus)).map(([label]) => `Forbidden content: ${label}`)

const required = [
  ['lib/platform.ts', /export const PRICE_MIN = 600/],
  ['lib/platform.ts', /export const PRICE_MAX = 1800/],
  ['lib/platform.ts', /export const CONTRIBUTION_MIN = 40/],
  ['lib/platform.ts', /export const CONTRIBUTION_MAX = 90/],
  ['app/terms/page.tsx', /14 dages fortrydelsesret/],
  ['app/terms/page.tsx', /ikke officielt tilknyttet/],
  ['app/terms/page.tsx', /aftaler, tilladelser, regnskabsprocesser og dokumentationskrav/],
  ['supabase/migrations/006_legal_release_gates.sql', /Indsamling gennem salg og aftalegrundlag/],
  ['supabase/migrations/007_data_retention.sql', /run_data_retention/],
  ['app/privacy/page.tsx', /behandlingsgrundlag/i],
  ['app/privacy/page.tsx', /Overførsler uden for EU\/EØS/],
  ['app/privacy/page.tsx', /Opbevaring og sletning/],
  ['app/cookies/page.tsx', /Kun nødvendige teknologier/],
  ['components/BookingDrawer.tsx', /authState === 'error'/],
  ['components/AdminShell.tsx', /Administration/],
  ['app/admin/payments/page.tsx', /Ingen betalinger kan gennemføres/],
  ['lib/server/readiness.ts', /hasValidLegalIdentity/],
  ['scripts/preflight.mjs', /8-digit CVR number/],
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
