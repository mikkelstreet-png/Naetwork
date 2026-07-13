import type { ProfessionalCard } from './professionals'

export function professionalInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

export function professionalBestFor(professional: ProfessionalCard, isDa: boolean) {
  const focus = professional.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Investment case og PE-interview' : 'PE / investment case'
  if (focus.includes('banking_technicals')) return isDa ? 'Tekniske spørgsmål og Banking-interview' : 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Cases og personligt interview' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-roller og positionering' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Ansøgning og profil' : 'Applications'
  return isDa ? 'Karriereretning' : 'Career clarity'
}

export function professionalPrimaryOutput(professional: ProfessionalCard, isDa: boolean) {
  const focus = professional.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Skarpere investeringsvurdering' : 'Investment case and deal thinking'
  if (focus.includes('banking_technicals')) return isDa ? 'Teknisk sikkerhed og interviewklarhed' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og personlig kommunikation' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}
