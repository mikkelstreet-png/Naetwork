'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import BookingDrawer from '@/components/BookingDrawer'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  price: number
  bio: string
  focus_areas?: string[]
}

const FOCUS_LABELS: Record<string, string> = {
  cv_linkedin: 'CV / LinkedIn',
  application_review: 'Application Review',
  interview_prep: 'Interview Prep',
  case_prep: 'Case Prep',
  banking_technicals: 'Banking Technicals',
  consulting_cases: 'Consulting Cases',
  pe_investment_case: 'PE / Investment Case',
  career_direction: 'Career Direction',
  ai_career_strategy: 'AI Career Strategy',
  industry_insight: 'Industry Insight',
  mock_interview: 'Interview Prep',
  cv_review: 'CV / LinkedIn',
  career_strategy: 'Career Direction',
  career_advice: 'Career Direction',
  informal_chat: 'Industry Insight',
}

const DEMO_PROFESSIONALS: Record<string, Professional> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Mads Christensen',
    title: 'Associate Director',
    company: 'Goldman Sachs',
    industries: ['Banking', 'Private Equity'],
    price: 1200,
    bio: 'Tidligere Associate Director med 8 års erfaring i M&A og kapitalmarkeder. Jeg hjælper dig med interviewforberedelse, CV-feedback og at forstå, hvad der faktisk kræves i investment banking.',
    focus_areas: ['cv_linkedin', 'interview_prep', 'banking_technicals', 'pe_investment_case']
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Sofie Larsen',
    title: 'Senior Consultant',
    company: 'McKinsey & Company',
    industries: ['Management Consulting'],
    price: 1100,
    bio: 'Senior Consultant med fokus på strategi og organisationsudvikling. Har hjulpet kandidater med case-forberedelse, interviewtræning og karrierevalg.',
    focus_areas: ['case_prep', 'consulting_cases', 'interview_prep', 'career_direction']
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Emil Andersen',
    title: 'AI Product Lead',
    company: 'Google DeepMind',
    industries: ['AI'],
    price: 900,
    bio: 'Produktleder med baggrund i machine learning og AI-strategi. Hjælper kandidater med at forstå roller, portfolio og veje ind i AI-industrien.',
    focus_areas: ['ai_career_strategy', 'industry_insight', 'career_direction', 'application_review']
  }
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

function accentFor(pro: Professional) {
  if (pro.industries.includes('AI')) return 'bg-sky-300'
  if (pro.industries.includes('Banking')) return 'bg-emerald-300'
  if (pro.industries.includes('Management Consulting')) return 'bg-cyan-300'
  return 'bg-lime-300'
}

function bestFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) return isDa ? 'Banking / PE prep' : 'Banking / PE prep'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Consulting cases' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI career strategy' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Applications' : 'Applications'
  return isDa ? 'Career clarity' : 'Career clarity'
}

function primaryOutputFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) return isDa ? 'Technicals og interviewbar' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og fit' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function useCasesFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) {
    return isDa
      ? ['Du søger Banking eller Private Equity og vil forstå interviewbaren.', 'Du vil træne technicals, deal thinking eller investment cases.', 'Du har materiale eller processtatus, der skal skærpes hurtigt.']
      : ['You are targeting Banking or Private Equity and want to understand the interview bar.', 'You want to practice technicals, deal thinking or investment cases.', 'You have materials or process context that needs sharper positioning.']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Du vil træne cases med mere struktur og mindre støj.', 'Du vil forbedre fit-svar og personlig kommunikation.', 'Du vil forstå, hvordan konsulenthuse vurderer kandidater.']
      : ['You want to practice cases with more structure and less noise.', 'You want to improve fit answers and personal communication.', 'You want to understand how consultancies evaluate candidates.']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Du vil ind i AI og har brug for en klarere vej ind.', 'Du vil oversætte din erfaring til relevante AI-roller.', 'Du vil forstå portfolio, rolletyper og interviewvinkler.']
      : ['You want to enter AI and need a clearer path in.', 'You want to translate your experience into relevant AI roles.', 'You want to understand portfolio, role types and interview angles.']
  }
  return isDa
    ? ['Du vil gøre dit CV, LinkedIn eller ansøgningsmateriale skarpere.', 'Du vil have ærlig feedback fra en person tættere på markedet.', 'Du vil afklare næste skridt før en vigtig beslutning.']
    : ['You want to sharpen your CV, LinkedIn or application materials.', 'You want honest feedback from someone closer to the market.', 'You want to clarify next steps before an important decision.']
}

function outcomesFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) {
    return isDa
      ? ['Forstå interviewbaren', 'Træn technicals', 'Skærp deal thinking', 'Få ærlig feedback på fit']
      : ['Understand the interview bar', 'Practice technicals', 'Sharpen deal thinking', 'Get honest fit feedback']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Strukturer cases bedre', 'Træn hypoteser', 'Kommunikér klarere', 'Forbered fit-svar']
      : ['Structure cases better', 'Practice hypotheses', 'Communicate more clearly', 'Prepare fit answers']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Afkod AI-roller', 'Positionér din erfaring', 'Byg stærkere portfolio', 'Vælg næste skridt']
      : ['Decode AI roles', 'Position your experience', 'Build a stronger portfolio', 'Choose next steps']
  }
  return isDa
    ? ['Skarpere CV', 'Bedre LinkedIn', 'Klarere ansøgning', 'Mere retning']
    : ['Sharper CV', 'Better LinkedIn', 'Clearer application', 'More direction']
}

export default function ProfessionalDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!id) return
    if (id.startsWith('demo-')) {
      setProfessional(DEMO_PROFESSIONALS[id] ?? null)
      setLoading(false)
      return
    }
    async function fetchProfessional() {
      const { data } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, focus_areas, profiles!inner(name)')
        .eq('id', id)
        .single()
      if (data) {
        const row = data as {
          id: string; title: string | null; company: string | null; bio: string | null
          price_dkk: number | null; industries: string[] | null; focus_areas: string[] | null
          profiles: { name?: string | null } | null
        }
        setProfessional({
          id: row.id, name: row.profiles?.name ?? '',
          title: row.title ?? '', company: row.company ?? '',
          industries: row.industries ?? [], price: row.price_dkk ?? 1200,
          bio: row.bio ?? '', focus_areas: row.focus_areas ?? [],
        })
      }
      setLoading(false)
    }
    fetchProfessional()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const t = {
    back: isDa ? 'Tilbage til professionals' : 'Back to professionals',
    focusAreas: isDa ? 'Fokusområder' : 'Focus areas',
    bookCta: isDa ? 'Book 60 min' : 'Book 60 min',
    loading: isDa ? 'Indlæser...' : 'Loading...',
    notFound: isDa ? 'Profil ikke fundet' : 'Profile not found',
    session: isDa ? '60 min 1:1 session' : '60 min 1:1 session',
    briefing: isDa ? 'Du vælger selv, hvad sessionen skal handle om, når du booker.' : 'You choose what the session should focus on when you book.',
    bestFor: isDa ? 'Best for' : 'Best for',
    sessionBrief: isDa ? 'Session brief' : 'Session brief',
    sessionBriefBody: isDa
      ? 'Før du sender bookinganmodningen, vælger du fokus, procesfase, mål og eventuelt materiale. Det giver den professionelle bedre kontekst og gør sessionen mere konkret.'
      : 'Before sending the booking request, you choose focus, process stage, goal and optional material. That gives the professional better context and makes the session more concrete.',
    beforeBooking: isDa ? 'Før booking' : 'Before booking',
    outcomes: isDa ? 'Mulige outcomes' : 'Possible outcomes',
    trust: isDa ? 'Tryghed før booking' : 'Confidence before booking',
    profileSignal: isDa ? 'Profil-signal' : 'Profile signal',
    useThisProfileIf: isDa ? 'Brug denne profil hvis...' : 'Use this profile if...',
    leaveWith: isDa ? 'Hvad du kan gå fra sessionen med' : 'What you can leave with',
  }

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4]"><p className="text-gray-400">{t.loading}</p></div>

  if (!professional) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f7f4] px-6">
      <div className="text-center">
        <p className="mb-4 text-gray-500">{t.notFound}</p>
        <Link href="/professionals" className="text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">{t.back}</Link>
      </div>
    </div>
  )

  const focusAreas = professional.focus_areas ?? []
  const bestFit = bestFor(professional, isDa)
  const primaryOutput = primaryOutputFor(professional, isDa)
  const useCases = useCasesFor(professional, isDa)
  const outcomes = outcomesFor(professional, isDa)
  const prepItems = [
    {
      title: isDa ? 'Vælg fokus' : 'Choose focus',
      body: isDa ? 'CV, interview, case, technicals, AI strategy eller karrierevalg.' : 'CV, interview, case, technicals, AI strategy or career direction.',
    },
    {
      title: isDa ? 'Skriv dit mål' : 'Write your goal',
      body: isDa ? 'Fortæl hvad du gerne vil stå skarpere på efter de 60 minutter.' : 'Explain what you want to be sharper on after the 60 minutes.',
    },
    {
      title: isDa ? 'Tilføj materiale' : 'Add material',
      body: isDa ? 'Del LinkedIn, CV, jobopslag eller case-materiale hvis relevant.' : 'Share LinkedIn, CV, job post or case material if relevant.',
    },
  ]
  const trustItems = [
    { label: isDa ? 'Baggrund' : 'Background', value: `${professional.title} · ${professional.company}` },
    { label: isDa ? 'Pris før booking' : 'Price before booking', value: `DKK ${professional.price}` },
    { label: isDa ? 'Primært output' : 'Primary output', value: primaryOutput },
    { label: isDa ? 'Brief inkluderet' : 'Brief included', value: isDa ? 'Ja' : 'Yes' },
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f4] pb-24 md:pb-0">
      <section className="border-b border-gray-200 bg-white px-5 pt-16 sm:px-8">
        <div className="mx-auto max-w-6xl py-10 md:py-16">
          <Link href="/professionals" className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-gray-950">
            <span>&larr;</span><span>{t.back}</span>
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <span className={`mb-7 block h-2 w-24 rounded-full ${accentFor(professional)}`} />
              <div className="mb-6 flex flex-wrap gap-2">
                {professional.industries.map((ind) => (
                  <span key={ind} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold uppercase text-gray-600">{ind}</span>
                ))}
                <span className="rounded-full bg-gray-950 px-3 py-1 text-xs font-bold uppercase text-white">{t.bestFor}: {bestFit}</span>
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-tight text-gray-950 text-balance md:text-7xl">{professional.name}</h1>
              <p className="mt-5 text-lg font-bold text-gray-700">{professional.title} · {professional.company}</p>
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{professional.bio}</p>
            </div>

            <aside className="rounded-3xl border border-gray-200 bg-[#f7f7f4] p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-sm font-black text-white">
                  {initials(professional.name)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-gray-400">{isDa ? 'Pris' : 'Price'}</p>
                  <p className="text-2xl font-black text-gray-950">DKK {professional.price}</p>
                  <p className="text-xs font-medium text-gray-400">/ 60 min</p>
                </div>
              </div>
              <div className="my-5 border-y border-gray-200 py-5">
                <p className="text-sm font-black text-gray-950">{t.session}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{t.briefing}</p>
              </div>
              <button onClick={() => setDrawerOpen(true)} className="w-full rounded-full bg-gray-950 px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-gray-800">
                {t.bookCta}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase text-gray-400">{t.profileSignal}</p>
                  <h2 className="text-3xl font-black tracking-tight text-gray-950">{t.useThisProfileIf}</h2>
                </div>
                <span className={`block h-2 w-20 rounded-full ${accentFor(professional)}`} />
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-3">
                {useCases.map((item, index) => (
                  <div key={item} className="bg-[#f7f7f4] p-5">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="mt-8 text-sm font-black leading-relaxed text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase text-gray-400">{t.leaveWith}</p>
                  <h2 className="text-3xl font-black tracking-tight text-gray-950">{primaryOutput}</h2>
                </div>
                <span className="w-fit rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold text-white">{bestFit}</span>
              </div>
              <div className="grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="bg-[#f7f7f4] p-5">
                    <p className="text-sm font-black text-gray-950">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
              <p className="mb-5 text-xs font-bold uppercase text-gray-400">{t.focusAreas}</p>
              {focusAreas.length > 0 ? (
                <div className="grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
                  {focusAreas.map((area) => (
                    <div key={area} className="bg-[#f7f7f4] p-5">
                      <p className="text-sm font-black text-gray-950">{FOCUS_LABELS[area] ?? area}</p>
                      <p className="mt-2 text-sm leading-relaxed text-gray-500">
                        {isDa ? 'Brug sessionen på konkrete spørgsmål, feedback og næste skridt.' : 'Use the session for concrete questions, feedback and next steps.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{isDa ? 'Fokus aftales ved booking.' : 'Focus is agreed when booking.'}</p>
              )}
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase text-gray-400">{t.beforeBooking}</p>
                  <h2 className="text-3xl font-black tracking-tight text-gray-950">{t.sessionBrief}</h2>
                </div>
                <span className="w-fit rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold text-white">60 min</span>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{t.sessionBriefBody}</p>
              <div className="mt-7 grid gap-6 sm:grid-cols-3">
                {prepItems.map((item, index) => (
                  <div key={item.title} className="border-t border-gray-200 pt-5">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="mt-5 text-sm font-black text-gray-950">{item.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-3">
            {[
              { label: isDa ? 'Format' : 'Format', value: '60 min' },
              { label: isDa ? 'Pris' : 'Price', value: `DKK ${professional.price}` },
              { label: t.bestFor, value: bestFit },
              { label: isDa ? 'Output' : 'Output', value: primaryOutput },
              { label: isDa ? 'Fokus' : 'Focus', value: isDa ? 'Du vælger selv' : 'You choose' },
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-bold uppercase text-gray-400">{item.label}</p>
                <p className="mt-2 text-lg font-black text-gray-950">{item.value}</p>
              </div>
            ))}

            <div className="rounded-3xl border border-gray-200 bg-gray-950 p-5 text-white">
              <p className="mb-4 text-xs font-bold uppercase text-white/40">{t.trust}</p>
              <div className="space-y-4">
                {trustItems.map((item) => (
                  <div key={item.label} className="border-t border-white/10 pt-4 first:border-t-0 first:pt-0">
                    <p className="text-xs font-bold uppercase text-white/35">{item.label}</p>
                    <p className="mt-1 text-sm font-black text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {!drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-2xl shadow-gray-950/10 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">{t.session}</p>
              <p className="text-sm font-black text-gray-950">DKK {professional.price}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="rounded-full bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.bookCta}
            </button>
          </div>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} />
    </div>
  )
}
