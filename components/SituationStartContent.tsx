'use client'

import { ArrowRight, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_PATHS, ACCESS_SITUATIONS, localized, type AccessPathId } from '@/lib/brand'
import { CATEGORIES } from '@/lib/categories'
import { SESSION_MINUTES } from '@/lib/platform'
import { SESSION_TYPES, isSessionTypeId, sessionType, type SessionTypeId } from '@/lib/sessionTypes'

function isAccessPathId(value: string | null): value is AccessPathId {
  return ACCESS_PATHS.some((item) => item.id === value)
}

export function SituationStartContent() {
  const router = useRouter()
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [selectedSession, setSelectedSession] = useState<SessionTypeId | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [pathFilter, setPathFilter] = useState<AccessPathId | null>(null)
  const [continuing, setContinuing] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedSession = params.get('session')
    const requestedPath = params.get('path')
    const legacySituation = ACCESS_SITUATIONS.find((item) => item.id === params.get('situation'))
    if (isSessionTypeId(requestedSession)) setSelectedSession(requestedSession)
    else if (legacySituation) setSelectedSession(legacySituation.sessionType)
    if (isAccessPathId(requestedPath)) setPathFilter(requestedPath)
  }, [])

  const availableSessions = useMemo(
    () => pathFilter ? SESSION_TYPES.filter((item) => item.path === pathFilter) : SESSION_TYPES,
    [pathFilter],
  )
  const selected = selectedSession ? sessionType(selectedSession) : null
  const completed = Number(Boolean(selected)) + Number(Boolean(selectedCategory))
  const profileHref = selected && selectedCategory
    ? `/professionals?field=${encodeURIComponent(selectedCategory)}&session=${selected.id}`
    : '/professionals'

  function chooseSession(id: SessionTypeId) {
    setSelectedSession(id)
    setPathFilter(null)
    window.history.replaceState(null, '', `/start?session=${id}`)
  }

  function resetPath() {
    setPathFilter(null)
    setSelectedSession(null)
    setSelectedCategory('')
    window.history.replaceState(null, '', '/start')
  }

  async function continueToProfiles() {
    if (!selected || !selectedCategory) return
    setContinuing(true)
    const situation = {
      title: `${selected.title.da} · ${selectedCategory}`,
      category: selectedCategory,
      sessionType: selected.id,
      stage: 'preparing',
      deadline: '',
      nextAction: 'Vælg op til tre relevante profiler.',
    }
    window.localStorage.setItem('naetwork_active_situation', JSON.stringify(situation))
    try {
      const response = await fetch('/api/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(situation),
      })
      if (response.ok) window.localStorage.removeItem('naetwork_active_situation')
    } catch {
      // The anonymous situation remains locally and is synced after sign-in.
    }
    router.push(profileHref)
  }

  return (
    <main className="min-h-screen bg-[#f4f4f0]">
      <PublicPageHero
        eyebrow={isDa ? 'Find din session' : 'Find your session'}
        title={isDa ? 'Hvad skal være bedre om 60 minutter?' : 'What should be better in 60 minutes?'}
        body={isDa
          ? 'Vælg det ønskede resultat og den relevante kategori. Så viser Naetwork den professionelle erfaring, der passer til opgaven.'
          : 'Choose the intended outcome and relevant category. Naetwork will show professionals with experience that fits the task.'}
        sequence={isDa
          ? ['Vælg mål', 'Vælg kontekst', 'Find erfaring']
          : ['Choose session', 'Choose category', 'Compare professionals']}
      />

      <section className="px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-8 flex items-center gap-4" aria-label={isDa ? `${completed} af 2 valg foretaget` : `${completed} of 2 choices made`}>
              <div className="h-1 flex-1 overflow-hidden bg-gray-200"><div className="h-full bg-gray-950 transition-[width] duration-300" style={{ width: `${completed * 50}%` }} /></div>
              <span className="editorial-label shrink-0">{completed}/2</span>
            </div>

            <section className="border-t border-gray-300 py-7 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="editorial-label text-gray-400">01</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{isDa ? 'Vælg sessionstype' : 'Choose a session type'}</h2>
                  <p className="mt-2 text-sm text-gray-500">{isDa ? 'Vælg efter det konkrete output, du har brug for.' : 'Choose based on the concrete output you need.'}</p>
                </div>
                {selected && <Check size={20} aria-label={isDa ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {availableSessions.map((item) => (
                  <button key={item.id} type="button" onClick={() => chooseSession(item.id)} aria-pressed={selectedSession === item.id} className="choice-control min-h-28 flex-col items-start justify-center">
                    <span className="flex w-full items-center justify-between gap-4 text-sm font-semibold"><span>{localized(item.title, lang)}</span><small className="shrink-0 text-[10px] opacity-60">{SESSION_MINUTES} min</small></span>
                    <span className={`mt-1 block text-xs leading-relaxed ${selectedSession === item.id ? 'text-white/65' : 'text-gray-500'}`}>{localized(item.description, lang)}</span>
                  </button>
                ))}
              </div>
              {pathFilter && (
                <button type="button" onClick={resetPath} className="mt-4 text-sm font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">
                  {isDa ? 'Se alle sessioner' : 'See all sessions'}
                </button>
              )}
            </section>

            <section className="border-t border-gray-300 py-7 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="editorial-label text-gray-400">02</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{isDa ? 'Hvilken kategori gælder det?' : 'Which category is involved?'}</h2>
                  <p className="mt-2 text-sm text-gray-500">{isDa ? 'Kategorien hjælper os med at prioritere relevant arbejdserfaring.' : 'The category helps prioritize relevant work experience.'}</p>
                </div>
                {selectedCategory && <Check size={20} aria-label={isDa ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {CATEGORIES.map((category) => (
                  <button key={category.id} type="button" onClick={() => setSelectedCategory(category.id)} aria-pressed={selectedCategory === category.id} className="choice-control min-h-32 flex-col items-start justify-center">
                    <span className="flex w-full items-center justify-between gap-3"><span>{category.id}</span><span className={`h-2 w-9 ${category.accent}`} aria-hidden="true" /></span>
                    <span className={`mt-2 text-left text-xs leading-relaxed ${selectedCategory === category.id ? 'text-white/65' : 'text-gray-500'}`}>{category.areas.join(' · ')}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside aria-live="polite" className="access-selection-panel h-fit overflow-hidden p-6 text-white lg:sticky lg:top-24 lg:p-7">
            <div className="signal-rail absolute inset-x-0 top-0" aria-hidden="true"><span /><span /><span /><span /></div>
            <p className="editorial-label text-white/60">{isDa ? 'Din session' : 'Your session'}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">{selected ? localized(selected.title, lang) : isDa ? 'Vælg et resultat' : 'Choose an outcome'}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">{selected ? localized(selected.outcome, lang) : isDa ? 'Sessionstypen afgør, hvilken erfaring der er mest relevant, og hvad fagpersonen skal forberede.' : 'The session type determines which experience is most relevant and what the professional should prepare.'}</p>

            {selected && (
              <dl className="mt-6 border-t border-white/15">
                <div className="border-b border-white/15 py-4">
                  <dt className="editorial-label text-white/50">{isDa ? 'Forberedelse' : 'Preparation'}</dt>
                  <dd className="mt-2 text-sm font-semibold leading-relaxed text-white">{localized(selected.preparation, lang)}</dd>
                </div>
                <div className="border-b border-white/15 py-4">
                  <dt className="editorial-label text-white/50">{isDa ? 'Kategori' : 'Category'}</dt>
                  <dd className="mt-2 text-sm font-semibold text-white">{selectedCategory || (isDa ? 'Vælg kategori' : 'Choose a category')}</dd>
                </div>
              </dl>
            )}

            {completed === 2 ? (
              <button type="button" onClick={() => void continueToProfiles()} disabled={continuing} className="button-inverse mt-6 w-full disabled:opacity-60">
                {continuing ? (isDa ? 'Gemmer din situation...' : 'Saving your situation...') : (isDa ? 'Find relevant erfaring' : 'Find relevant experience')}<ArrowRight size={16} aria-hidden="true" />
              </button>
            ) : (
              <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[4px] border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/55">
                {isDa ? 'Vælg session og kategori' : 'Choose session and category'}
              </button>
            )}
            <p className="mt-4 text-xs leading-relaxed text-white/50">{isDa ? 'Du opretter først en konto, når du vil sende en bookinganmodning.' : 'You only create an account when you want to send a booking request.'}</p>
          </aside>
        </div>
      </section>
    </main>
  )
}
