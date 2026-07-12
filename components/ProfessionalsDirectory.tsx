'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import BookingDrawer from '@/components/BookingDrawer'
import { CheckCircle2, ChevronDown, RefreshCw, Search } from 'lucide-react'
import { contributionAmount, focusLabel, INDUSTRIES as PLATFORM_INDUSTRIES, industryAccent, type Industry as PlatformIndustry } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import { professionalBestFor, professionalInitials, professionalPrimaryOutput } from '@/lib/professionalPresentation'

type Industry = 'all' | PlatformIndustry
type Need = 'direction' | 'materials' | 'interview' | 'case'

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

interface ProfessionalsDirectoryProps {
  initialProfessionals: ProfessionalCard[]
  initialLoadError?: boolean
}

export default function ProfessionalsDirectory({ initialProfessionals, initialLoadError = false }: ProfessionalsDirectoryProps) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [industryFilter, setIndustryFilter] = useState<Industry>('all')
  const [recommendedNeed, setRecommendedNeed] = useState<Need | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>(initialProfessionals)
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(initialLoadError)

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

      setDbProfessionals(mapPublicProfessionals(data))
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  const filtered = dbProfessionals.filter((p) => {
    const matchesIndustry = industryFilter === 'all' || p.industries.includes(industryFilter)
    const searchLower = search.toLowerCase()
    const focusText = (p.focus_areas ?? []).map((area) => `${focusLabel(area, 'da')} ${focusLabel(area, 'en')}`).join(' ')
    const matchesSearch = !search || [p.name, p.title, p.company, p.bio, p.industries.join(' '), focusText]
      .join(' ')
      .toLowerCase()
      .includes(searchLower)
    const matchesNeed = !recommendedNeed || relevanceFor(p, recommendedNeed) > 0
    const matchesPrice = maxPrice === null || p.price <= maxPrice
    return matchesIndustry && matchesSearch && matchesNeed && matchesPrice
  }).sort((a, b) => relevanceFor(b, recommendedNeed) - relevanceFor(a, recommendedNeed))

  const t = {
    heading: isDa ? 'Find den relevante erfaring.' : 'Find the relevant experience.',
    subheading: isDa
      ? 'Sammenlign gennemgået baggrund, konkret fokus, totalpris og bidrag, før du sender en anmodning.'
      : 'Compare reviewed background, concrete focus, total price and contribution before sending a request.',
    searchPlaceholder: isDa ? 'Søg rolle, firma, fokus eller felt...' : 'Search role, company, focus or field...',
    bookCta: isDa ? 'Book' : 'Book',
    noResults: isDa ? 'Ingen match' : 'No match',
    noResultsBody: isDa ? 'Nulstil søgning eller vælg alle felter.' : 'Clear search or view all fields.',
    clearFilters: isDa ? 'Nulstil' : 'Clear',
    viewProfile: isDa ? 'Profil' : 'Profile',
    impact: isDa ? 'Min. 40% af pris ekskl. moms afsættes' : 'Min. 40% of price excl. VAT is allocated',
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
    setMaxPrice(null)
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
    <main className="min-h-screen bg-white">
      <section className="border-b border-white/15 bg-[#09090b] px-5 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[82rem] py-10 sm:py-14 md:py-20">
          <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
          <div className="md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-8">
            <div>
              <p className="kicker mb-4 text-white/45">{isDa ? 'Profiluniverset' : 'Profile universe'}</p>
              <h1 className="max-w-5xl text-4xl font-medium leading-[0.96] text-white text-balance sm:text-6xl md:text-7xl">{t.heading}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 md:text-lg">{t.subheading}</p>
            </div>
            <dl className="mt-7 grid grid-cols-3 border-y border-white/15 md:mt-0 md:block md:min-w-[230px] md:border-y-0">
              {[
                ['60 min', isDa ? 'Format' : 'Format'],
                ['4', isDa ? 'Prisvalg' : 'Price points'],
                ['40-90%', isDa ? 'Bidragsvalg' : 'Contribution'],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-white/15 py-3 last:border-r-0 md:flex md:items-center md:justify-between md:border-b md:border-r-0 md:py-2.5">
                  <dd className="font-['Space_Grotesk'] text-sm font-semibold text-white md:text-base">{value}</dd>
                  <dt className="mt-1 text-[9px] font-medium uppercase text-white/35 md:mt-0">{label}</dt>
                </div>
              ))}
            </dl>
          </div>

          {!loadError && <div className="mt-8 grid overflow-hidden rounded-[4px] border border-white/25 bg-white md:mt-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <label className="flex min-w-0 items-center gap-3 px-4 py-3.5 lg:pr-5">
              <Search size={18} className="shrink-0 text-gray-400" aria-hidden="true" />
              <span className="sr-only">{t.searchPlaceholder}</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="min-w-0 w-full border-0 bg-transparent py-1 text-[15px] font-medium text-gray-950 outline-none placeholder:text-gray-500"
              />
            </label>
            <div className="relative flex items-center border-t border-gray-200 px-4 text-gray-950 md:hidden">
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
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[3px] border px-3 py-2 text-xs font-bold transition-all ${industryFilter === ind ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${ind === 'all' ? (industryFilter === ind ? 'bg-white/80' : 'bg-gray-300') : industryAccent(ind)}`} />
                  {industryLabel(ind, isDa)}
                </button>
              ))}
            </div>
          </div>}
          {!loadError && (
            <div className="grid grid-cols-2 border-x border-b border-white/25 bg-white text-gray-950 sm:grid-cols-[1fr_1fr_auto]">
              <label className="relative flex items-center gap-3 border-r border-gray-200 px-4">
                <span className="hidden text-xs font-bold text-gray-400 sm:block">{isDa ? 'Behov' : 'Need'}</span>
                <select value={recommendedNeed ?? ''} onChange={(event) => setRecommendedNeed((event.target.value || null) as Need | null)} className="min-w-0 flex-1 appearance-none bg-transparent py-3.5 pr-7 text-sm font-bold outline-none" aria-label={isDa ? 'Filtrer efter behov' : 'Filter by need'}>
                  <option value="">{isDa ? 'Alle behov' : 'All needs'}</option>
                  {Object.entries(needLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 text-gray-400" aria-hidden="true" />
              </label>
              <label className="relative flex items-center gap-3 px-4 sm:border-r sm:border-gray-200">
                <span className="hidden text-xs font-bold text-gray-400 sm:block">{isDa ? 'Maks. pris' : 'Max price'}</span>
                <select value={maxPrice ?? ''} onChange={(event) => setMaxPrice(event.target.value ? Number(event.target.value) : null)} className="min-w-0 flex-1 appearance-none bg-transparent py-3.5 pr-7 text-sm font-bold outline-none" aria-label={isDa ? 'Filtrer efter maksimal pris' : 'Filter by maximum price'}>
                  <option value="">{isDa ? 'Alle priser' : 'All prices'}</option>
                  {[600, 900, 1200, 1800].map((price) => <option key={price} value={price}>Maks. DKK {price.toLocaleString('da-DK')}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 text-gray-400" aria-hidden="true" />
              </label>
              <button type="button" onClick={resetFilters} className="col-span-2 border-t border-gray-200 px-4 py-3 text-xs font-bold text-gray-500 hover:text-gray-950 sm:col-span-1 sm:border-t-0">{t.clearFilters}</button>
            </div>
          )}
          {!loadError && recommendedNeed && (
            <div className="flex flex-col gap-2.5 border-b border-white/20 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:py-4">
              <p className="text-[13px] leading-relaxed text-white/55 sm:text-sm">
                <span className="font-bold text-white">{isDa ? 'Prioriteret efter dit match:' : 'Prioritized from your match:'}</span>{' '}
                {needLabels[recommendedNeed]}.
              </p>
              <button type="button" onClick={clearRecommendation} className="w-fit text-xs font-bold uppercase text-white/40 hover:text-white">
                {isDa ? 'Fjern prioritering' : 'Remove priority'}
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="marketplace" className="mx-auto max-w-[82rem] px-5 py-8 sm:px-8 md:py-16 lg:px-12" aria-busy={loading}>
        {!loadError && <div className="mb-4 flex items-center justify-between gap-3 md:mb-7">
          <p className="text-sm font-black text-gray-950">{loading ? (isDa ? 'Indlæser' : 'Loading') : loadError ? (isDa ? 'Midlertidigt utilgængelig' : 'Temporarily unavailable') : `${filtered.length} ${isDa ? (filtered.length === 1 ? 'profil' : 'profiler') : (filtered.length === 1 ? 'profile' : 'profiles')}`}</p>
          <p className="shrink-0 text-right text-xs font-bold text-gray-400">
            <span className="sm:hidden">{isDa ? '40%+ ekskl. moms' : '40%+ excl. VAT'}</span>
            <span className="hidden sm:inline">{t.impact}</span>
          </p>
        </div>}

        {loading ? (
          <div className="grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-2" aria-label={isDa ? 'Indlæser profiler' : 'Loading profiles'}>
            {[0, 1, 2, 3].map((item) => <div key={item} className="h-36 animate-pulse bg-[#f7f7f4]" />)}
          </div>
        ) : loadError ? (
          <div role="alert" className="relative overflow-hidden border-y border-gray-300 bg-white">
            <div className="signal-rail"><span /><span /><span /><span /></div>
            <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
              <div className="flex flex-col justify-center p-6 sm:p-9 lg:border-r lg:border-gray-300 lg:p-12">
                <p className="editorial-label">Profile service / status</p>
                <h2 className="mt-5 max-w-md text-3xl font-medium leading-tight text-gray-950">{t.errorTitle}</h2>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-600">{t.errorBody}</p>
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button type="button" onClick={() => void fetchProfessionals()} className="button-primary">
                    <RefreshCw size={16} aria-hidden="true" />
                    {isDa ? 'Prøv igen' : 'Try again'}
                  </button>
                  <Link href="/contact" className="inline-flex py-3 text-sm font-bold text-gray-600 transition-colors hover:text-gray-950">{isDa ? 'Kontakt os' : 'Contact us'} <span className="ml-2" aria-hidden="true">→</span></Link>
                </div>
              </div>

              <div className="border-t border-gray-300 bg-[#f1f1ec] p-6 sm:p-9 lg:border-t-0 lg:p-12">
                <p className="editorial-label">{isDa ? 'Imens kan du udforske' : 'In the meantime, explore'}</p>
                <p className="mt-4 max-w-lg font-['Space_Grotesk'] text-xl font-medium leading-snug text-gray-950">{isDa ? 'Læs feltguiden og afklar, hvilken erfaring der er mest relevant for dig.' : 'Read a field guide and clarify which experience is most relevant to you.'}</p>
                <div className="mt-7 grid grid-cols-2 border-l border-t border-gray-300">
                  {[
                    ['/fields/ai', 'AI'],
                    ['/fields/banking', 'Banking'],
                    ['/fields/consulting', 'Management Consulting'],
                    ['/fields/private-equity', 'Private Equity'],
                  ].map(([href, label]) => (
                    <Link key={href} href={href} className="flex min-h-20 items-end justify-between border-b border-r border-gray-300 p-3 text-xs font-bold text-gray-950 transition-colors hover:bg-white sm:p-4 sm:text-sm">
                      <span>{label}</span><span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
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
            <button type="button" onClick={resetFilters} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="md:border-t md:border-gray-200">
            {filtered.map((pro) => (
              <article key={pro.id} className="group relative mb-3 grid gap-4 overflow-hidden rounded-md border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-400 hover:shadow-[0_16px_45px_rgba(9,9,11,0.07)] md:mb-0 md:rounded-none md:border-x-0 md:border-t-0 md:px-3 md:py-8 md:hover:z-10 lg:grid-cols-[170px_1.1fr_1fr_130px_150px] lg:items-center lg:pl-6">
                <span className={`absolute left-0 top-7 hidden h-10 w-1 rounded-full lg:block ${accentFor(pro)}`} />
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`h-2 w-8 rounded-full lg:hidden ${accentFor(pro)}`} />
                  <p className="text-xs font-black uppercase text-gray-400">
                    {pro.industries[0] ?? (isDa ? 'Professionel' : 'Professional')}
                  </p>
                  <span title={isDa ? 'Indsendt rolle, virksomhed og LinkedIn er gennemgået' : 'Submitted role, company and LinkedIn have been reviewed'} className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-800">
                    <CheckCircle2 size={12} aria-hidden="true" /> {isDa ? 'Gennemgået' : 'Reviewed'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-['Space_Grotesk'] text-xs font-bold text-gray-950 transition-transform group-hover:-translate-y-0.5 ${accentFor(pro)}`}>{professionalInitials(pro.name)}</span>
                  <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-950 md:text-2xl">{pro.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{pro.title}{pro.company ? ` · ${pro.company}` : ''}</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 md:border-0 md:pt-0">
                  <p className="text-sm font-black text-gray-950">{professionalBestFor(pro, isDa)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{professionalPrimaryOutput(pro, isDa)}</p>
                </div>

                <div className="flex items-end justify-between gap-4 border-t border-gray-100 pt-4 md:block md:border-0 md:pt-0">
                  <p className="text-lg font-black text-gray-950">DKK {pro.price.toLocaleString('da-DK')}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase text-gray-400">{isDa ? 'Inkl. moms · 60 min' : 'Incl. VAT · 60 min'}</p>
                  <p className="mt-1 text-xs font-medium text-gray-400">{isDa ? `${pro.contributionPercent}% / DKK ${contributionAmount(pro.price, pro.contributionPercent).toLocaleString('da-DK')} afsættes` : `${pro.contributionPercent}% / DKK ${contributionAmount(pro.price, pro.contributionPercent).toLocaleString('da-DK')} allocated`}</p>
                  <p className="mt-2 text-xs font-bold text-gray-600">{pro.nextAvailableAt ? (isDa ? `Næste tid ${new Date(pro.nextAvailableAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', timeZone: 'Europe/Copenhagen' })}` : `Next time ${new Date(pro.nextAvailableAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'Europe/Copenhagen' })}`) : (isDa ? 'Ingen åbne tider' : 'No open times')}</p>
                </div>

                <div className="flex gap-2 lg:justify-end">
                  <Link href={`/professionals/${pro.id}`} className="button-secondary min-h-11 flex-1 px-4 py-2.5 lg:flex-none">
                    {t.viewProfile}
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBookTarget(pro)}
                    className="button-primary min-h-11 flex-1 px-4 py-2.5 lg:flex-none"
                  >
                    {t.bookCta}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale={lang} />
      )}
    </main>
  )
}
