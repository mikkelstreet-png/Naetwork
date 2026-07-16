export const FIELD_GUIDES = {
  consulting: {
    label: 'Consulting',
    query: 'Consulting',
    accent: 'bg-blue-300',
    title: {
      da: 'Karrieresessioner inden for Consulting',
      en: 'Consulting career sessions',
    },
    description: {
      da: 'For dig, der søger roller inden for Management Consulting, Strategy, Transformation, Business Development, Operations eller PMO.',
      en: 'For candidates targeting Management Consulting, Strategy, Transformation, Business Development, Operations or PMO roles.',
    },
    bestFor: {
      da: ['Management Consulting og cases', 'Strategi og forretningsudvikling', 'Transformation og PMO', 'Operations og implementering'],
      en: ['Management Consulting and cases', 'Strategy and business development', 'Transformation and PMO', 'Operations and implementation'],
    },
    outputs: {
      da: ['En skarpere problemløsning', 'Et tydeligere match til rollen', 'Stærkere case- og interviewsvar', 'Konkrete næste forberedelsestrin'],
      en: ['Sharper problem solving', 'A clearer role fit', 'Stronger case and interview answers', 'Concrete preparation priorities'],
    },
    sessionFocus: {
      da: 'Brug timen på at gøre din problemløsning, positionering og kommunikation mere præcis i forhold til den konkrete consultingrolle.',
      en: 'Use the hour to make your problem solving, positioning and communication more precise for the specific consulting role.',
    },
  },
  finance: {
    label: 'Finance',
    query: 'Finance',
    accent: 'bg-emerald-300',
    title: {
      da: 'Karrieresessioner inden for Finance',
      en: 'Finance career sessions',
    },
    description: {
      da: 'For dig, der søger roller inden for Investment Banking, Private Equity, Asset Management, Corporate Finance, Commercial Banking, Markets eller Investments.',
      en: 'For candidates targeting Investment Banking, Private Equity, Asset Management, Corporate Finance, Commercial Banking, Markets or Investments.',
    },
    bestFor: {
      da: ['Investment Banking og Corporate Finance', 'Private Equity og investment cases', 'Markets og investeringer', 'Finance-interviews'],
      en: ['Investment Banking and Corporate Finance', 'Private Equity and investment cases', 'Markets and investments', 'Finance interviews'],
    },
    outputs: {
      da: ['En målrettet træningsplan', 'Skarpere technicals og motivationssvar', 'Et stærkere CV-signal', 'Klarhed over næste procestrin'],
      en: ['A targeted practice plan', 'Sharper technical and fit answers', 'A stronger CV signal', 'Clarity on the next process step'],
    },
    sessionFocus: {
      da: 'Brug timen på at forstå kravene i den konkrete financerolle, teste din faglige forberedelse og skærpe din fortælling.',
      en: 'Use the hour to understand the bar for the specific finance role, test your technical preparation and sharpen your story.',
    },
  },
  legal: {
    label: 'Legal',
    query: 'Legal',
    accent: 'bg-violet-300',
    title: {
      da: 'Karrieresessioner inden for Legal',
      en: 'Legal career sessions',
    },
    description: {
      da: 'For dig, der søger roller inden for Corporate Law, M&A, Commercial Law, Compliance, Regulatory eller Governance.',
      en: 'For candidates targeting Corporate Law, M&A, Commercial Law, Compliance, Regulatory or Governance roles.',
    },
    bestFor: {
      da: ['Corporate Law og M&A', 'Commercial Law', 'Compliance og Regulatory', 'Governance og interne legalroller'],
      en: ['Corporate Law and M&A', 'Commercial Law', 'Compliance and Regulatory', 'Governance and in-house legal roles'],
    },
    outputs: {
      da: ['Et tydeligere fagligt fokus', 'Skarpere ansøgningsargumenter', 'Bedre interviewforberedelse', 'En realistisk vej ind i rollen'],
      en: ['A clearer legal focus', 'Sharper application arguments', 'Better interview preparation', 'A realistic route into the role'],
    },
    sessionFocus: {
      da: 'Brug timen på at afklare den juridiske retning, forstå forventningerne i rollen og kommunikere din erfaring mere relevant.',
      en: 'Use the hour to clarify your legal direction, understand role expectations and communicate your experience more relevantly.',
    },
  },
} as const

export type FieldSlug = keyof typeof FIELD_GUIDES

export const FIELD_SLUGS = Object.keys(FIELD_GUIDES) as FieldSlug[]

export const LEGACY_FIELD_REDIRECTS: Record<string, FieldSlug> = {
  ai: 'consulting',
  banking: 'finance',
  'private-equity': 'finance',
}

export function profileHrefForField(slug: FieldSlug) {
  return `/professionals?field=${encodeURIComponent(FIELD_GUIDES[slug].query)}`
}
