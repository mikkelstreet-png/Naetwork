'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import BookingDrawer from '@/components/BookingDrawer'

type Industry = 'all' | 'AI' | 'Banking' | 'Management Consulting' | 'Private Equity'

interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  focus_areas?: string[]
  price: number
  bio: string
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
}

const DEMO_PROFESSIONALS: ProfessionalCard[] = [
  {
    id: 'demo-1',
    name: 'Mads Christensen',
    title: 'Associate Director',
    company: 'Goldman Sachs',
    industries: ['Banking', 'Private Equity'],
    focus_areas: ['cv_linkedin', 'interview_prep', 'banking_technicals', 'pe_investment_case'],
    price: 1200,
    bio: 'Tidligere Associate Director med 8 års erfaring i M&A og kapitalmarkeder. Jeg hjælper dig med interviewforberedelse, CV-feedback og at forstå, hvad der faktisk kræves i investment banking.'
  },
  {
    id: 'demo-2',
    name: 'Sofie Larsen',
    title: 'Senior Consultant',
    company: 'McKinsey & Company',
    industries: ['Management Consulting'],
    focus_areas: ['case_prep', 'consulting_cases', 'interview_prep', 'career_direction'],
    price: 1100,
    bio: 'Senior Consultant med fokus på strategi og organisationsudvikling. Har hjulpet kandidater med case-forberedelse, interviewtræning og karrierevalg.'
  },
  {
    id: 'demo-3',
    name: 'Emil Andersen',
    title: 'AI Product Lead',
    company: 'Google DeepMind',
    industries: ['AI'],
    focus_areas: ['ai_career_strategy', 'industry_insight', 'career_direction', 'application_review'],
    price: 900,
    bio: 'Produktleder med baggrund i machine learning og AI-strategi. Hjælper kandidater med at forstå roller, portfolio og veje ind i AI-industrien.'
  },
]

const INDUSTRIES: Industry[] = ['all', 'AI', 'Banking', 'Management Consulting', 'Private Equity']

function industryLabel(industry: Industry, isDa: boolean) {
  if (industry === 'all') return isDa ? 'Alle' : 'All'
  return industry
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

function toneFor(pro: ProfessionalCard) {
  if (pro.industries.includes('AI')) return 'bg-[#e8f3ff] border-blue-100'
  if (pro.industries.includes('Banking')) return 'bg-[#e8f8ec] border-emerald-100'
  if (pro.industries.includes('Management Consulting')) return 'bg-[#e7fbfa] border-cyan-100'
  return 'bg-[#edf4df] border-lime-100'
}

function bestFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) {
    return isDa ? 'Best for: Banking / PE prep' : 'Best for: Banking / PE prep'
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa ? 'Best for: consulting cases' : 'Best for: consulting cases'
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa ? 'Best for: AI career strategy' : 'Best for: AI career strategy'
  }
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) {
    return isDa ? 'Best for: applications' : 'Best for: applications'
  }
  return isDa ? 'Best for: career clarity' : 'Best for: career clarity'
}

function availabilityFor(pro: ProfessionalCard, isDa: boolean) {
  if (pro.id.startsWith('demo-')) return isDa ? 'Ledig denne uge' : 'Available this week'
  return isDa ? 'Anmod om tid' : 'Request availability'
}

function priceTier(pro: ProfessionalCard, isDa: boolean) {
  if (pro.price >= 1400) return isDa ? 'Senior sparring' : 'Senior guidance'
  if (pro.price <= 800) return isDa ? 'Entry access' : 'Entry access'
  return isDa ? 'Core session' : 'Core session'
}

