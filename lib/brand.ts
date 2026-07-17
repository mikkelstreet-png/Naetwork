import { SESSION_TYPES, type SessionTypeId } from './sessionTypes'

export type BrandLocale = 'da' | 'en'
export type AccessPathId = 'explore' | 'prepare' | 'apply' | 'perform'
export type SituationId = 'role' | 'company' | 'job' | 'cv' | 'interview' | 'case' | 'pivot' | 'direction' | 'graduate' | 'offer'
export type DirectoryNeed = 'direction' | 'materials' | 'interview' | 'case'

type LocalizedText = Record<BrandLocale, string>

export const BRAND_COPY = {
  da: {
    category: 'Den professionelle adgangsplatform',
    primaryLine: 'Få adgang til det, andre får gennem deres netværk.',
    productLine: 'Relevant erfaring, når den betyder mest.',
    positioning: 'Naetwork gør professionel erfaring og dømmekraft tilgængelig, når du står over for et vigtigt karriereskridt.',
    oneSentence: 'Book 60 minutter med en professionel, der kender rollen, branchen eller processen indefra, og brug erfaringen til at træffe og gennemføre et stærkere næste skridt.',
    problem: 'Potentiale findes overalt. Adgang til relevant professionel erfaring gør ikke.',
  },
  en: {
    category: 'The professional access platform',
    primaryLine: 'Access what others get through their network.',
    productLine: 'Relevant experience when it matters most.',
    positioning: 'Naetwork makes professional experience and judgment available when you face an important career move.',
    oneSentence: 'Book 60 minutes with a professional who knows the role, industry or process from within and use that experience to make and execute a stronger next move.',
    problem: 'Potential is everywhere. Access to relevant professional experience is not.',
  },
} as const

export const PRIMARY_NAV_ITEMS = [
  { href: '/#why-access', label: { da: 'Hvorfor adgang?', en: 'Why access?' } },
  { href: '/#needs', label: { da: 'Hvad står du overfor?', en: 'What are you facing?' } },
  { href: '/#how-it-works', label: { da: '60-minutters sessionen', en: 'The 60-minute session' } },
  { href: '/professionals', label: { da: 'Find erfaring', en: 'Find experience' } },
] as const satisfies ReadonlyArray<{ href: string; label: LocalizedText }>

export const ACCESS_PATHS = [
  {
    id: 'explore',
    href: '/explore',
    label: { da: 'Udforsk', en: 'Explore' },
    title: { da: 'Forstå rollen, før du vælger den.', en: 'Understand the role before you choose it.' },
    description: {
      da: 'Få et ærligt billede af arbejdet, virksomheden og de reelle forventninger.',
      en: 'Get an honest view of the work, company and real expectations.',
    },
  },
  {
    id: 'prepare',
    href: '/prepare',
    label: { da: 'Forbered', en: 'Prepare' },
    title: { da: 'Styrk dit grundlag, før du går videre.', en: 'Strengthen your position before you move.' },
    description: {
      da: 'Få konkret feedback på dit CV, dit udgangspunkt eller et planlagt karriereskift.',
      en: 'Get concrete feedback on your CV, current position or planned career change.',
    },
  },
  {
    id: 'apply',
    href: '/apply',
    label: { da: 'Søg', en: 'Apply' },
    title: { da: 'Søg med et skarpere argument.', en: 'Apply with a sharper case.' },
    description: {
      da: 'Vurdér dit match, og målret ansøgningen mod det, der faktisk betyder noget.',
      en: 'Assess your fit and focus the application on what actually matters.',
    },
  },
  {
    id: 'perform',
    href: '/perform',
    label: { da: 'Stå stærkt', en: 'Perform' },
    title: { da: 'Vær klar, når det gælder.', en: 'Be ready when it matters.' },
    description: {
      da: 'Forbered interview, case, forhandling eller vurderingen af et jobtilbud.',
      en: 'Prepare for an interview, case, negotiation or offer review.',
    },
  },
] as const satisfies ReadonlyArray<{
  id: AccessPathId
  href: string
  label: LocalizedText
  title: LocalizedText
  description: LocalizedText
}>

