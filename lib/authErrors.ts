export function accountErrorMessage(error: unknown, fallback = 'Handlingen kunne ikke gennemføres. Prøv igen.') {
  const message = error instanceof Error
    ? error.message
    : typeof error === 'object' && error && 'message' in error
      ? String(error.message)
      : ''

  if (/fetch|network|failed to fetch/i.test(message)) return 'Naetwork kan ikke oprette forbindelse lige nu. Prøv igen lidt senere.'
  if (/already registered|already exists|user already/i.test(message)) return 'Der findes allerede en konto med denne e-mail. Prøv at logge ind.'
  if (/rate limit|too many requests|email rate/i.test(message)) return 'Der er sendt flere anmodninger på kort tid. Vent et øjeblik, og prøv igen.'
  if (/password/i.test(message)) return 'Adgangskoden opfylder ikke sikkerhedskravene. Brug mindst 8 tegn.'
  if (/invalid email|email.*invalid/i.test(message)) return 'Indtast en gyldig e-mailadresse.'
  return fallback
}
