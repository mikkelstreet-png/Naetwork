export const FIELD_GUIDES = {
  ai: {
    label: 'AI',
    query: 'AI',
    accent: 'bg-cyan-300',
    title: {
      da: 'AI karrieresessioner',
      en: 'AI career sessions',
    },
    description: {
      da: 'For kandidater der sigter mod AI product, strategy, operations eller kommercielle AI-roller og har brug for skarpere positionering og en klarere vej ind.',
      en: 'For candidates targeting AI product, strategy, operations or commercial roles who need sharper positioning and a clearer path in.',
    },
    bestFor: {
      da: ['AI-rollepositionering', 'Portfolio og proof points', 'Product- eller strategy-interviews', 'Oversættelse af ikke-AI erfaring'],
      en: ['AI role positioning', 'Portfolio and proof points', 'Product or strategy interviews', 'Translating non-AI experience'],
    },
    outputs: {
      da: ['Skarpere AI-fortælling', 'Rolle-shortlist', 'Portfolio-prioriteter', 'Interviewvinkler'],
      en: ['Sharper AI narrative', 'Role shortlist', 'Portfolio priorities', 'Interview angles'],
    },
    sessionFocus: {
      da: 'Brug timen på at forstå hvilke AI-roller der passer til din baggrund, hvilke proof points der betyder noget, og hvordan du kommunikerer din edge uden at lyde generisk.',
      en: 'Use the hour to understand which AI roles fit your background, which proof points matter, and how to communicate your edge without sounding generic.',
    },
  },
  banking: {
    label: 'Banking',
    query: 'Banking',
    accent: 'bg-emerald-300',
    title: {
      da: 'Banking karrieresessioner',
      en: 'Banking career sessions',
    },
    description: {
      da: 'For kandidater der forbereder sig til investment banking, M&A, corporate finance eller capital markets-processer.',
      en: 'For candidates preparing for investment banking, M&A, corporate finance or capital markets processes.',
    },
    bestFor: {
      da: ['Banking technicals', 'Fit story', 'CV og deal-interesse', 'Kalibrering af interviewbaren'],
      en: ['Banking technicals', 'Fit story', 'CV and deal interest', 'Interview bar calibration'],
    },
    outputs: {
      da: ['Technical drill plan', 'Skarpere fit-svar', 'Bedre CV-signal', 'Interview readiness'],
      en: ['Technical drill plan', 'Sharper fit answers', 'Better CV signal', 'Interview readiness'],
    },
    sessionFocus: {
      da: 'Brug timen på at forstå interviewbaren, teste technicals, forbedre din story og fjerne svage signaler fra dit materiale.',
      en: 'Use the hour to understand the interview bar, pressure-test technicals, improve your story and remove weak signals from your material.',
    },
  },
  consulting: {
    label: 'Management Consulting',
    query: 'Management Consulting',
    accent: 'bg-blue-300',
    title: {
      da: 'Consulting karrieresessioner',
      en: 'Consulting career sessions',
    },
    description: {
      da: 'For kandidater der forbereder strategi-consulting ansøgninger, cases, fit-interviews og finalerunder.',
      en: 'For candidates preparing for strategy consulting applications, cases, fit interviews and final-round pressure.',
    },
    bestFor: {
      da: ['Casestruktur', 'Hypotesetænkning', 'Fit-kommunikation', 'Finalerundeforberedelse'],
      en: ['Case structure', 'Hypothesis thinking', 'Fit communication', 'Final-round preparation'],
    },
    outputs: {
      da: ['Renere casestruktur', 'Bedre hypoteser', 'Fit answer map', 'Træningsprioriteter'],
      en: ['Cleaner case structure', 'Better hypotheses', 'Fit answer map', 'Practice priorities'],
    },
    sessionFocus: {
      da: 'Brug timen på at gøre din problemløsning klarere, din kommunikation strammere og dine fit-svar mere troværdige.',
      en: 'Use the hour to make your problem solving clearer, your communication tighter and your fit answers more credible.',
    },
  },
  'private-equity': {
    label: 'Private Equity',
    query: 'Private Equity',
    accent: 'bg-lime-300',
    title: {
      da: 'Private Equity karrieresessioner',
      en: 'Private Equity career sessions',
    },
    description: {
      da: 'For kandidater der sigter mod investment roles, deal teams, investment cases eller overgang fra banking og consulting.',
      en: 'For candidates targeting investment roles, deal teams, investment cases or transitions from banking and consulting.',
    },
    bestFor: {
      da: ['Investment cases', 'Deal thinking', 'Diligence-logik', 'PE-interviewforberedelse'],
      en: ['Investment cases', 'Deal thinking', 'Diligence logic', 'PE interview preparation'],
    },
    outputs: {
      da: ['Investment case plan', 'Skarpere deal discussion', 'Diligence-spørgsmål', 'PE readiness'],
      en: ['Investment case plan', 'Sharper deal discussion', 'Diligence questions', 'PE readiness'],
    },
    sessionFocus: {
      da: 'Brug timen på at skærpe hvordan du tænker om virksomheder, deals, value creation og investment judgment.',
      en: 'Use the hour to sharpen how you think about companies, deals, value creation and investment judgment.',
    },
  },
} as const;

export type FieldSlug = keyof typeof FIELD_GUIDES;

export const FIELD_SLUGS = Object.keys(FIELD_GUIDES) as FieldSlug[];

export function profileHrefForField(slug: FieldSlug) {
  return `/professionals?field=${encodeURIComponent(FIELD_GUIDES[slug].query)}`;
}
