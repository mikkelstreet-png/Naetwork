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

const INDUSTRIES: Industry[] = ['all', 'AI', 'Banking', 'Management Consulting', 'Private Equity']

const FIELD_SIGNALS = [
  ['AI', 'bg-cyan-300'],
  ['Banking', 'bg-emerald-300'],
  ['Management Consulting', 'bg-blue-300'],
  ['Private Equity', 'bg-lime-300'],
] as const

function industryLabel(industry: Industry, isDa: boolean) {
  if (industry === 'all') return isDa ? 'Alle' : 'All'
  return industry
}

function accentForIndustry(industry?: string) {
  if (industry === 'AI') return 'bg-cyan-300'
  if (industry === 'Banking') return 'bg-emerald-300'
  if (industry === 'Management Consulting') return 'bg-blue-300'
  if (industry === 'Private Equity') return 'bg-lime-300'
  return 'bg-gray-300'
}

function accentFor(pro: ProfessionalCard) {
  const primary = FIELD_SIGNALS.find(([industry]) => pro.industries.includes(industry))?.[0]
  return accentForIndustry(primary ?? pro.industries[0])
}

function minimumContribution(price: number) {
  return Math.round(price * 0.4)
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'N'
}

function bestFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'PE / investment case' : 'PE / investment case'
  if (focus.includes('banking_technicals')) return isDa ? 'Banking technicals' : 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Consulting-cases' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-karrierestrategi' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Ansøgning og profil' : 'Applications'
  return isDa ? 'Karriereretning' : 'Career clarity'
}

function primaryOutputFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Investment case og deal thinking' : 'Investment case and deal thinking'
  if (focus.includes('banking_technicals')) return isDa ? 'Technicals og interviewbar' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og fit' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function isIndustry(value: string | null): value is Industry {
  return !!value && INDUSTRIES.includes(value as Industry) && value !== 'all'
}