export const ACCESS_SITUATIONS = [
  {
    id: 'role',
    path: 'explore',
    need: 'direction',
    sessionType: 'industry-company-insight',
    label: { da: 'Jeg overvejer en bestemt rolle', en: 'I am considering a role' },
    result: { da: 'Forstå hverdagen, forventningerne og de reelle kompromiser.', en: 'Understand the work, expectations and real trade-offs.' },
  },
  {
    id: 'company',
    path: 'explore',
    need: 'direction',
    sessionType: 'industry-company-insight',
    label: { da: 'Jeg vil forstå en virksomhed', en: 'I want to understand a company' },
    result: { da: 'Få relevant kontekst om arbejdsform, kultur og rekruttering.', en: 'Get relevant context on ways of working, culture and hiring.' },
  },
  {
    id: 'job',
    path: 'apply',
    need: 'materials',
    sessionType: 'application-feedback',
    label: { da: 'Jeg vil søge et konkret job', en: 'I want to apply for a specific job' },
    result: { da: 'Vurdér dit match og prioritér de vigtigste ændringer før ansøgning.', en: 'Assess your fit and prioritize the changes that matter before applying.' },
  },
  {
    id: 'cv',
    path: 'prepare',
    need: 'materials',
    sessionType: 'cv-review',
    label: { da: 'Jeg vil have vurderet mit CV', en: 'I want an honest review of my CV' },
    result: { da: 'Se hvad der står stærkt, hvad der er uklart, og hvad der bør ændres.', en: 'See what is strong, what is unclear and what should change.' },
  },
  {
    id: 'interview',
    path: 'perform',
    need: 'interview',
    sessionType: 'interview-training',
    label: { da: 'Jeg har en jobsamtale', en: 'I have an interview' },
    result: { da: 'Træn den konkrete samtale mod relevante forventninger.', en: 'Prepare for the specific interview against relevant expectations.' },
  },
  {
    id: 'case',
    path: 'perform',
    need: 'case',
    sessionType: 'case-interview-preparation',
    label: { da: 'Jeg skal forberede en case eller technicals', en: 'I need to prepare a case or technicals' },
    result: { da: 'Træn struktur, analyse og kommunikation mod det konkrete format.', en: 'Practice structure, analysis and communication for the specific format.' },
  },
  {
    id: 'pivot',
    path: 'prepare',
    need: 'direction',
    sessionType: 'career-clarity',
    label: { da: 'Jeg vil skifte branche eller funktion', en: 'I am changing industry or function' },
    result: { da: 'Afklar overførbare styrker, reelle barrierer og realistiske mellemtrin.', en: 'Clarify transferable strengths, real barriers and credible intermediate moves.' },
  },
  {
    id: 'direction',
    path: 'explore',
    need: 'direction',
    sessionType: 'career-clarity',
    label: { da: 'Jeg er usikker på mit næste skridt', en: 'I am unsure about my next move' },
    result: { da: 'Sammenlign realistiske retninger og beslut, hvad du bør undersøge nu.', en: 'Compare realistic directions and decide what to investigate next.' },
  },
  {
    id: 'graduate',
    path: 'prepare',
    need: 'direction',
    sessionType: 'graduate-internship',
    label: { da: 'Jeg søger graduate-program eller internship', en: 'I am targeting a graduate program or internship' },
    result: { da: 'Prioritér programmer, timing og en troværdig vej ind.', en: 'Prioritize programs, timing and a credible route in.' },
  },
  {
    id: 'offer',
    path: 'perform',
    need: 'interview',
    sessionType: 'career-clarity',
    label: { da: 'Jeg har modtaget et jobtilbud', en: 'I have received a job offer' },
    result: { da: 'Vurdér rolle, mandat, vilkår, risici og langsigtet karriereværdi.', en: 'Assess the role, mandate, terms, risks and long-term career value.' },
  },
] as const satisfies ReadonlyArray<{
  id: SituationId
  path: AccessPathId
  need: DirectoryNeed
  sessionType: SessionTypeId
  label: LocalizedText
  result: LocalizedText
}>

export const SESSION_CONCEPTS = SESSION_TYPES

export function localized(text: LocalizedText, locale: BrandLocale) {
  return text[locale]
}

export function accessPath(pathId: AccessPathId) {
  return ACCESS_PATHS.find((path) => path.id === pathId)!
}

export function situation(situationId: SituationId) {
  return ACCESS_SITUATIONS.find((item) => item.id === situationId)!
}
