import type { ProfessionalCard } from './professionals'
import { sessionTypesForFocusAreas } from './sessionTypes'

const SENIORITY_LABELS: Record<string, { da: string; en: string }> = {
  specialist: { da: 'Specialist', en: 'Specialist' },
  manager: { da: 'Manager', en: 'Manager' },
  director: { da: 'Director', en: 'Director' },
  executive: { da: 'Ledelsesniveau', en: 'Executive' },
}

const LANGUAGE_LABELS: Record<string, { da: string; en: string }> = {
  da: { da: 'Dansk', en: 'Danish' },
  en: { da: 'Engelsk', en: 'English' },
}

export function professionalInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

export function professionalSessionTypes(professional: ProfessionalCard) {
  return sessionTypesForFocusAreas(professional.focus_areas ?? [])
}

export function professionalBestFor(professional: ProfessionalCard, isDa: boolean) {
  const locale = isDa ? 'da' : 'en'
  const labels = professionalSessionTypes(professional)
    .slice(0, 2)
    .map((session) => session.title[locale])
  return labels.join(' · ') || (isDa ? 'En konkret professionel situation' : 'A specific professional situation')
}

export function professionalPrimaryOutput(professional: ProfessionalCard, isDa: boolean) {
  const locale = isDa ? 'da' : 'en'
  return professionalSessionTypes(professional)[0]?.outcome[locale]
    ?? (isDa ? 'Et konkret og prioriteret næste skridt.' : 'A concrete and prioritized next step.')
}

export function professionalSeniorityLabel(seniority: string | null, isDa: boolean) {
  if (!seniority) return null
  const locale = isDa ? 'da' : 'en'
  return SENIORITY_LABELS[seniority]?.[locale] ?? seniority
}

export function professionalLanguageLabels(languages: readonly string[], isDa: boolean) {
  const locale = isDa ? 'da' : 'en'
  return languages.map((language) => LANGUAGE_LABELS[language.toLowerCase()]?.[locale] ?? language.toUpperCase())
}

export function professionalExperienceFacts(professional: ProfessionalCard, isDa: boolean) {
  const facts: string[] = []
  const seniority = professionalSeniorityLabel(professional.seniority, isDa)

  if (professional.yearsExperience !== null) {
    facts.push(isDa
      ? `${professional.yearsExperience} års erfaring`
      : `${professional.yearsExperience} ${professional.yearsExperience === 1 ? 'year' : 'years'} of experience`)
  }
  if (seniority) facts.push(seniority)

  return facts
}

export function professionalResponseLabel(hours: number | null, isDa: boolean) {
  if (hours === null) return null
  if (hours < 24) return isDa ? `Svarer normalt inden for ${hours} timer` : `Usually responds within ${hours} hours`

  const days = Math.max(1, Math.round(hours / 24))
  return isDa
    ? `Svarer normalt inden for ${days} ${days === 1 ? 'dag' : 'dage'}`
    : `Usually responds within ${days} ${days === 1 ? 'day' : 'days'}`
}

export function professionalExperienceLead(professional: ProfessionalCard, isDa: boolean) {
  const bio = professional.bio.trim()
  if (bio) {
    const firstSentence = bio.match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim()
    if (firstSentence && firstSentence.length >= 45) return firstSentence
    if (bio.length <= 230) return bio
    return `${bio.slice(0, 227).trimEnd()}…`
  }

  const role = [professional.title, professional.company].filter(Boolean).join(isDa ? ' hos ' : ' at ')
  return isDa
    ? `Direkte erfaring fra ${role || 'den relevante rolle og branche'}.`
    : `Direct experience from ${role || 'the relevant role and industry'}.`
}
