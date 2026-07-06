'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import BookingDrawer from '@/components/BookingDrawer'
import { ChevronDown, RefreshCw, Search } from 'lucide-react'
import { contributionAmount, focusLabel, INDUSTRIES as PLATFORM_INDUSTRIES, industryAccent, type Industry as PlatformIndustry } from '@/lib/platform'

type Industry = 'all' | PlatformIndustry
type Need = 'direction' | 'materials' | 'interview' | 'case'

interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  focus_areas?: string[]
  price: number
  contributionPercent: number
  bio: string
}

const FILTER_INDUSTRIES: Industry[] = ['all', ...PLATFORM_INDUSTRIES.map((industry) => industry.id)]

const NEED_FOCUS: Record<Need, string[]> = {
  direction: ['career_direction', 'career_strategy', 'career_advice', 'ai_career_strategy', 'industry_insight'],
  materials: ['cv_linkedin', 'cv_review', 'application_review'],
  interview: ['interview_prep', 'mock_interview', 'banking_technicals'],
  case: ['case_prep', 'consulting_cases', 'banking_technicals', 'pe_investment_case'],
}

function industryLabel(industry: Industry, isDa: boolean) {
  if (industry === 'all') return isDa ? 'Alle' : 'All'
  return industry
}

function accentFor(pro: ProfessionalCard) {
  const primary = PLATFORM_INDUSTRIES.find((industry) => pro.industries.includes(industry.id))?.id
  return industryAccent(primary ?? pro.industries[0])
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'N'
}

function bestFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Investment case og PE-interview' : 'PE / investment case'
  if (focus.includes('banking_technicals')) return isDa ? 'Tekniske spørgsmål og Banking-interview' : 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Cases og personligt interview' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-roller og positionering' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Ansøgning og profil' : 'Applications'
  return isDa ? 'Karriereretning' : 'Career clarity'
}

function primaryOutputFor(pro: ProfessionalCard, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Skarpere investeringsvurdering' : 'Investment case and deal thinking'
  if (focus.includes('banking_technicals')) return isDa ? 'Teknisk sikkerhed og interviewklarhed' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og personlig kommunikation' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function isIndustry(value: string | null): value is Industry {
  return !!value && FILTER_INDUSTRIES.includes(value as Industry) && value !== 'all'
}

function isNeed(value: string | null): value is Need {
  return value === 'direction' || value === 'materials' || value === 'interview' || value === 'case'
}

function relevanceFor(pro: ProfessionalCard, need: Need | null) {
  if (!need) return 0
  return (pro.focus_areas ?? []).filter((area) => NEED_FOCUS[need].includes(area)).length
}