export default function ProfessionalsPage() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [industryFilter, setIndustryFilter] = useState<Industry>('all')
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const field = new URLSearchParams(window.location.search).get('field')
    if (isIndustry(field)) setIndustryFilter(field)
  }, [])

  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, focus_areas, profiles!inner(name)')
        .eq('visibility', 'published')

      if (error || !data) {
        setLoadError(true)
        setLoading(false)
        return
      }

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
      setDbProfessionals(mapped.filter((profile) => profile.name))
      setLoading(false)
    }
    fetchProfessionals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = dbProfessionals.filter((p) => {
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
    heading: isDa ? 'Profiler.' : 'Profiles.',
    subheading: isDa
      ? 'Sammenlign rolle, erfaring, fokus, pris og minimumsbidrag.'
      : 'Role, field, output, price and impact. Choose the right person without noise.',
    searchPlaceholder: isDa ? 'Søg rolle, firma, fokus eller felt...' : 'Search role, company, focus or field...',
    bookCta: isDa ? 'Book' : 'Book',
    noResults: isDa ? 'Ingen match' : 'No match',
    noResultsBody: isDa ? 'Nulstil søgning eller vælg alle felter.' : 'Clear search or view all fields.',
    clearFilters: isDa ? 'Nulstil' : 'Clear',
    viewProfile: isDa ? 'Profil' : 'Profile',
    impact: isDa ? 'Min. 40% til Kræftens Bekæmpelse' : 'Min. 40% to Kræftens Bekæmpelse',
    emptyTitle: isDa ? 'De første profiler er på vej' : 'The first profiles are on their way',
    emptyBody: isDa ? 'Vi publicerer kun profiler, når deres erfaring og fokus er gennemgået.' : 'We only publish profiles after reviewing their experience and focus.',
    errorTitle: isDa ? 'Profilerne kunne ikke indlæses' : 'Profiles could not be loaded',
  }

  function resetFilters() {
    setSearch('')
    setIndustryFilter('all')
    window.history.replaceState(null, '', '/professionals')
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-white px-5 sm:px-8">
        <div className="mx-auto max-w-6xl py-12 md:py-16">
          <p className="mb-4 text-xs font-black uppercase text-gray-400">Naetwork</p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.96] text-gray-950 text-balance md:text-7xl">{t.heading}</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">{t.subheading}</p>

          <div className="mt-10 grid gap-4 border-y border-gray-200 py-4 lg:grid-cols-[1fr_auto] lg:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full border-0 bg-transparent py-3 text-base font-semibold text-gray-950 outline-none placeholder:text-gray-400"
            />
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black transition-colors ${industryFilter === ind ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${ind === 'all' ? (industryFilter === ind ? 'bg-white/80' : 'bg-gray-300') : accentForIndustry(ind)}`} />
                  {industryLabel(ind, isDa)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="marketplace" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <p className="text-sm font-black text-gray-950">{loading ? (isDa ? 'Indlæser profiler' : 'Loading profiles') : `${filtered.length} ${isDa ? 'profiler' : 'profiles'}`}</p>
          <p className="text-xs font-bold uppercase text-gray-400">{t.impact}</p>
        </div>

        {loading ? (
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-2" aria-label={isDa ? 'Indlæser profiler' : 'Loading profiles'}>
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse bg-[#f7f7f4]" />)}
          </div>
        ) : loadError ? (
          <div className="border-y border-gray-200 py-16 text-center">
            <p className="text-xl font-black text-gray-950">{t.errorTitle}</p>
            <button onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white hover:bg-gray-800">{isDa ? 'Prøv igen' : 'Try again'}</button>
          </div>
        ) : dbProfessionals.length === 0 ? (
          <div className="grid gap-6 border-y border-gray-200 bg-[#f7f7f4] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-xl font-black text-gray-950">{t.emptyTitle}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">{t.emptyBody}</p>
            </div>
            <Link href="/professional/signup" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">{isDa ? 'Bliv professional' : 'Become a professional'}</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="border-y border-gray-200 py-16 text-center">
            <p className="text-xl font-black text-gray-950">{t.noResults}</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">{t.noResultsBody}</p>
            <button onClick={resetFilters} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            {filtered.map((pro) => (
              <article key={pro.id} className="relative grid gap-5 border-b border-gray-200 py-7 transition-colors hover:bg-[#fafaf8] lg:grid-cols-[170px_1.1fr_1fr_130px_150px] lg:items-center lg:px-3 lg:pl-5">
                <span className={`absolute left-0 top-7 hidden h-10 w-1 rounded-full lg:block ${accentFor(pro)}`} />
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-8 rounded-full lg:hidden ${accentFor(pro)}`} />
                  <p className="text-xs font-black uppercase text-gray-400">
                    {pro.industries[0] ?? (isDa ? 'Professional' : 'Professional')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-black text-gray-950 ${accentFor(pro)}`}>{initials(pro.name)}</span>
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-gray-950">{pro.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{pro.title}{pro.company ? ` · ${pro.company}` : ''}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-black text-gray-950">{bestFor(pro, isDa)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{primaryOutputFor(pro, isDa)}</p>
                </div>

                <div>
                  <p className="text-lg font-black text-gray-950">DKK {pro.price.toLocaleString('da-DK')}</p>
                  <p className="text-xs font-medium text-gray-400">{isDa ? `Min. DKK ${minimumContribution(pro.price).toLocaleString('da-DK')} til kræftsagen` : `Min. DKK ${minimumContribution(pro.price).toLocaleString('da-DK')} contribution`}</p>
                </div>

                <div className="flex gap-2 lg:justify-end">
                  <Link href={`/professionals/${pro.id}`} className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-white">
                    {t.viewProfile}
                  </Link>
                  <button
                    onClick={() => setBookTarget(pro)}
                    className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800"
                  >
                    {t.bookCta}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale={lang} />
      )}
    </div>
  )
}
