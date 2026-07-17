'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, ChevronDown, RefreshCw, Search } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import { CATEGORIES, categoryAccent, categoryForAreas, categoryIdForValue, type CategoryId } from '@/lib/categories'
import { CONTRIBUTION_PERCENT, focusLabel } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import { professionalBestFor, professionalInitials, professionalPrimaryOutput, professionalSessionTypes } from '@/lib/professionalPresentation'
import { sessionImpactAmount } from '@/lib/publicExperience'
import { SESSION_TYPES, isSessionTypeId, sessionType, sessionTypesForFocusAreas, type SessionTypeId } from '@/lib/sessionTypes'

type CategoryFilter = 'all' | CategoryId

const FILTER_CATEGORIES: CategoryFilter[] = ['all', ...CATEGORIES.map((category) => category.id)]
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
    const params = new URLSearchParams(window.location.search)
    const requestedCategory = categoryIdForValue(params.get('field'))
    const requestedSession = params.get('session')
    const legacyNeed = params.get('need')
    if (requestedCategory) setCategoryFilter(requestedCategory)
    if (isSessionTypeId(requestedSession)) setRecommendedSession(requestedSession)
    else if (legacyNeed && LEGACY_NEED_SESSION[legacyNeed]) setRecommendedSession(LEGACY_NEED_SESSION[legacyNeed])
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
      .sort((a, b) => relevanceFor(b, recommendedSession) - relevanceFor(a, recommendedSession))
  }, [categoryFilter, dbProfessionals, maxPrice, recommendedSession, search])

  const t = {
    heading: isDa ? 'Find den erfaring, du har brug for.' : 'Find the experience you need.',
    subheading: isDa
      ? 'Vælg ud fra det, du vil forbedre, og den branche eller proces, du skal navigere i.'
      : 'Choose based on what you want to improve and the industry or process you need to navigate.',
    searchPlaceholder: isDa ? 'Søg rolle, virksomhed eller erfaring' : 'Search role, company or experience',
    noResults: isDa ? 'Ingen profiler matcher dine valg' : 'No profiles match your choices',
    noResultsBody: isDa ? 'Prøv et andet behov, fagområde eller prisniveau.' : 'Try another need, professional area or price level.',
    clearFilters: isDa ? 'Nulstil filtre' : 'Clear filters',
    viewProfile: isDa ? 'Se profil' : 'View profile',
    emptyTitle: isDa ? 'De første fagpersoner er på vej' : 'The first professionals are on their way',
    emptyBody: isDa ? 'Vi publicerer kun profiler, når rolle, erfaring og fokus er gennemgået.' : 'We only publish profiles after role, experience and focus have been reviewed.',
    errorTitle: isDa ? 'Vi kunne ikke hente fagpersonerne' : 'We could not load the professionals',
    errorBody: isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen om et øjeblik.' : 'The profile service is not responding right now. Please try again shortly.',
  }

  function updateUrl(category: CategoryFilter, selectedSession: SessionTypeId | null) {
    const params = new URLSearchParams()
    if (selectedSession) params.set('session', selectedSession)
    if (category !== 'all') params.set('field', category)
    const query = params.toString()
    window.history.replaceState(null, '', query ? `/professionals?${query}` : '/professionals')
  }

  function resetFilters() {
    setSearch('')
    setCategoryFilter('all')
    setRecommendedSession(null)
    setMaxPrice(null)
    window.history.replaceState(null, '', '/professionals')
  }

  function selectCategory(category: CategoryFilter) {
    setCategoryFilter(category)
    updateUrl(category, recommendedSession)
  }

  function selectSession(id: SessionTypeId | null) {
    setRecommendedSession(id)
    updateUrl(categoryFilter, id)
  }

  return (
    <main className="directory-page">
      <section className="directory-hero">
        <div className="home-shell">
          <p className="kicker">{isDa ? 'Fagpersoner med erfaring indefra' : 'Professionals with inside experience'}</p>
          <h1>{t.heading}</h1>
          <p>{t.subheading}</p>
        </div>
        <div className="insight-signature insight-signature--directory" aria-hidden="true"><span className="insight-signature__line" /><span className="insight-signature__marker" /></div>
      </section>

      {!loadError && (
        <section className="directory-filter-shell" aria-label={isDa ? 'Filtrér fagpersoner' : 'Filter professionals'}>
          <div className="home-shell">
            <div className="directory-filters">
              <label>
                <span>1. {isDa ? 'Hvad vil du have hjælp til?' : 'What do you need help with?'}</span>
                <span className="directory-select">
                  <select value={recommendedSession ?? ''} onChange={(event) => selectSession(isSessionTypeId(event.target.value) ? event.target.value : null)}>
                    <option value="">{isDa ? 'Alle behov' : 'All needs'}</option>
                    {SESSION_TYPES.map((item) => <option key={item.id} value={item.id}>{item.title[lang]}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>2. {isDa ? 'Fagområde' : 'Professional area'}</span>
                <span className="directory-select">
                  <select value={categoryFilter} onChange={(event) => selectCategory(event.target.value as CategoryFilter)}>
                    {FILTER_CATEGORIES.map((category) => <option key={category} value={category}>{categoryLabel(category, isDa)}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>3. {isDa ? 'Pris' : 'Price'}</span>
                <span className="directory-select">
                  <select value={maxPrice ?? ''} onChange={(event) => setMaxPrice(event.target.value ? Number(event.target.value) : null)}>
                    <option value="">{isDa ? 'Alle priser' : 'All prices'}</option>
                    {[600, 900, 1200, 1800].map((price) => <option key={price} value={price}>{isDa ? 'Maks.' : 'Max'} DKK {price.toLocaleString('da-DK')}</option>)}
                  </select>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </label>
              <label>
                <span>4. {isDa ? 'Søgning' : 'Search'}</span>
                <span className="directory-search">
                  <Search size={16} aria-hidden="true" />
                  <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} />
                </span>
              </label>
              <button type="button" onClick={resetFilters}>{t.clearFilters}</button>
            </div>
            {recommendedSession && (
              <p className="directory-recommendation">
                <span>{isDa ? 'Viser først:' : 'Showing first:'}</span> {sessionType(recommendedSession).title[lang]}
              </p>
            )}
          </div>
        </section>
      )}

      <section id="profile-directory" className="home-shell directory-results" aria-busy={loading}>
        {!loadError && (
          <div className="directory-results__header">
            <p>{loading ? (isDa ? 'Indlæser…' : 'Loading…') : `${filtered.length} ${isDa ? (filtered.length === 1 ? 'fagperson' : 'fagpersoner') : (filtered.length === 1 ? 'professional' : 'professionals')}`}</p>
            <span>{isDa ? 'Booking sker fra den enkelte profil' : 'Booking starts from the individual profile'}</span>
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
              return (
                <article key={professional.id} className="profile-card">
                  <span className={`profile-card__accent ${accentFor(professional)}`} aria-hidden="true" />
                  <div className="profile-card__identity">
                    <div className="profile-card__meta">
                      <span>{category ?? (isDa ? 'Fagperson' : 'Professional')}</span>
                      <span><CheckCircle2 size={12} aria-hidden="true" />{isDa ? 'Gennemgået' : 'Reviewed'}</span>
                    </div>
                    <div className="profile-card__person">
                      <span className={`profile-card__initials ${accentFor(professional)}`}>{professionalInitials(professional.name)}</span>
                      <div>
                        <h2>{professional.name}</h2>
                        <p>{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
                        <small>{professional.industries.join(' · ')}</small>
                      </div>
                    </div>
                  </div>

                  <div className="profile-card__relevance">
                    <span>{isDa ? 'Relevant når du skal…' : 'Relevant when you need to…'}</span>
                    <h3>{professionalBestFor(professional, isDa)}</h3>
                    <div className="profile-card__tags">
                      {(focusAreas.length > 0 ? focusAreas.map((area) => focusLabel(area, lang)) : sessionTypes.map((session) => session.title[lang])).map((label) => <span key={label}>{label}</span>)}
                    </div>
                  </div>

                  <div className="profile-card__outcome">
                    <span>{isDa ? 'Du kan gå derfra med' : 'You can leave with'}</span>
                    <p>{professionalPrimaryOutput(professional, isDa)}</p>
                  </div>

                  <div className="profile-card__price">
                    <strong>DKK {professional.price.toLocaleString('da-DK')}</strong>
                    <span>{SESSION_TYPES.length ? '60 min · ' : ''}{isDa ? 'inkl. moms' : 'incl. VAT'}</span>
                    <p>{isDa ? `DKK ${sessionImpactAmount(professional.price).toLocaleString('da-DK')} går til Kræftens Bekæmpelse` : `DKK ${sessionImpactAmount(professional.price).toLocaleString('da-DK')} goes to Kræftens Bekæmpelse`}</p>
                    <small>{CONTRIBUTION_PERCENT}% {isDa ? 'ved gennemført og betalt session' : 'when completed and paid'}</small>
                  </div>

                  <Link href={`/professionals/${professional.id}`} className="profile-card__cta">
                    {t.viewProfile}<ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </main>
  )
}
