import type { ProfessionalCard } from './professionals'
import { sessionTypesForFocusAreas } from './sessionTypes'

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
  return professionalSessionTypes(professional)
    .slice(0, 2)
    .map((session) => session.title[locale])
    .join(' · ')
}

export function professionalPrimaryOutput(professional: ProfessionalCard, isDa: boolean) {
  const locale = isDa ? 'da' : 'en'
  return professionalSessionTypes(professional)[0].outcome[locale]
}
