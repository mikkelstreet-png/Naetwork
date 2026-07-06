import 'server-only'

const PLACEHOLDER = /^(?:pending|todo|tbd|build-check|copenhagen|example)$/i

export function hasMeaningfulValue(value: string | undefined) {
  return Boolean(value?.trim() && !PLACEHOLDER.test(value.trim()))
}

export function isValidEmail(value: string | undefined) {
  return Boolean(value && /^\S+@\S+\.\S+$/.test(value))
}

export function hasValidLegalIdentity() {
  const name = process.env.NEXT_PUBLIC_LEGAL_NAME?.trim()
  const address = process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim()
  const registration = process.env.NEXT_PUBLIC_LEGAL_REGISTRATION?.trim()
  return hasMeaningfulValue(name)
    && hasMeaningfulValue(address)
    && hasMeaningfulValue(registration)
    && /\d/.test(address ?? '')
    && /\d{8}/.test((registration ?? '').replace(/\s/g, ''))
}
