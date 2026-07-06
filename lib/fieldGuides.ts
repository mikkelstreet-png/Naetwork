export const FIELD_GUIDES = {
  ai: {
    label: 'AI',
    query: 'AI',
    accent: 'bg-cyan-300',
    title: {
      da: 'Karrieresparring inden for AI',
      en: 'AI career sessions',
    },
    description: {
      da: 'For dig, der sigter mod produkt-, strategi-, drifts- eller kommercielle roller inden for AI og vil positionere din erfaring skarpere.',
      en: 'For candidates targeting AI product, strategy, operations or commercial roles who need sharper positioning and a clearer path in.',
    },
    bestFor: {
      da: ['Positionering mod AI-roller', 'Portefølje og dokumenterede resultater', 'Produkt- og strategiinterviews', 'Overførsel af erfaring fra andre områder'],
      en: ['AI role positioning', 'Portfolio and proof points', 'Product or strategy interviews', 'Translating non-AI experience'],
    },
    outputs: {
      da: ['En skarpere faglig profil', 'En prioriteret liste over roller', 'Klare porteføljeprioriteter', 'Konkrete interviewvinkler'],
      en: ['Sharper AI narrative', 'Role shortlist', 'Portfolio priorities', 'Interview angles'],
    },
    sessionFocus: {
      da: 'Brug timen på at afklare, hvilke AI-roller der passer til din baggrund, hvilke resultater der tæller, og hvordan du kommunikerer din særlige styrke præcist.',
      en: 'Use the hour to understand which AI roles fit your background, which proof points matter, and how to communicate your edge without sounding generic.',
    },
  },
  banking: {
    label: 'Banking',
    query: 'Banking',
    accent: 'bg-emerald-300',
    title: {
      da: 'Karrieresparring inden for Banking',
      en: 'Banking career sessions',
    },
    description: {
      da: 'For dig, der forbereder dig til processer inden for Investment Banking, M&A, Corporate Finance eller Capital Markets.',
      en: 'For candidates preparing for investment banking, M&A, corporate finance or capital markets processes.',
    },
    bestFor: {
      da: ['Tekniske interviewspørgsmål', 'Motivation og personlig fortælling', 'CV og transaktionsinteresse', 'Kalibrering mod interviewniveauet'],
      en: ['Banking technicals', 'Fit story', 'CV and deal interest', 'Interview bar calibration'],
    },
    outputs: {
      da: ['En målrettet træningsplan', 'Skarpere motivationssvar', 'Et stærkere CV-signal', 'Klarhed over næste forberedelsestrin'],
      en: ['Technical drill plan', 'Sharper fit answers', 'Better CV signal', 'Interview readiness'],
    },
    sessionFocus: {
      da: 'Brug timen på at forstå interviewniveauet, teste din tekniske viden, forbedre din fortælling og fjerne svage signaler fra dit materiale.',
      en: 'Use the hour to understand the interview bar, pressure-test technicals, improve your story and remove weak signals from your material.',
    },
  },
  consulting: {
    label: 'Management Consulting',
    query: 'Management Consulting',
    accent: 'bg-blue-300',
    title: {
      da: 'Karrieresparring inden for Management Consulting',
      en: 'Consulting career sessions',
    },
    description: {
      da: 'For dig, der forbereder ansøgninger, cases, personlige interviews eller finalerunder til Management Consulting.',
      en: 'For candidates preparing for strategy consulting applications, cases, fit interviews and final-round pressure.',
    },
    bestFor: {
      da: ['Casestruktur', 'Hypotesedrevet problemløsning', 'Personlig kommunikation', 'Forberedelse til finalerunden'],
      en: ['Case structure', 'Hypothesis thinking', 'Fit communication', 'Final-round preparation'],
    },
    outputs: {
      da: ['En renere casestruktur', 'Stærkere hypoteser', 'En plan for personlige svar', 'Klare træningsprioriteter'],
      en: ['Cleaner case structure', 'Better hypotheses', 'Fit answer map', 'Practice priorities'],
    },
    sessionFocus: {
      da: 'Brug timen på at gøre din problemløsning klarere, din kommunikation mere præcis og dine personlige svar mere troværdige.',
      en: 'Use the hour to make your problem solving clearer, your communication tighter and your fit answers more credible.',
    },
  },
  'private-equity': {
    label: 'Private Equity',
    query: 'Private Equity',
    accent: 'bg-lime-300',
    title: {
      da: 'Karrieresparring inden for Private Equity',
      en: 'Private Equity career sessions',
    },
    description: {
      da: 'For dig, der sigter mod investeringsroller, deal teams, investment cases eller et skifte fra Banking eller Consulting.',
      en: 'For candidates targeting investment roles, deal teams, investment cases or transitions from banking and consulting.',
    },
    bestFor: {
      da: ['Investment cases', 'Kommerciel deal-forståelse', 'Due diligence-logik', 'Forberedelse til PE-interviews'],
      en: ['Investment cases', 'Deal thinking', 'Diligence logic', 'PE interview preparation'],
    },
    outputs: {
      da: ['En plan for din investment case', 'En skarpere deal-diskussion', 'Bedre due diligence-spørgsmål', 'Klare forberedelsesprioriteter'],
      en: ['Investment case plan', 'Sharper deal discussion', 'Diligence questions', 'PE readiness'],
    },
    sessionFocus: {
      da: 'Brug timen på at skærpe, hvordan du vurderer virksomheder, transaktioner, værdiskabelse og investeringskvalitet.',
      en: 'Use the hour to sharpen how you think about companies, deals, value creation and investment judgment.',
    },
  },
} as const;

export type FieldSlug = keyof typeof FIELD_GUIDES;

export const FIELD_SLUGS = Object.keys(FIELD_GUIDES) as FieldSlug[];

export function profileHrefForField(slug: FieldSlug) {
  return `/professionals?field=${encodeURIComponent(FIELD_GUIDES[slug].query)}`;
}
