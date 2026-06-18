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

function toneFor(pro: Professional) {
  if (pro.industries.includes('AI')) return 'from-[#e8f3ff] via-white to-[#f8fafc]'
  if (pro.industries.includes('Banking')) return 'from-[#e8f8ec] via-white to-[#f8fafc]'
  if (pro.industries.includes('Management Consulting')) return 'from-[#e7fbfa] via-white to-[#f8fafc]'
  return 'from-[#edf4df] via-white to-[#f8fafc]'
}

function bestFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) {
    return isDa ? 'Banking / PE prep' : 'Banking / PE prep'
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa ? 'Consulting cases' : 'Consulting cases'
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa ? 'AI career strategy' : 'AI career strategy'
  }
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) {
    return isDa ? 'Applications' : 'Applications'
  }
  return isDa ? 'Career clarity' : 'Career clarity'
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
      ? 'Før du sender bookinganmodningen, vælger du fokus og skriver kort, hvad du vil opnå. Det giver den professionelle bedre kontekst og gør sessionen mere konkret.'
      : 'Before sending the booking request, you choose a focus and briefly explain what you want to achieve. That gives the professional better context and makes the session more concrete.',
    beforeBooking: isDa ? 'Før booking' : 'Before booking',
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

  return (
    <div className="min-h-screen bg-[#f7f7f4] pb-24 md:pb-0">
      <section className={`border-b border-gray-200 bg-gradient-to-br ${toneFor(professional)} px-4 pt-16 sm:px-6`}>
        <div className="mx-auto max-w-6xl py-10 md:py-16">
          <Link href="/professionals" className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:text-gray-950">
            <span>&larr;</span><span>{t.back}</span>
          </Link>

          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="mb-6 flex flex-wrap gap-2">
                {professional.industries.map((ind) => (
                  <span key={ind} className="rounded-full border border-gray-950/10 bg-white/70 px-3 py-1 text-xs font-bold uppercase text-gray-700 shadow-sm">{ind}</span>
                ))}
                <span className="rounded-full border border-gray-950/10 bg-gray-950 px-3 py-1 text-xs font-bold uppercase text-white shadow-sm">{t.bestFor}: {bestFit}</span>
              </div>
              <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-gray-950 md:text-6xl text-balance">{professional.name}</h1>
              <p className="mt-4 text-lg font-medium text-gray-700">{professional.title} · {professional.company}</p>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{professional.bio}</p>
            </div>

            <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xl shadow-gray-950/5">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-950 text-sm font-black text-white">
                  {initials(professional.name)}
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-gray-400">{isDa ? 'Pris' : 'Price'}</p>
                  <p className="text-2xl font-black text-gray-950">DKK {professional.price}</p>
                  <p className="text-xs font-medium text-gray-400">/ 60 min</p>
                </div>
              </div>
              <div className="border-y border-gray-100 py-4">
                <p className="text-sm font-bold text-gray-950">{t.session}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{t.briefing}</p>
                <p className="mt-4 inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">{t.bestFor}: {bestFit}</p>
              </div>
              <button onClick={() => setDrawerOpen(true)} className="mt-4 w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
                {t.bookCta}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:py-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <p className="mb-4 text-xs font-semibold uppercase text-gray-400">{t.focusAreas}</p>
              {focusAreas.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {focusAreas.map((area) => (
                    <div key={area} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm font-bold text-gray-950">{FOCUS_LABELS[area] ?? area}</p>
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

            <section className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase text-gray-400">{t.beforeBooking}</p>
                  <h2 className="text-2xl font-black text-gray-950">{t.sessionBrief}</h2>
                </div>
                <span className="w-fit rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold text-white">60 min</span>
              </div>
              <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{t.sessionBriefBody}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {prepItems.map((item, index) => (
                  <div key={item.title} className="border-t border-gray-200 pt-4">
                    <p className="text-xs font-semibold text-gray-400">0{index + 1}</p>
                    <p className="mt-2 text-sm font-bold text-gray-950">{item.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            {[
              { label: isDa ? 'Format' : 'Format', value: '60 min' },
              { label: isDa ? 'Pris' : 'Price', value: `DKK ${professional.price}` },
              { label: t.bestFor, value: bestFit },
              { label: isDa ? 'Fokus' : 'Focus', value: isDa ? 'Du vælger selv' : 'You choose' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase text-gray-400">{item.label}</p>
                <p className="mt-2 text-lg font-black text-gray-950">{item.value}</p>
              </div>
            ))}
          </aside>
        </div>
      </main>

      {!drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-2xl shadow-gray-950/10 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">{t.session}</p>
              <p className="text-sm font-black text-gray-950">DKK {professional.price}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
              {t.bookCta}
            </button>
          </div>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} />
    </div>
  )
}
