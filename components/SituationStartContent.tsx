'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_PATHS, ACCESS_SITUATIONS, accessPath, localized, situation, type AccessPathId, type SituationId } from '@/lib/brand'
import { INDUSTRIES } from '@/lib/platform'

function isSituationId(value: string | null): value is SituationId {
  return ACCESS_SITUATIONS.some((item) => item.id === value)
}

function isAccessPathId(value: string | null): value is AccessPathId {
  return ACCESS_PATHS.some((item) => item.id === value)
}

export function SituationStartContent() {
  const { lang } = useLanguage()
  const [selectedSituation, setSelectedSituation] = useState<SituationId | null>(null)
  const [selectedField, setSelectedField] = useState('')
  const [pathFilter, setPathFilter] = useState<AccessPathId | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedSituation = params.get('situation')
    const requestedPath = params.get('path')
    if (isSituationId(requestedSituation)) setSelectedSituation(requestedSituation)
    if (isAccessPathId(requestedPath)) setPathFilter(requestedPath)
  }, [])

  const availableSituations = useMemo(
    () => pathFilter ? ACCESS_SITUATIONS.filter((item) => item.path === pathFilter) : ACCESS_SITUATIONS,
    [pathFilter],
  )
  const selected = selectedSituation ? situation(selectedSituation) : null
  const path = selected ? accessPath(selected.path) : pathFilter ? accessPath(pathFilter) : null
  const completed = Number(Boolean(selected)) + Number(Boolean(selectedField))
  const profileHref = selected && selectedField
    ? `/professionals?field=${encodeURIComponent(selectedField)}&need=${selected.need}`
    : '/professionals'

  function chooseSituation(id: SituationId) {
    const item = situation(id)
    setSelectedSituation(id)
    setPathFilter(item.path)
    setSelectedField('')
    window.history.replaceState(null, '', `/start?situation=${id}`)
  }

  function resetPath() {
    setPathFilter(null)
    setSelectedSituation(null)
    setSelectedField('')
    window.history.replaceState(null, '', '/start')
  }

  return (
    <main className="min-h-screen bg-[#f4f4f0]">
      <section className="border-b border-white/15 bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <p className="kicker mb-5 text-white/50">Career Access</p>
          <h1 className="display-xl max-w-5xl text-white">{lang === 'da' ? 'Hvad står du overfor?' : 'What are you facing?'}</h1>
          <p className="body-lg mt-6 max-w-2xl text-white/65">
            {lang === 'da'
              ? 'Start med situationen, ikke med et profilkatalog. Vi bruger dit valg til at vise den erfaring, der er relevant for næste skridt.'
              : 'Start with the situation, not a profile directory. We use your choice to show the experience relevant to the next step.'}
          </p>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 md:py-16 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-8 lg:grid-cols-[1fr_400px]">
          <div>
            <div className="mb-8 flex items-center gap-4" aria-label={lang === 'da' ? `${completed} af 2 valg foretaget` : `${completed} of 2 choices made`}>
              <div className="h-1 flex-1 overflow-hidden bg-gray-200"><div className="h-full bg-gray-950 transition-[width] duration-300" style={{ width: `${completed * 50}%` }} /></div>
              <span className="editorial-label shrink-0">{completed}/2</span>
            </div>

            <section className="border-t border-gray-300 py-7 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="editorial-label text-gray-400">01</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{lang === 'da' ? 'Vælg din situation' : 'Choose your situation'}</h2>
                  {path && <p className="mt-2 text-sm text-gray-500">{localized(path.description, lang)}</p>}
                </div>
                {selected && <Check size={20} aria-label={lang === 'da' ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {availableSituations.map((item) => (
                  <button key={item.id} type="button" onClick={() => chooseSituation(item.id)} aria-pressed={selectedSituation === item.id} className="choice-control min-h-24 flex-col items-start justify-center">
                    <span className="block text-sm font-semibold">{localized(item.label, lang)}</span>
                    <span className={`mt-1 block text-xs leading-relaxed ${selectedSituation === item.id ? 'text-white/65' : 'text-gray-500'}`}>{localized(item.result, lang)}</span>
                  </button>
                ))}
              </div>
              {pathFilter && (
                <button type="button" onClick={resetPath} className="mt-4 text-sm font-semibold text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">
                  {lang === 'da' ? 'Se alle situationer' : 'See all situations'}
                </button>
              )}
            </section>

            <section className="border-t border-gray-300 py-7 md:py-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="editorial-label text-gray-400">02</p>
                  <h2 className="mt-2 text-2xl font-semibold text-gray-950">{lang === 'da' ? 'Hvilket felt gælder det?' : 'Which field is involved?'}</h2>
                  <p className="mt-2 text-sm text-gray-500">{lang === 'da' ? 'Feltet hjælper med at afgrænse den relevante arbejdserfaring.' : 'The field helps narrow the relevant work experience.'}</p>
                </div>
                {selectedField && <Check size={20} aria-label={lang === 'da' ? 'Valgt' : 'Selected'} />}
              </div>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {INDUSTRIES.map((industry) => (
                  <button key={industry.id} type="button" onClick={() => setSelectedField(industry.id)} aria-pressed={selectedField === industry.id} className="choice-control">
                    <span>{industry.id}</span>
                    <span className={`h-2 w-9 ${industry.accent}`} aria-hidden="true" />
                  </button>
                ))}
              </div>
            </section>
          </div>

          <aside aria-live="polite" className="h-fit overflow-hidden rounded-md bg-[#09090b] p-6 text-white shadow-[0_24px_70px_rgba(9,9,11,0.14)] lg:sticky lg:top-24 lg:p-7">
            <p className="editorial-label text-white/50">{lang === 'da' ? 'Din adgang' : 'Your access'}</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight">{selected ? localized(selected.label, lang) : lang === 'da' ? 'Start med situationen' : 'Start with the situation'}</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {selected ? localized(selected.result, lang) : lang === 'da' ? 'Dit valg gør det muligt at prioritere relevant erfaring frem for titel eller popularitet.' : 'Your choice lets us prioritize relevant experience over title or popularity.'}
            </p>

            {selected && (
              <dl className="mt-6 border-t border-white/15">
                <div className="border-b border-white/15 py-4">
                  <dt className="editorial-label text-white/50">{lang === 'da' ? 'Indgang' : 'Path'}</dt>
                  <dd className="mt-2 text-sm font-semibold text-white">{localized(accessPath(selected.path).label, lang)}</dd>
                </div>
                <div className="border-b border-white/15 py-4">
                  <dt className="editorial-label text-white/50">{lang === 'da' ? 'Felt' : 'Field'}</dt>
                  <dd className="mt-2 text-sm font-semibold text-white">{selectedField || (lang === 'da' ? 'Vælg felt' : 'Choose a field')}</dd>
                </div>
              </dl>
            )}

            {completed === 2 ? (
              <Link href={profileHref} className="button-inverse mt-6 w-full">
                {lang === 'da' ? 'Se relevant erfaring' : 'See relevant experience'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            ) : (
              <button type="button" disabled className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-[4px] border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/55">
                {lang === 'da' ? 'Vælg situation og felt' : 'Choose situation and field'}
              </button>
            )}
            <p className="mt-4 text-xs leading-relaxed text-white/50">{lang === 'da' ? 'Du opretter først en konto, når du vil sende en bookinganmodning.' : 'You only create an account when you want to send a booking request.'}</p>
          </aside>
        </div>
      </section>
    </main>
  )
}