export default function ProfessionalsPage() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [industryFilter, setIndustryFilter] = useState<Industry>('all')
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, focus_areas, profiles!inner(name)')
        .eq('visibility', 'published')

      if (error || !data) return

      const mapped: ProfessionalCard[] = (data as Array<{
        id: string
        title: string | null
        company: string | null
        bio: string | null
        price_dkk: number | null
        industries: string[] | null
        focus_areas: string[] | null
        profiles: { name?: string | null } | null
      }>).map((p) => ({
        id: p.id,
        name: p.profiles?.name ?? '',
        title: p.title ?? '',
        company: p.company ?? '',
        industries: p.industries ?? [],
        focus_areas: p.focus_areas ?? [],
        price: p.price_dkk ?? 1200,
        bio: p.bio ?? '',
      }))
      setDbProfessionals(mapped)
    }
    fetchProfessionals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allProfessionals = dbProfessionals.length > 0 ? dbProfessionals : DEMO_PROFESSIONALS

  const filtered = allProfessionals.filter((p) => {
    const matchesIndustry = industryFilter === 'all' || p.industries.includes(industryFilter)
    const searchLower = search.toLowerCase()
    const focusText = (p.focus_areas ?? []).map((area) => FOCUS_LABELS[area] ?? area).join(' ')
    const matchesSearch = !search || [p.name, p.title, p.company, p.bio, p.industries.join(' '), focusText]
      .join(' ')
      .toLowerCase()
      .includes(searchLower)
    return matchesIndustry && matchesSearch
  })

  const t = {
    heading: isDa ? 'Find den rette professionelle' : 'Find the right professional',
    subheading: isDa
      ? 'Book 60 minutter med mennesker fra AI, Banking, Management Consulting og Private Equity. Vælg fokus før booking.'
      : 'Book 60 minutes with people from AI, Banking, Management Consulting and Private Equity. Choose the focus before booking.',
    searchPlaceholder: isDa ? 'Søg efter rolle, firma, fokus eller branche...' : 'Search role, company, focus or field...',
    bookCta: isDa ? 'Book 60 min' : 'Book 60 min',
    perSession: '/ 60 min',
    noResults: isDa ? 'Ingen præcis match' : 'No exact match',
    noResultsBody: isDa ? 'Prøv at fjerne søgningen eller se alle brancher.' : 'Try clearing the search or viewing all fields.',
    clearFilters: isDa ? 'Nulstil filtre' : 'Clear filters',
    readMore: isDa ? 'Læs mere' : 'Read more',
    showLess: isDa ? 'Vis mindre' : 'Show less',
    viewProfile: isDa ? 'Se profil' : 'View profile',
  }

  function resetFilters() {
    setSearch('')
    setIndustryFilter('all')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4]">
      <section className="border-b border-gray-200 bg-white px-4 pt-16 sm:px-6">
        <div className="mx-auto max-w-6xl py-16 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase text-gray-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {isDa ? 'Curated access' : 'Curated access'}
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-gray-950 md:text-6xl text-balance">{t.heading}</h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{t.subheading}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-3">
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-xl font-black text-gray-950">60</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500">min</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-xl font-black text-gray-950">4</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500">{isDa ? 'brancher' : 'fields'}</p>
              </div>
              <div className="rounded-xl bg-white p-4 text-center shadow-sm">
                <p className="text-xl font-black text-gray-950">500+</p>
                <p className="mt-1 text-[11px] font-medium text-gray-500">DKK</p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm md:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-11 py-3 text-sm text-gray-900 outline-none transition-colors focus:border-gray-950 focus:bg-white"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setIndustryFilter(ind)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${industryFilter === ind ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-950'}`}
                  >
                    {industryLabel(ind, isDa)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="marketplace" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-950">{filtered.length} {isDa ? 'professionelle' : 'professionals'}</p>
            <p className="mt-1 text-sm text-gray-500">{isDa ? 'Alle sessioner er 60 minutter. Prisen vises før booking.' : 'All sessions are 60 minutes. The price is shown before booking.'}</p>
          </div>
          <p className="text-xs font-medium uppercase text-gray-400">AI · Banking · Consulting · PE</p>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <p className="text-xl font-black text-gray-950">{t.noResults}</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">{t.noResultsBody}</p>
            <button onClick={resetFilters} className="mt-6 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((pro) => {
              const isExpanded = expandedId === pro.id
              const focusAreas = (pro.focus_areas ?? []).slice(0, 4)
              return (
                <article key={pro.id} className={`group flex min-h-[520px] flex-col rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-950/5 ${toneFor(pro)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-950 text-sm font-black text-white shadow-sm">
                      {initials(pro.name)}
                    </div>
                    <div className="rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-right shadow-sm">
                      <p className="text-[10px] font-semibold uppercase text-gray-500">{isDa ? 'Pris' : 'Price'}</p>
                      <p className="text-sm font-black text-gray-950">DKK {pro.price}</p>
                    </div>
                  </div>

                  <div className="mt-7">
                    <p className="text-[11px] font-bold uppercase text-gray-500">{pro.industries.join(' / ')}</p>
                    <h2 className="mt-2 text-xl font-black leading-tight text-gray-950 text-balance">{pro.name}</h2>
                    <p className="mt-1 text-sm font-medium text-gray-700">{pro.title} · {pro.company}</p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-950/10 bg-white/60 px-3 py-1.5 text-[11px] font-bold text-gray-800 shadow-sm">
                      {bestFor(pro, isDa)}
                    </span>
                    <span className="rounded-full border border-gray-950/10 bg-white/60 px-3 py-1.5 text-[11px] font-bold text-gray-700 shadow-sm">
                      {availabilityFor(pro, isDa)}
                    </span>
                  </div>

                  <div className="my-5 grid grid-cols-3 gap-3 border-y border-gray-950/10 py-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-500">Format</p>
                      <p className="mt-1 text-sm font-black text-gray-950">60 min</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-500">Brief</p>
                      <p className="mt-1 text-sm font-black text-gray-950">{isDa ? 'Før booking' : 'Before booking'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-gray-500">Level</p>
                      <p className="mt-1 text-sm font-black text-gray-950">{priceTier(pro, isDa)}</p>
                    </div>
                  </div>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {focusAreas.length > 0 ? focusAreas.map((area) => (
                      <span key={area} className="rounded-full border border-gray-950/10 bg-white/50 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                        {FOCUS_LABELS[area] ?? area}
                      </span>
                    )) : pro.industries.map((ind) => (
                      <span key={ind} className="rounded-full border border-gray-950/10 bg-white/50 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                        {ind}
                      </span>
                    ))}
                  </div>

                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed text-gray-700 ${isExpanded ? '' : 'line-clamp-4'}`}>{pro.bio}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pro.id)}
                      className="mt-2 text-xs font-bold text-gray-950 underline decoration-gray-400 underline-offset-4 transition-colors hover:decoration-gray-950"
                    >
                      {isExpanded ? t.showLess : t.readMore}
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-3 border-t border-gray-950/10 pt-4">
                    <Link href={`/professionals/${pro.id}`} className="inline-flex items-center justify-center rounded-xl border border-gray-950/10 bg-white/50 px-4 py-2.5 text-sm font-semibold text-gray-950 transition-colors hover:border-gray-950 hover:bg-white">
                      {t.viewProfile}
                    </Link>
                    <button
                      onClick={() => setBookTarget(pro)}
                      className="inline-flex items-center justify-center rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
                    >
                      {t.bookCta}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale={lang} />
      )}
    </div>
  )
}
