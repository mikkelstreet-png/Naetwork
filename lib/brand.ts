export type BrandLocale = 'da' | 'en'
export type AccessPathId = 'explore' | 'prepare' | 'apply' | 'perform'
export type SituationId = 'role' | 'company' | 'job' | 'cv' | 'interview' | 'pivot' | 'direction' | 'offer'
export type DirectoryNeed = 'direction' | 'materials' | 'interview' | 'case'

type LocalizedText = Record<BrandLocale, string>

export const BRAND_COPY = {
  da: {
    category: 'Career Access',
    primaryLine: 'Vid mere, før dit næste træk.',
    productLine: 'Mød en, der kender jobbet, før du søger.',
    positioning: 'Adgangslaget bag bedre karrierevalg.',
    oneSentence: 'Naetwork giver dig adgang til relevant erfaring bag de roller, virksomheder og karriereveje, du overvejer.',
    problem: 'Den mest nyttige karriereviden står sjældent i et jobopslag. Den findes hos mennesker, der har udført arbejdet.',
  },
  en: {
    category: 'Career Access',
    primaryLine: 'Know more before your next move.',
    productLine: 'Meet someone who knows the job before you apply.',
    positioning: 'The access layer behind better career decisions.',
    oneSentence: 'Naetwork gives you access to relevant experience behind the roles, companies and career paths you are considering.',
    problem: 'The most useful career knowledge rarely sits in a job description. It sits with people who have done the work.',
  },
} as const

export const PRIMARY_NAV_ITEMS = [
  { href: '/how-it-works', label: { da: 'Sådan fungerer det', en: 'How it works' } },
  { href: '/sessions', label: { da: 'Sessioner', en: 'Sessions' } },
  { href: '/professional/signup', label: { da: 'For professionelle', en: 'For professionals' } },
  { href: '/impact', label: { da: 'Bidrag', en: 'Impact' } },
] as const satisfies ReadonlyArray<{ href: string; label: LocalizedText }>

