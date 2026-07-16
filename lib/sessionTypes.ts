export type SessionTypeId =
  | 'cv-review'
  | 'application-feedback'
  | 'interview-training'
  | 'case-interview-preparation'
  | 'career-clarity'
  | 'graduate-internship'
  | 'industry-company-insight'

export type SessionLocale = 'da' | 'en'
export type SessionPath = 'explore' | 'prepare' | 'apply' | 'perform'
export type SessionNeed = 'direction' | 'materials' | 'interview' | 'case'

type LocalizedText = Record<SessionLocale, string>
type LocalizedList = Record<SessionLocale, readonly string[]>

export interface SessionTypeDefinition {
  id: SessionTypeId
  path: SessionPath
  need: SessionNeed
  focusArea: string
  professionalFocusAreas: readonly string[]
  title: LocalizedText
  description: LocalizedText
  outcome: LocalizedText
  preparation: LocalizedText
  deliverables: LocalizedList
}

export const SESSION_TYPES = [
  {
    id: 'cv-review',
    path: 'prepare',
    need: 'materials',
    focusArea: 'cv_linkedin',
    professionalFocusAreas: ['cv_linkedin', 'cv_review', 'application_review'],
    title: { da: 'CV-gennemgang', en: 'CV review' },
    description: { da: 'Få dit CV vurderet mod den rolle og branche, du faktisk søger.', en: 'Review your CV against the role and industry you are actually targeting.' },
    outcome: { da: 'Et skarpere CV og en prioriteret liste over de ændringer, der betyder mest.', en: 'A sharper CV and a prioritized list of the changes that matter most.' },
    preparation: { da: 'Del dit CV og gerne et konkret jobopslag.', en: 'Share your CV and, ideally, a relevant job post.' },
    deliverables: { da: ['Klarere profil', 'Prioriterede rettelser', 'Stærkere relevans'], en: ['Clearer profile', 'Prioritized edits', 'Stronger relevance'] },
  },
  {
    id: 'application-feedback',
    path: 'apply',
    need: 'materials',
    focusArea: 'application_review',
    professionalFocusAreas: ['application_review', 'cv_linkedin', 'cv_review'],
    title: { da: 'Ansøgningsfeedback', en: 'Application feedback' },
    description: { da: 'Test argumentation, relevans og tone før du sender ansøgningen.', en: 'Pressure-test the argument, relevance and tone before you submit.' },
    outcome: { da: 'En mere præcis ansøgning med et tydeligere match til rollen.', en: 'A more precise application with a clearer case for your fit.' },
    preparation: { da: 'Del ansøgning, jobopslag og eventuelt CV.', en: 'Share the application, job post and optionally your CV.' },
    deliverables: { da: ['Skarpere motivation', 'Bedre beviser', 'Klarere match'], en: ['Sharper motivation', 'Better evidence', 'Clearer fit'] },
  },
  {
    id: 'interview-training',
    path: 'perform',
    need: 'interview',
    focusArea: 'interview_prep',
    professionalFocusAreas: ['interview_prep', 'mock_interview', 'banking_technicals'],
    title: { da: 'Jobsamtaletræning', en: 'Interview training' },
    description: { da: 'Træn den konkrete samtale med realistiske spørgsmål og direkte feedback.', en: 'Practice the specific interview with realistic questions and direct feedback.' },
    outcome: { da: 'Stærkere svar, roligere levering og en plan for den rigtige samtale.', en: 'Stronger answers, calmer delivery and a plan for the real interview.' },
    preparation: { da: 'Del jobopslag, interviewformat og de spørgsmål, du frygter mest.', en: 'Share the job post, interview format and the questions you worry about most.' },
    deliverables: { da: ['Realistisk træning', 'Konkret feedback', 'Plan til samtalen'], en: ['Realistic practice', 'Concrete feedback', 'Interview plan'] },
  },
  {
    id: 'case-interview-preparation',
    path: 'perform',
    need: 'case',
    focusArea: 'case_prep',
    professionalFocusAreas: ['case_prep', 'consulting_cases', 'banking_technicals', 'pe_investment_case'],
    title: { da: 'Case- og interviewforberedelse', en: 'Case and interview preparation' },
    description: { da: 'Få modspil på struktur, analyse, technicals og kommunikation.', en: 'Pressure-test structure, analysis, technicals and communication.' },
    outcome: { da: 'En tydeligere metode og mere sikker performance under pres.', en: 'A clearer method and more confident performance under pressure.' },
    preparation: { da: 'Del format, case-materiale eller den proces, du forbereder dig til.', en: 'Share the format, case material or process you are preparing for.' },
    deliverables: { da: ['Bedre struktur', 'Skarpere analyse', 'Tydeligere kommunikation'], en: ['Better structure', 'Sharper analysis', 'Clearer communication'] },
  },
  {
    id: 'career-clarity',
    path: 'explore',
    need: 'direction',
    focusArea: 'career_direction',
    professionalFocusAreas: ['career_direction', 'career_strategy', 'career_advice', 'ai_career_strategy'],
    title: { da: 'Karriereafklaring', en: 'Career clarity' },
    description: { da: 'Sammenlign realistiske retninger, fravalg og næste skridt.', en: 'Compare realistic directions, trade-offs and next steps.' },
    outcome: { da: 'Et klarere valg og en konkret plan for, hvad du skal undersøge eller gøre nu.', en: 'A clearer decision and a concrete plan for what to explore or do next.' },
    preparation: { da: 'Beskriv de muligheder, du overvejer, og hvad der gør valget svært.', en: 'Describe the options you are considering and what makes the choice difficult.' },
    deliverables: { da: ['Realistiske spor', 'Tydelige fravalg', 'Næste handling'], en: ['Realistic paths', 'Clear trade-offs', 'Next action'] },
  },
  {
    id: 'graduate-internship',
    path: 'prepare',
    need: 'direction',
    focusArea: 'graduate_internship',
    professionalFocusAreas: ['graduate_internship', 'career_direction', 'industry_insight', 'application_review'],
    title: { da: 'Graduate- og internship-rådgivning', en: 'Graduate and internship guidance' },
    description: { da: 'Få styr på programmer, timing, positionering og en realistisk vej ind.', en: 'Clarify programs, timing, positioning and a realistic route in.' },
    outcome: { da: 'En prioriteret strategi for graduate-programmer eller internships.', en: 'A prioritized strategy for graduate programs or internships.' },
    preparation: { da: 'Del relevante programmer, deadlines og din nuværende profil.', en: 'Share relevant programs, deadlines and your current profile.' },
    deliverables: { da: ['Prioriterede programmer', 'Stærkere positionering', 'Klar tidsplan'], en: ['Prioritized programs', 'Stronger positioning', 'Clear timeline'] },
  },
  {
    id: 'industry-company-insight',
    path: 'explore',
    need: 'direction',
    focusArea: 'industry_insight',
    professionalFocusAreas: ['industry_insight', 'ai_career_strategy', 'career_direction'],
    title: { da: 'Branche- og virksomhedsindsigt', en: 'Industry and company insight' },
    description: { da: 'Forstå arbejdet, kulturen og rekrutteringen bag jobopslaget.', en: 'Understand the work, culture and hiring reality behind the job post.' },
    outcome: { da: 'Et ærligt billede af hverdagen, forventningerne og dit potentielle match.', en: 'An honest view of the work, expectations and your potential fit.' },
    preparation: { da: 'Del rolle, virksomhed eller branche og dine vigtigste spørgsmål.', en: 'Share the role, company or industry and your most important questions.' },
    deliverables: { da: ['Reel arbejdshverdag', 'Kultur og forventninger', 'Bedre beslutningsgrundlag'], en: ['Real working context', 'Culture and expectations', 'Better decision basis'] },
  },
] as const satisfies readonly SessionTypeDefinition[]

export const SESSION_TYPE_IDS = SESSION_TYPES.map((session) => session.id) as readonly SessionTypeId[]
const CANONICAL_FOCUS_AREA_IDS = new Set<string>(SESSION_TYPES.map((session) => session.focusArea))

export function isSessionTypeId(value: unknown): value is SessionTypeId {
  return typeof value === 'string' && SESSION_TYPE_IDS.includes(value as SessionTypeId)
}

export function sessionType(id: SessionTypeId) {
  return SESSION_TYPES.find((session) => session.id === id)!
}

export function sessionTypesForFocusAreas(focusAreas: readonly string[]) {
  const hasCanonicalSelection = focusAreas.some((focus) => CANONICAL_FOCUS_AREA_IDS.has(focus))
  if (hasCanonicalSelection) {
    return SESSION_TYPES.filter((session) => focusAreas.includes(session.focusArea))
  }

  const legacyMatches = SESSION_TYPES.filter((session) => session.professionalFocusAreas.some((focus) => focusAreas.includes(focus)))
  return legacyMatches.length > 0 ? legacyMatches : SESSION_TYPES
}