export default function ProfessionalsPage() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [industryFilter, setIndustryFilter] = useState<Industry>('all')
  const [recommendedNeed, setRecommendedNeed] = useState<Need | null>(null)
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const field = params.get('field')
    const need = params.get('need')
    if (isIndustry(field)) setIndustryFilter(field)
    if (isNeed(need)) setRecommendedNeed(need)
  }, [])

  const fetchProfessionals = useCallback(async () => {
    setLoading(true)
    setLoadError(false)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_public_professionals')

      if (error || !data) {
        setLoadError(true)
        return
      }

      const rows = data as Array<{
        id: string
        name: string | null
        title: string | null
        company: string | null
        bio: string | null
        price_dkk: number | null
        contribution_percent: number | null
        industries: string[] | null
        focus_areas: string[] | null
      }>
      const mapped: ProfessionalCard[] = rows.map((p) => ({
        id: p.id,
        name: p.name ?? '',
        title: p.title ?? '',
        company: p.company ?? '',
        industries: p.industries ?? [],
        focus_areas: p.focus_areas ?? [],
        price: p.price_dkk ?? 1200,
        contributionPercent: p.contribution_percent ?? 40,
        bio: p.bio ?? '',
      }))
      setDbProfessionals(mapped.filter((profile) => profile.name))
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchProfessionals()
  }, [fetchProfessionals])

  const filtered = dbProfessionals.filter((p) => {
    const matchesIndustry = industryFilter === 'all' || p.industries.includes(industryFilter)
    const searchLower = search.toLowerCase()
    const focusText = (p.focus_areas ?? []).map((area) => `${focusLabel(area, 'da')} ${focusLabel(area, 'en')}`).join(' ')
    const matchesSearch = !search || [p.name, p.title, p.company, p.bio, p.industries.join(' '), focusText]
      .join(' ')
      .toLowerCase()
      .includes(searchLower)
    return matchesIndustry && matchesSearch
  }).sort((a, b) => relevanceFor(b, recommendedNeed) - relevanceFor(a, recommendedNeed))

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
    errorTitle: isDa ? 'Vi kunne ikke hente profilerne' : 'We could not load the profiles',
    errorBody: isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen; hvis fejlen fortsætter, hjælper vi dig videre.' : 'The profile service is not responding right now. Try again; if the issue continues, we can help.',
  }

  const needLabels: Record<Need, string> = {
    direction: isDa ? 'karriereretning' : 'career direction',
    materials: isDa ? 'CV, LinkedIn og ansøgning' : 'CV, LinkedIn and applications',
    interview: isDa ? 'interviewforberedelse' : 'interview preparation',
    case: isDa ? 'cases og technicals' : 'cases and technicals',
  }

  function resetFilters() {
    setSearch('')
    setIndustryFilter('all')
    setRecommendedNeed(null)
    window.history.replaceState(null, '', '/professionals')
  }

  function selectIndustry(industry: Industry) {
    setIndustryFilter(industry)
    const params = new URLSearchParams()
    if (industry !== 'all') params.set('field', industry)
    if (recommendedNeed) params.set('need', recommendedNeed)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `/professionals?${query}` : '/professionals')
  }

  function clearRecommendation() {
    setRecommendedNeed(null)
    const query = industryFilter === 'all' ? '' : `?field=${encodeURIComponent(industryFilter)}`
    window.history.replaceState(null, '', `/professionals${query}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-white px-5 sm:px-8">
        <div className="mx-auto max-w-6xl py-6 sm:py-10 md:py-14">
          <div className="md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-8">
            <div>
              <p className="mb-2 text-[11px] font-black uppercase text-gray-400 md:mb-3 md:text-xs">Naetwork</p>
              <h1 className="max-w-5xl text-3xl font-black leading-none text-gray-950 text-balance sm:text-4xl md:text-6xl">{t.heading}</h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600 sm:mt-4 md:text-base">{t.subheading}</p>
            </div>
            <p className="mt-4 text-xs font-bold text-gray-400 md:mt-0 md:text-right">
              {isDa ? '60 min · DKK 600-1.800 · 40-90% til kræftsagen' : '60 min · DKK 600-1,800 · 40-90% to the cancer cause'}
            </p>
          </div>

          <div className="mt-5 grid overflow-hidden rounded-lg border border-gray-200 bg-[#f7f7f4] md:mt-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex min-w-0 items-center gap-3 px-4 py-3 lg:pr-5">
              <Search size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
              <span className="sr-only">{t.searchPlaceholder}</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="min-w-0 w-full border-0 bg-transparent py-1 text-[15px] font-semibold text-gray-950 outline-none placeholder:text-gray-400"
              />
            </label>
            <div className="relative flex items-center border-t border-gray-200 px-4 md:hidden">
              <span className="pointer-events-none text-xs font-bold text-gray-400">{isDa ? 'Felt' : 'Field'}</span>
              <select
                value={industryFilter}
                onChange={(event) => selectIndustry(event.target.value as Industry)}
                aria-label={isDa ? 'Vælg felt' : 'Choose field'}
                className="w-full appearance-none bg-transparent py-3.5 pl-4 pr-8 text-right text-sm font-black text-gray-950 outline-none"
              >
                {FILTER_INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{industryLabel(industry, isDa)}</option>
                ))}
              </select>
              <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
            </div>
            <div className="hidden gap-2 px-3 py-3 md:flex">
              {FILTER_INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => selectIndustry(ind)}
                  aria-pressed={industryFilter === ind}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black transition-colors ${industryFilter === ind ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${ind === 'all' ? (industryFilter === ind ? 'bg-white/80' : 'bg-gray-300') : industryAccent(ind)}`} />
                  {industryLabel(ind, isDa)}
                </button>
              ))}
            </div>
          </div>
          {recommendedNeed && (
            <div className="flex flex-col gap-2.5 border-b border-gray-200 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:py-4">
              <p className="text-[13px] leading-relaxed text-gray-600 sm:text-sm">
                <span className="font-black text-gray-950">{isDa ? 'Prioriteret efter dit match:' : 'Prioritized from your match:'}</span>{' '}
                {needLabels[recommendedNeed]}.
              </p>
              <button type="button" onClick={clearRecommendation} className="w-fit text-xs font-black uppercase text-gray-400 hover:text-gray-950">
                {isDa ? 'Fjern prioritering' : 'Remove priority'}
              </button>
            </div>
          )}
        </div>
      </section>

      <main id="marketplace" className="mx-auto max-w-6xl px-5 py-5 sm:px-8 md:py-12">
        {!loadError && <div className="mb-4 flex items-center justify-between gap-3 md:mb-7">
          <p className="text-sm font-black text-gray-950">{loading ? (isDa ? 'Indlæser' : 'Loading') : loadError ? (isDa ? 'Midlertidigt utilgængelig' : 'Temporarily unavailable') : `${filtered.length} ${isDa ? (filtered.length === 1 ? 'profil' : 'profiler') : (filtered.length === 1 ? 'profile' : 'profiles')}`}</p>
          <p className="shrink-0 text-right text-xs font-bold text-gray-400">
            <span className="sm:hidden">{isDa ? '40%+ til kræftsagen' : '40%+ to the cancer cause'}</span>
            <span className="hidden sm:inline">{t.impact}</span>
          </p>
        </div>}

        {loading ? (
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-2" aria-label={isDa ? 'Indlæser profiler' : 'Loading profiles'}>
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse bg-[#f7f7f4]" />)}
          </div>
        ) : loadError ? (
          <div className="rounded-lg border border-gray-200 bg-[#f7f7f4] p-5 sm:p-7">
            <div className="flex items-start gap-4">
              <span className="mt-1 block h-2 w-10 shrink-0 rounded-full bg-cyan-300" aria-hidden="true" />
              <div>
                <p className="text-lg font-black text-gray-950 sm:text-xl">{t.errorTitle}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-600">{t.errorBody}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3 sm:pl-14">
              <button
                type="button"
                onClick={() => void fetchProfessionals()}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-gray-800"
              >
                <RefreshCw size={16} aria-hidden="true" />
                {isDa ? 'Prøv igen' : 'Try again'}
              </button>
              <Link href="/contact" className="inline-flex px-1 py-3 text-sm font-black text-gray-600 transition-colors hover:text-gray-950">{isDa ? 'Kontakt os' : 'Contact us'}</Link>
            </div>
          </div>
        ) : dbProfessionals.length === 0 ? (
          <div className="grid gap-6 border-y border-gray-200 bg-[#f7f7f4] p-6 md:grid-cols-[1fr_auto] md:items-center md:p-8">
            <div>
              <p className="text-xl font-black text-gray-950">{t.emptyTitle}</p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">{t.emptyBody}</p>
            </div>
            <Link href="/professional/signup" className="inline-flex w-fit items-center justify-center rounded-lg bg-gray-950 px-5 py-3 text-sm font-black text-white hover:bg-gray-800">{isDa ? 'Bliv professionel' : 'Become a professional'}</Link>
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
          <div className="md:border-t md:border-gray-200">
            {filtered.map((pro) => (
              <article key={pro.id} className="relative mb-3 grid gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-[#fafaf8] md:mb-0 md:rounded-none md:border-x-0 md:border-t-0 md:px-2 md:py-7 lg:grid-cols-[170px_1.1fr_1fr_130px_150px] lg:items-center lg:px-3 lg:pl-5">
                <span className={`absolute left-0 top-7 hidden h-10 w-1 rounded-full lg:block ${accentFor(pro)}`} />
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-8 rounded-full lg:hidden ${accentFor(pro)}`} />
                  <p className="text-xs font-black uppercase text-gray-400">
                    {pro.industries[0] ?? (isDa ? 'Professionel' : 'Professional')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-xs font-black text-gray-950 ${accentFor(pro)}`}>{initials(pro.name)}</span>
                  <div>
                    <h2 className="text-xl font-black leading-tight text-gray-950 md:text-2xl">{pro.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{pro.title}{pro.company ? ` · ${pro.company}` : ''}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 md:border-0 md:pt-0">
                  <p className="text-sm font-black text-gray-950">{bestFor(pro, isDa)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{primaryOutputFor(pro, isDa)}</p>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-gray-100 pt-4 md:block md:border-0 md:pt-0">
                  <p className="text-lg font-black text-gray-950">DKK {pro.price.toLocaleString('da-DK')}</p>
                  <p className="text-xs font-medium text-gray-400">{isDa ? `${pro.contributionPercent}% / DKK ${contributionAmount(pro.price, pro.contributionPercent).toLocaleString('da-DK')} til kræftsagen` : `${pro.contributionPercent}% / DKK ${contributionAmount(pro.price, pro.contributionPercent).toLocaleString('da-DK')} contribution`}</p>
                </div>

                <div className="flex gap-2 lg:justify-end">
                  <Link href={`/professionals/${pro.id}`} className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-white lg:flex-none">
                    {t.viewProfile}
                  </Link>
                  <button
                    onClick={() => setBookTarget(pro)}
                    className="inline-flex flex-1 items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800 lg:flex-none"
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
