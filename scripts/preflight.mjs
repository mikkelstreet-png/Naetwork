const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_APP_URL',
  'APP_BASE_URL',
  'NEXT_PUBLIC_LEGAL_NAME',
  'NEXT_PUBLIC_LEGAL_ADDRESS',
  'NEXT_PUBLIC_LEGAL_REGISTRATION',
  'SUPPORT_EMAIL',
]

const missing = required.filter((name) => !process.env[name]?.trim())
const errors = []
const placeholder = /^(?:pending|todo|tbd|build-check|copenhagen|example)$/i

for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_APP_URL', 'APP_BASE_URL']) {
  const value = process.env[name]
  if (!value) continue
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') errors.push(`${name} must use https`)
  } catch {
    errors.push(`${name} must be a valid absolute URL`)
  }
}

if (
  process.env.NEXT_PUBLIC_APP_URL &&
  process.env.APP_BASE_URL &&
  process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '') !== process.env.APP_BASE_URL.replace(/\/$/, '')
) {
  errors.push('NEXT_PUBLIC_APP_URL and APP_BASE_URL must point to the same canonical origin')
}

for (const name of ['NEXT_PUBLIC_LEGAL_NAME', 'NEXT_PUBLIC_LEGAL_ADDRESS', 'NEXT_PUBLIC_LEGAL_REGISTRATION']) {
  const value = process.env[name]?.trim()
  if (value && placeholder.test(value)) errors.push(`${name} must not be a placeholder`)
}

if (process.env.NEXT_PUBLIC_LEGAL_ADDRESS && !/\d/.test(process.env.NEXT_PUBLIC_LEGAL_ADDRESS)) {
  errors.push('NEXT_PUBLIC_LEGAL_ADDRESS must include a complete street address')
}

if (process.env.NEXT_PUBLIC_LEGAL_REGISTRATION && !/\d{8}/.test(process.env.NEXT_PUBLIC_LEGAL_REGISTRATION.replace(/\s/g, ''))) {
  errors.push('NEXT_PUBLIC_LEGAL_REGISTRATION must include an 8-digit CVR number')
}

if (process.env.SUPPORT_EMAIL && !/^\S+@\S+\.\S+$/.test(process.env.SUPPORT_EMAIL)) {
  errors.push('SUPPORT_EMAIL must be a valid email address')
}

if (missing.length || errors.length) {
  console.error('Release preflight failed.')
  if (missing.length) console.error(`Missing: ${missing.join(', ')}`)
  for (const error of errors) console.error(`Invalid: ${error}`)
  process.exit(1)
}

console.log('Core release configuration is valid.')
console.log(`Transactional email: ${process.env.RESEND_API_KEY && process.env.EMAIL_FROM ? 'configured' : 'pending (allowed)'}`)
console.log('Payments: disabled (allowed)')