export const ACCESS_PATHS = [
  {
    id: 'explore',
    href: '/explore',
    label: { da: 'Explore', en: 'Explore' },
    title: { da: 'Forstå arbejdet, før du forfølger det.', en: 'Understand the work before you pursue it.' },
    description: {
      da: 'Til dig, der undersøger en rolle, virksomhed, branche eller karrierevej.',
      en: 'For decisions about a role, company, industry or career path.',
    },
  },
  {
    id: 'prepare',
    href: '/prepare',
    label: { da: 'Prepare', en: 'Prepare' },
    title: { da: 'Se klart, hvor du står.', en: 'Get an honest view of where you stand.' },
    description: {
      da: 'Til dig, der vil styrke dit materiale, vurdere dit udgangspunkt eller planlægge et karriereskift.',
      en: 'For strengthening your materials, assessing your position or planning a career change.',
    },
  },
  {
    id: 'apply',
    href: '/apply',
    label: { da: 'Apply', en: 'Apply' },
    title: { da: 'Gør den konkrete ansøgning stærkere.', en: 'Make the specific application stronger.' },
    description: {
      da: 'Til dig, der overvejer eller søger en bestemt stilling.',
      en: 'For deciding whether to pursue a specific role and how to position your application.',
    },
  },
  {
    id: 'perform',
    href: '/perform',
    label: { da: 'Perform', en: 'Perform' },
    title: { da: 'Forbered det øjeblik, der tæller.', en: 'Prepare for the moment that matters.' },
    description: {
      da: 'Til dig, der står foran interview, case, forhandling eller et jobtilbud.',
      en: 'For an interview, case, negotiation or job offer.',
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
    label: { da: 'Jeg overvejer en bestemt rolle', en: 'I am considering a role' },
    result: { da: 'Forstå hverdagen, forventningerne og de reelle kompromiser.', en: 'Understand the work, expectations and real trade-offs.' },
  },
  {
    id: 'company',
    path: 'explore',
    need: 'direction',
    label: { da: 'Jeg vil forstå en virksomhed', en: 'I want to understand a company' },
    result: { da: 'Få relevant kontekst om arbejdsform, kultur og rekruttering.', en: 'Get relevant context on ways of working, culture and hiring.' },
  },
  {
    id: 'job',
    path: 'apply',
    need: 'materials',
    label: { da: 'Jeg vil søge et konkret job', en: 'I want to apply for a specific job' },
    result: { da: 'Vurdér dit match og prioritér de vigtigste ændringer før ansøgning.', en: 'Assess your fit and prioritize the changes that matter before applying.' },
  },
  {
    id: 'cv',
    path: 'prepare',
    need: 'materials',
    label: { da: 'Jeg vil have vurderet mit CV', en: 'I want an honest review of my CV' },
    result: { da: 'Se hvad der står stærkt, hvad der er uklart, og hvad der bør ændres.', en: 'See what is strong, what is unclear and what should change.' },
  },
  {
    id: 'interview',
    path: 'perform',
    need: 'interview',
    label: { da: 'Jeg har en jobsamtale', en: 'I have an interview' },
    result: { da: 'Træn den konkrete samtale mod relevante forventninger.', en: 'Prepare for the specific interview against relevant expectations.' },
  },
  {
    id: 'pivot',
    path: 'prepare',
    need: 'direction',
    label: { da: 'Jeg vil skifte branche eller funktion', en: 'I am changing industry or function' },
    result: { da: 'Afklar overførbare styrker, reelle barrierer og realistiske mellemtrin.', en: 'Clarify transferable strengths, real barriers and credible intermediate moves.' },
  },
  {
    id: 'direction',
    path: 'explore',
    need: 'direction',
    label: { da: 'Jeg er usikker på mit næste skridt', en: 'I am unsure about my next move' },
    result: { da: 'Sammenlign realistiske retninger og beslut, hvad du bør undersøge nu.', en: 'Compare realistic directions and decide what to investigate next.' },
  },
  {
    id: 'offer',
    path: 'perform',
    need: 'interview',
    label: { da: 'Jeg har modtaget et jobtilbud', en: 'I have received a job offer' },
    result: { da: 'Vurdér rolle, mandat, vilkår, risici og langsigtet karriereværdi.', en: 'Assess the role, mandate, terms, risks and long-term career value.' },
  },
] as const satisfies ReadonlyArray<{
  id: SituationId
  path: AccessPathId
  need: DirectoryNeed
  label: LocalizedText
  result: LocalizedText
}>

export const SESSION_CONCEPTS = [
  { id: 'should-i-apply', path: 'apply', title: 'Should I Apply?', outcome: { da: 'Et realistisk syn på dit match og de vigtigste ændringer før ansøgning.', en: 'A realistic view of your fit and the changes that matter before applying.' } },
  { id: 'inside-the-role', path: 'explore', title: 'Inside the Role', outcome: { da: 'Arbejdet, forventningerne, karrierevejene og det jobopslaget ikke fortæller.', en: 'The work, expectations, career paths and what the job description leaves out.' } },
  { id: 'inside-the-company', path: 'explore', title: 'Inside the Company', outcome: { da: 'Relevant kontekst om arbejdsform, kultur, rekruttering og udviklingsmuligheder.', en: 'Relevant context on ways of working, culture, hiring and development.' } },
  { id: 'cv-reality-check', path: 'prepare', title: 'CV Reality Check', outcome: { da: 'De tre vigtigste ændringer til et CV målrettet den rolle, du søger.', en: 'The three most important changes to a CV aimed at the role you want.' } },
  { id: 'interview-ready', path: 'perform', title: 'Interview Ready', outcome: { da: 'Realistisk træning, konkret feedback og en plan for den specifikke samtale.', en: 'Realistic practice, concrete feedback and a plan for the specific interview.' } },
  { id: 'career-direction', path: 'explore', title: 'Career Direction', outcome: { da: 'Realistiske karrierespor, centrale fravalg og et konkret næste skridt.', en: 'Realistic career paths, meaningful trade-offs and a concrete next step.' } },
  { id: 'career-pivot', path: 'prepare', title: 'Career Pivot', outcome: { da: 'Overførbare styrker, reelle barrierer og en troværdig overgangsplan.', en: 'Transferable strengths, real barriers and a credible transition plan.' } },
  { id: 'offer-review', path: 'perform', title: 'Offer Review', outcome: { da: 'Et klart syn på rolle, mandat, vilkår, risici og langsigtet værdi.', en: 'A clear view of the role, mandate, terms, risks and long-term value.' } },
] as const satisfies ReadonlyArray<{
  id: string
  path: AccessPathId
  title: string
  outcome: LocalizedText
}>

export function localized(text: LocalizedText, locale: BrandLocale) {
  return text[locale]
}

export function accessPath(pathId: AccessPathId) {
  return ACCESS_PATHS.find((path) => path.id === pathId)!
}

export function situation(situationId: SituationId) {
  return ACCESS_SITUATIONS.find((item) => item.id === situationId)!
}
