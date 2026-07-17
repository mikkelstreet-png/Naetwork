'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown, Clock3, RefreshCw, Search, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProfileWorkspaceActions } from '@/components/ProfileWorkspaceActions'
import { useLanguage } from '@/context/LanguageContext'
import { CATEGORIES, categoryAccent, categoryForAreas, categoryIdForValue, type CategoryId } from '@/lib/categories'
import { CONTRIBUTION_PERCENT, focusLabel, formatDkk } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import {
  professionalBestFor,
  professionalExperienceFacts,
  professionalInitials,
  professionalLanguageLabels,
  professionalPrimaryOutput,
  professionalResponseLabel,
  professionalSessionTypes,
} from '@/lib/professionalPresentation'
import { sessionImpactAmount } from '@/lib/publicExperience'
import { charityAmount, charitySharePercent } from '@/lib/payoutPreference'
import { SESSION_TYPES, isSessionTypeId, sessionType, sessionTypesForFocusAreas, type SessionTypeId } from '@/lib/sessionTypes'

type CategoryFilter = 'all' | CategoryId

const FILTER_CATEGORIES: CategoryFilter[] = ['all', ...CATEGORIES.map((category) => category.id)]
const PRICE_OPTIONS = [600, 900, 1200, 1800] as const
const LEGACY_NEED_SESSION: Record<string, SessionTypeId> = {
  direction: 'career-clarity',
  materials: 'cv-review',
  interview: 'interview-training',
  case: 'case-interview-preparation',
}

function categoryLabel(category: CategoryFilter, isDa: boolean) {
  if (category === 'all') return isDa ? 'Alle fagområder' : 'All professional areas'
  return category
}

function accentFor(professional: ProfessionalCard) {
  return categoryAccent(categoryForAreas(professional.industries)?.id)
}

function relevanceFor(professional: ProfessionalCard, selectedSession: SessionTypeId | null) {
  if (!selectedSession) return 0
  const exact = (professional.focus_areas ?? []).includes(sessionType(selectedSession).focusArea)
  const supported = sessionTypesForFocusAreas(professional.focus_areas ?? []).some((session) => session.id === selectedSession)
  return exact ? 2 : supported ? 1 : 0
}

function formatNextAvailability(value: string | null, isDa: boolean) {
  if (!value) return isDa ? 'Ingen åbne tider' : 'No open times'
  return new Date(value).toLocaleString(isDa ? 'da-DK' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen',
  })
}

interface DirectoryFilterState {
  category: CategoryFilter
  session: SessionTypeId | null
  price: number | null
  query: string
}

function readFilterState() {
  const params = new URLSearchParams(window.location.search)
  const requestedCategory = categoryIdForValue(params.get('field'))
  const requestedSession = params.get('session')
  const legacyNeed = params.get('need')
  const requestedPrice = Number(params.get('price'))

  return {
    category: requestedCategory ?? 'all',
    session: isSessionTypeId(requestedSession)
      ? requestedSession
      : legacyNeed && LEGACY_NEED_SESSION[legacyNeed]
        ? LEGACY_NEED_SESSION[legacyNeed]
        : null,
    price: PRICE_OPTIONS.includes(requestedPrice as typeof PRICE_OPTIONS[number]) ? requestedPrice : null,
    query: params.get('q') ?? '',
  } satisfies DirectoryFilterState
}

interface ProfessionalsDirectoryProps {
  initialProfessionals: ProfessionalCard[]
  initialLoadError?: boolean
}

