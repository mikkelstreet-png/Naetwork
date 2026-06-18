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

function accentFor(pro: ProfessionalCard) {
  if (pro.industries.includes('AI')) return 'bg-sky-300'
  if (pro.industries.includes('Banking')) return 'bg-emerald-300'
  if (pro.industries.includes('Management Consulting')) return 'bg-cyan-300'
  return 'bg-lime-300'
}

function bestFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) return isDa ? 'Banking / PE prep' : 'Banking / PE prep'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Consulting cases' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI career strategy' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Applications' : 'Applications'
  return isDa ? 'Career clarity' : 'Career clarity'
}

function primaryOutputFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('banking_technicals') || focus.includes('pe_investment_case')) return isDa ? 'Technicals og interviewbar' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og fit' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function availabilityFor(pro: ProfessionalCard, isDa: boolean) {
  if (pro.id.startsWith('demo-')) return isDa ? 'Ledig denne uge' : 'Available this week'
  return isDa ? 'Anmod om tid' : 'Request availability'
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
    heading: isDa ? 'Profilindeks for ambitiøse kandidater.' : 'Profile index for ambitious candidates.',
    subheading: isDa
      ? 'Sammenlign professionals på rolle, branche, fokus, output og pris. Vælg den person, der passer til det næste skridt.'
      : 'Compare professionals by role, field, focus, output and price. Choose the person that fits your next step.',
    searchPlaceholder: isDa ? 'Søg rolle, firma, fokus eller branche...' : 'Search role, company, focus or field...',
    bookCta: isDa ? 'Book' : 'Book',
    noResults: isDa ? 'Ingen præcis match' : 'No exact match',
    noResultsBody: isDa ? 'Prøv at fjerne søgningen eller se alle spor.' : 'Try clearing the search or viewing all tracks.',
    clearFilters: isDa ? 'Nulstil filtre' : 'Clear filters',
    readMore: isDa ? 'Læs mere' : 'Read more',
    showLess: isDa ? 'Vis mindre' : 'Show less',
    viewProfile: isDa ? 'Profil' : 'Profile',
  }

  function resetFilters() {
    setSearch('')
    setIndustryFilter('all')
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-white px-5 pt-16 sm:px-8">
        <div className="mx-auto max-w-6xl py-16 md:py-24">
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Naetwork profiles</p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.96] tracking-tight text-gray-950 text-balance md:text-7xl">{t.heading}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{t.subheading}</p>

          <div className="mt-14 grid gap-5 border-y border-gray-200 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="relative">
              <svg className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full border-0 bg-transparent py-3 pl-7 pr-3 text-base font-semibold text-gray-950 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black transition-colors ${industryFilter === ind ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                >
                  {industryLabel(ind, isDa)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="marketplace" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black text-gray-950">{filtered.length} {isDa ? 'professionelle' : 'professionals'}</p>
            <p className="mt-1 text-sm text-gray-500">{isDa ? 'Alle sessioner er 60 minutter med tydelig pris før booking.' : 'All sessions are 60 minutes with clear price before booking.'}</p>
          </div>
          <p className="text-xs font-bold uppercase text-gray-400">AI · Banking · Consulting · PE</p>
        </div>

        {filtered.length === 0 ? (
          <div className="border border-gray-200 bg-[#f7f7f4] px-6 py-16 text-center">
            <p className="text-xl font-black text-gray-950">{t.noResults}</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">{t.noResultsBody}</p>
            <button onClick={resetFilters} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            {filtered.map((pro) => {
              const isExpanded = expandedId === pro.id
              const focusAreas = (pro.focus_areas ?? []).slice(0, 4)
              return (
                <article key={pro.id} className="grid gap-5 border-b border-gray-200 py-7 transition-colors hover:bg-[#fafaf8] md:grid-cols-[72px_1.2fr_1fr_120px_160px] md:items-start md:px-3">
                  <div className="flex items-center gap-3 md:block">
                    <span className={`block h-2 w-10 rounded-full ${accentFor(pro)}`} />
                    <div className="mt-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-xs font-black text-white md:mt-5">
                      {initials(pro.name)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase text-gray-400">{pro.industries.join(' / ')}</p>
                    <h2 className="mt-2 text-2xl font-black leading-tight tracking-tight text-gray-950">{pro.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{pro.title} · {pro.company}</p>
                    <p className={`mt-4 text-sm leading-relaxed text-gray-600 ${isExpanded ? '' : 'line-clamp-2'}`}>{pro.bio}</p>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : pro.id)}
                      className="mt-2 text-xs font-black text-gray-950 underline decoration-gray-300 underline-offset-4 transition-colors hover:decoration-gray-950"
                    >
                      {isExpanded ? t.showLess : t.readMore}
                    </button>
                  </div>

                  <div className="grid gap-4 text-sm sm:grid-cols-2 md:block md:space-y-4">
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">Best for</p>
                      <p className="mt-1 font-black text-gray-950">{bestFor(pro, isDa)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-gray-400">Output</p>
                      <p className="mt-1 font-black text-gray-950">{primaryOutputFor(pro, isDa)}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(focusAreas.length > 0 ? focusAreas : pro.industries).map((area) => (
                        <span key={area} className="border border-gray-200 px-2 py-1 text-[10px] font-black uppercase text-gray-500">
                          {FOCUS_LABELS[area] ?? area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400">Status</p>
                    <p className="mt-1 text-sm font-black text-gray-950">{availabilityFor(pro, isDa)}</p>
                    <p className="mt-5 text-[10px] font-black uppercase text-gray-400">Price</p>
                    <p className="mt-1 text-lg font-black text-gray-950">DKK {pro.price}</p>
                    <p className="text-xs font-medium text-gray-400">/ 60 min</p>
                  </div>

                  <div className="flex gap-2 md:flex-col">
                    <Link href={`/professionals/${pro.id}`} className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-white md:flex-none">
                      {t.viewProfile}
                    </Link>
                    <button
                      onClick={() => setBookTarget(pro)}
                      className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800 md:flex-none"
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
