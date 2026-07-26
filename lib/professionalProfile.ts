import { isCategoryArea } from './categories'
import { FOCUS_AREAS, PRICE_OPTIONS, normalizeLinkedInUrl } from './platform'

export const EXPERIENCE_SUMMARY_MAX_LENGTH = 600
export const PROFILE_LIST_ITEM_MAX_LENGTH = 180
export const PROFILE_LIST_MAX_ITEMS = 3
export const REVIEW_FEEDBACK_MAX_LENGTH = 600

export interface ReviewableProfessionalProfile {
  name?: string | null
  title?: string | null
  company?: string | null
  bio?: string | null
  industries?: string[] | null
  focus_areas?: string[] | null
  languages?: string[] | null
  years_experience?: number | null
  price_dkk?: number | null
  linkedin_url?: string | null
  experience_summary?: string | null
  relevant_situations?: string[] | null
  expected_outcomes?: string[] | null
}

export function cleanProfileText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export function cleanProfileList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => cleanProfileText(item, PROFILE_LIST_ITEM_MAX_LENGTH))
    .filter(Boolean)
    .slice(0, PROFILE_LIST_MAX_ITEMS)
}

function hasTextWithin(value: unknown, maximumLength: number, minimumLength = 1): boolean {
  if (typeof value !== 'string') return false
  const length = value.trim().length
  return length >= minimumLength && length <= maximumLength
}

export function professionalProfileMissing(profile: ReviewableProfessionalProfile): string[] {
  const missing: string[] = []
  const situations = cleanProfileList(profile.relevant_situations)
  const outcomes = cleanProfileList(profile.expected_outcomes)
  const industries = Array.isArray(profile.industries) ? profile.industries.filter(isCategoryArea) : []
  const focusAreaIds = new Set<string>(FOCUS_AREAS.map((focusArea) => focusArea.id))
  const focusAreas = Array.isArray(profile.focus_areas)
    ? profile.focus_areas.filter((focusArea) => typeof focusArea === 'string' && focusAreaIds.has(focusArea))
    : []
  const languages = Array.isArray(profile.languages)
    ? profile.languages.filter((language) => language === 'da' || language === 'en')
    : []
  const yearsExperience = Number(profile.years_experience)
  const price = Number(profile.price_dkk)

  if ('name' in profile && (!hasTextWithin(profile.name, 100) || profile.name === 'Navn mangler')) missing.push('navn')
  if (!hasTextWithin(profile.title, 100)) missing.push('titel')
  if (!hasTextWithin(profile.company, 100)) missing.push('virksomhed')
  if (!hasTextWithin(profile.bio, 500)) missing.push('kort bio')
  if (industries.length === 0) missing.push('fagområde')
  if (focusAreas.length === 0 || focusAreas.length !== profile.focus_areas?.length) missing.push('gyldig sessionstype')
  if (languages.length === 0 || languages.length !== profile.languages?.length) missing.push('gyldigt sessionssprog')
  if (!Number.isInteger(yearsExperience) || yearsExperience < 1 || yearsExperience > 50) missing.push('år med erfaring')
  if (!PRICE_OPTIONS.includes(price as typeof PRICE_OPTIONS[number])) missing.push('gyldig pris')
  if (!normalizeLinkedInUrl(profile.linkedin_url)) missing.push('gyldigt LinkedIn-link')
  if (!hasTextWithin(profile.experience_summary, EXPERIENCE_SUMMARY_MAX_LENGTH, 40)) {
    missing.push('erfaringsgrundlag')
  }
  if (situations.length === 0) missing.push('mindst én relevant situation')
  if (outcomes.length === 0) missing.push('mindst ét forventet udbytte')

  return missing
}