export default function ProfessionalsDirectory({ initialProfessionals, initialLoadError = false }: ProfessionalsDirectoryProps) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all')
  const [recommendedSession, setRecommendedSession] = useState<SessionTypeId | null>(null)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>(initialProfessionals)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(initialLoadError)

  useEffect(() => {
    function applyUrlState() {
      const filters = readFilterState()
      setCategoryFilter(filters.category)
      setRecommendedSession(filters.session)
      setMaxPrice(filters.price)
      setSearch(filters.query)
    }

    applyUrlState()
    window.addEventListener('popstate', applyUrlState)
    return () => window.removeEventListener('popstate', applyUrlState)
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

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return dbProfessionals
      .filter((professional) => {
        const primaryCategory = categoryForAreas(professional.industries)?.id
        const focusText = (professional.focus_areas ?? [])
          .map((area) => `${focusLabel(area, 'da')} ${focusLabel(area, 'en')}`)
          .join(' ')
        const searchable = [
          professional.name,
          professional.title,
          professional.company,
          professional.bio,
          primaryCategory,
          professional.industries.join(' '),
          focusText,
        ].join(' ').toLowerCase()

        return (categoryFilter === 'all' || primaryCategory === categoryFilter)
          && (!query || searchable.includes(query))
          && (!recommendedSession || relevanceFor(professional, recommendedSession) > 0)
          && (maxPrice === null || professional.price <= maxPrice)
      })
      .sort((a, b) => {
        const relevanceDifference = relevanceFor(b, recommendedSession) - relevanceFor(a, recommendedSession)
        if (relevanceDifference !== 0) return relevanceDifference
        if (Boolean(a.nextAvailableAt) !== Boolean(b.nextAvailableAt)) return a.nextAvailableAt ? -1 : 1
        if (a.nextAvailableAt && b.nextAvailableAt) return new Date(a.nextAvailableAt).getTime() - new Date(b.nextAvailableAt).getTime()
        if (a.reviewCount !== b.reviewCount) return b.reviewCount - a.reviewCount
        return a.name.localeCompare(b.name, isDa ? 'da' : 'en')
      })
  }, [categoryFilter, dbProfessionals, isDa, maxPrice, recommendedSession, search])

  const t = {
    heading: isDa ? 'Find den erfaring, du mangler.' : 'Find the experience you are missing.',
    subheading: isDa
      ? 'Start med situationen. Vælg derefter en professionel, der kender rollen, branchen eller processen indefra.'
      : 'Start with the situation. Then choose a professional who knows the role, industry or process from within.',
    searchPlaceholder: isDa ? 'Søg rolle, virksomhed eller erfaring' : 'Search role, company or experience',
    noResults: isDa ? 'Ingen profiler matcher dine valg' : 'No profiles match your choices',
    noResultsBody: isDa ? 'Prøv et andet behov, fagområde eller prisniveau.' : 'Try another need, professional area or price level.',
    clearFilters: isDa ? 'Nulstil filtre' : 'Clear filters',
    viewProfile: isDa ? 'Se profil og tider' : 'View profile and times',
    emptyTitle: isDa ? 'De første professionelle er på vej' : 'The first professionals are on their way',
    emptyBody: isDa ? 'Erfaring bliver først gjort tilgængelig, når rolle, baggrund og sessionsfokus er gennemgået.' : 'Experience is only made available after the role, background and session focus have been reviewed.',
    errorTitle: isDa ? 'Vi kunne ikke hente fagpersonerne' : 'We could not load the professionals',
    errorBody: isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen om et øjeblik.' : 'The profile service is not responding right now. Please try again shortly.',
  }

  function updateUrl(overrides: Partial<DirectoryFilterState>) {
    const next = {
      category: categoryFilter,
      session: recommendedSession,
      price: maxPrice,
      query: search,
      ...overrides,
    }
    const params = new URLSearchParams()
    if (next.session) params.set('session', next.session)
    if (next.category !== 'all') params.set('field', next.category)
    if (next.price !== null) params.set('price', String(next.price))
    if (next.query.trim()) params.set('q', next.query.trim())
    const query = params.toString()
    window.history.replaceState({ ...window.history.state }, '', query ? `/professionals?${query}` : '/professionals')
  }

  function resetFilters() {
    setSearch('')
    setCategoryFilter('all')
    setRecommendedSession(null)
    setMaxPrice(null)
    window.history.replaceState({ ...window.history.state }, '', '/professionals')
  }

  function selectCategory(category: CategoryFilter) {
    setCategoryFilter(category)
    updateUrl({ category })
  }

  function selectSession(id: SessionTypeId | null) {
    setRecommendedSession(id)
    updateUrl({ session: id })
  }

  function selectPrice(price: number | null) {
    setMaxPrice(price)
    updateUrl({ price })
  }

  function updateSearch(query: string) {
    setSearch(query)
    updateUrl({ query })
  }

  return (
    <main className="directory-page">
      <section className="directory-hero">
        <div className="home-shell">
          <p className="kicker">{isDa ? 'Adgang til professionel erfaring' : 'Access to professional experience'}</p>
          <h1>{t.heading}</h1>
          <p>{t.subheading}</p>
        </div>
        <div className="insight-signature insight-signature--directory" aria-hidden="true"><span className="insight-signature__line" /><span className="insight-signature__marker" /></div>
      </section>

      {!loadError && (
        <section className="directory-filter-shell" aria-label={isDa ? 'Filtrér fagpersoner' : 'Filter professionals'}>
          <div className="home-shell">
            <div className="directory-need-filter">
              <div>
                <span>{isDa ? 'Start med dit behov' : 'Start with your need'}</span>
                <p>{isDa ? 'Hvad vil du stå stærkere i?' : 'What do you want to be stronger in?'}</p>
              </div>
              <div role="group" aria-label={isDa ? 'Vælg dit behov' : 'Choose your need'}>
                <button type="button" aria-pressed={recommendedSession === null} onClick={() => selectSession(null)}>{isDa ? 'Alle behov' : 'All needs'}</button>
                {SESSION_TYPES.map((item) => (
                  <button key={item.id} type="button" aria-pressed={recommendedSession === item.id} onClick={() => selectSession(item.id)}>{item.title[lang]}</button>
                ))}
              </div>
            </div>
            <div className="directory-filters directory-filters--compact">
              <label>
                <span>{isDa ? 'Fagområde' : 'Professional area'}</span>
                <span className="directory-select">
                  <select value={categoryFilter} onChange={(event) => selectCategory(event.target.value as CategoryFilter)}>
                    {FILTER_CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabel(category, isDa)}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>{isDa ? 'Maksimal pris' : 'Maximum price'}</span>
                <span className="directory-select">
                  <select value={maxPrice ?? ''} onChange={(event) => selectPrice(event.target.value ? Number(event.target.value) : null)}>
                    <option value="">{isDa ? 'Alle priser' : 'All prices'}</option>
                    {PRICE_OPTIONS.map((price) => <option key={price} value={price}>{isDa ? 'Maks.' : 'Max'} DKK {price.toLocaleString('da-DK')}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>{isDa ? 'Søgning' : 'Search'}</span>
                <span className="directory-search">
                  <Search size={16} aria-hidden="true" />
                  <input type="search" value={search} onChange={(event) => updateSearch(event.target.value)} placeholder={t.searchPlaceholder} />
                </span>
              </label>
              <button type="button" onClick={resetFilters}>{t.clearFilters}</button>
            </div>
          </div>
        </section>
      )}

      <section id="profile-directory" className="home-shell directory-results" aria-busy={loading}>
        {!loadError && (
          <div className="directory-results__header">
            <p aria-live="polite">{loading ? (isDa ? 'Indlæser…' : 'Loading…') : `${filtered.length} ${isDa ? (filtered.length === 1 ? 'fagperson' : 'fagpersoner') : (filtered.length === 1 ? 'professional' : 'professionals')}`}</p>
            <span>{recommendedSession ? `${isDa ? 'Matcher' : 'Matches'}: ${sessionType(recommendedSession).title[lang]}` : (isDa ? 'Vælg ud fra erfaring, relevans og tilgængelighed' : 'Choose by experience, relevance and availability')}</span>
          </div>
        )}

        {loading ? (
          <div className="profile-list" aria-label={isDa ? 'Indlæser fagpersoner' : 'Loading professionals'}>
            {[0, 1, 2].map((item) => <div key={item} className="profile-card-skeleton" />)}
          </div>
        ) : loadError ? (
          <div role="alert" className="directory-state directory-state--error">
            <div>
              <p className="section-eyebrow">{isDa ? 'Profilservice' : 'Profile service'}</p>
              <h2>{t.errorTitle}</h2>
              <p>{t.errorBody}</p>
              <div className="directory-state__actions">
                <button type="button" onClick={() => void fetchProfessionals()} className="button-primary"><RefreshCw size={16} aria-hidden="true" />{isDa ? 'Prøv igen' : 'Try again'}</button>
                <Link href="/contact" className="button-secondary">{isDa ? 'Kontakt os' : 'Contact us'}</Link>
              </div>
            </div>
          </div>
        ) : dbProfessionals.length === 0 ? (
          <div className="directory-state">
            <div>
              <p className="section-eyebrow">{isDa ? 'Gennemgåede profiler' : 'Reviewed profiles'}</p>
              <h2>{t.emptyTitle}</h2>
              <p>{t.emptyBody}</p>
              <Link href="/professional/signup" className="button-primary">{isDa ? 'Del din erfaring' : 'Share your experience'}</Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="directory-state">
            <div>
              <h2>{t.noResults}</h2>
              <p>{t.noResultsBody}</p>
              <button type="button" onClick={resetFilters} className="button-primary">{t.clearFilters}</button>
            </div>
          </div>
        ) : (
          <div className="profile-list">
            {filtered.map((professional) => {
              const category = categoryForAreas(professional.industries)?.id
              const focusAreas = (professional.focus_areas ?? []).slice(0, 3)
              const sessionTypes = professionalSessionTypes(professional).slice(0, 3)
              const experienceFacts = professionalExperienceFacts(professional, isDa)
              const languageLabels = professionalLanguageLabels(professional.languages, isDa)
              const responseLabel = professionalResponseLabel(professional.responseTimeHours, isDa)
              const nextAvailable = formatNextAvailability(professional.nextAvailableAt, isDa)
              return (
                <article key={professional.id} className="profile-card">
                  <span className={`profile-card__accent ${accentFor(professional)}`} aria-hidden="true" />
                  <div className="profile-card__identity">
                    <div className="profile-card__meta">
                      <span>{category ?? (isDa ? 'Professionel' : 'Professional')}</span>
                      <span><CheckCircle2 size={12} aria-hidden="true" />{isDa ? 'Gennemgået' : 'Reviewed'}</span>
                    </div>
                    <div className="profile-card__person">
                      <span className={`profile-card__initials ${accentFor(professional)}`}>{professionalInitials(professional.name)}</span>
                      <div>
                        <h2>{professional.name}</h2>
                        <p>{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
                        <small>{professional.industries.join(' · ')}</small>
                        {(experienceFacts.length > 0 || languageLabels.length > 0) && (
                          <small className="profile-card__credentials">{[...experienceFacts, ...languageLabels].join(' · ')}</small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="profile-card__relevance">
                    <span>{isDa ? 'Brug erfaringen når du skal…' : 'Use the experience when you need to…'}</span>
                    <h3>{professionalBestFor(professional, isDa)}</h3>
                    <div className="profile-card__tags">
                      {(focusAreas.length > 0 ? focusAreas.map((area) => focusLabel(area, lang)) : sessionTypes.map((session) => session.title[lang])).map((label) => <span key={label}>{label}</span>)}
                    </div>
                    <p className="profile-card__result"><span>{isDa ? 'Du går videre med' : 'You move forward with'}</span>{professionalPrimaryOutput(professional, isDa)}</p>
                  </div>

                  <div className="profile-card__trust">
                    <span className={professional.nextAvailableAt ? 'is-available' : 'is-unavailable'}><Clock3 size={14} aria-hidden="true" />{professional.nextAvailableAt ? `${isDa ? 'Næste tid' : 'Next time'}: ${nextAvailable}` : nextAvailable}</span>
                    {professional.reviewCount > 0 && professional.averageRating !== null && (
                      <span><Star size={14} aria-hidden="true" />{professional.averageRating.toLocaleString(isDa ? 'da-DK' : 'en-GB', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} · {professional.reviewCount} {isDa ? (professional.reviewCount === 1 ? 'anmeldelse fra gennemført session' : 'anmeldelser fra gennemførte sessioner') : (professional.reviewCount === 1 ? 'review from a completed session' : 'reviews from completed sessions')}</span>
                    )}
                    {responseLabel && <span>{responseLabel}</span>}
                  </div>

                  <div className="profile-card__price">
                    <strong>DKK {professional.price.toLocaleString('da-DK')}</strong>
                    <span>{SESSION_TYPES.length ? '60 min · ' : ''}{isDa ? 'inkl. moms' : 'incl. VAT'}</span>
                    <p>{isDa ? `${formatDkk(professional.payoutPreference === 'donate' ? charityAmount(professional.price, 'donate') : sessionImpactAmount(professional.price))} går til Kræftens Bekæmpelse` : `${formatDkk(professional.payoutPreference === 'donate' ? charityAmount(professional.price, 'donate') : sessionImpactAmount(professional.price))} goes to Kræftens Bekæmpelse`}</p>
                    <small>{professional.payoutPreference === 'donate' ? charitySharePercent('donate') : CONTRIBUTION_PERCENT}% {isDa ? 'af nettoprisen ved gennemført og betalt session' : 'of the net price when completed and paid'}</small>
                    {professional.payoutPreference === 'donate' && <small className="profile-card__donation-choice">{isDa ? 'Donerer også sin egen 70%-andel' : 'Also donates their own 70% share'}</small>}
                  </div>

                  <div className="profile-card__actions">
                    <Link href={`/professionals/${professional.id}`} className="profile-card__cta">
                      {t.viewProfile}<ArrowRight size={16} aria-hidden="true" />
                    </Link>
                    <ProfileWorkspaceActions professionalId={professional.id} hasAvailability={Boolean(professional.nextAvailableAt)} locale={lang} compact />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
