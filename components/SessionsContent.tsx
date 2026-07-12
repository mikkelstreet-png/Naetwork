'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_PATHS, SESSION_CONCEPTS, accessPath, localized } from '@/lib/brand'
import { SESSION_MINUTES } from '@/lib/platform'
import { PublicPageHero } from '@/components/PublicPageHero'

export function SessionsContent() {
  const { lang } = useLanguage()

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={`Career Access / ${lang === 'da' ? 'Sessioner' : 'Sessions'}`}
        title={lang === 'da' ? 'Start med resultatet, du har brug for.' : 'Start with the outcome you need.'}
        body={lang === 'da'
          ? `Alle sessioner varer ${SESSION_MINUTES} minutter. Forskellen ligger i situationen, forberedelsen og det konkrete resultat.`
          : `Every session lasts ${SESSION_MINUTES} minutes. The difference is the situation, preparation and concrete outcome.`}
        action={{ href: '/start', label: lang === 'da' ? 'Find den relevante session' : 'Find the relevant session' }}
        sequence={lang === 'da'
          ? ['Situation', 'Relevant erfaring', 'Konkret resultat']
          : ['Situation', 'Relevant experience', 'Concrete outcome']}
      />

      <section className="px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="border-t border-gray-200">
            {SESSION_CONCEPTS.map((session, index) => {
              const path = accessPath(session.path)
              return (
                <article key={session.id} id={session.id} className="grid gap-4 border-b border-gray-200 py-7 md:grid-cols-[70px_280px_1fr_auto] md:items-start md:gap-8">
                  <p className="editorial-label text-gray-400">{String(index + 1).padStart(2, '0')}</p>
                  <div>
                    <p className="editorial-label mb-2">{localized(path.label, lang)}</p>
                    <h2 className="text-2xl font-semibold text-gray-950">{session.title}</h2>
                  </div>
                  <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{localized(session.outcome, lang)}</p>
                  <Link href={`/start?path=${session.path}`} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">
                    {lang === 'da' ? 'Start her' : 'Start here'}
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </article>
              )
            })}
          </div>

          <div className="mt-12 grid gap-4 border-y border-gray-300 py-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-950">{lang === 'da' ? 'Ikke sikker på sessionen?' : 'Not sure which session fits?'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{lang === 'da' ? 'Beskriv situationen. Naetwork hjælper dig med at vælge den relevante indgang.' : 'Describe the situation. Naetwork helps you choose the relevant starting point.'}</p>
            </div>
            <Link href="/start" className="button-primary w-fit">
              {lang === 'da' ? 'Start med din situation' : 'Start with your situation'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <nav aria-label={lang === 'da' ? 'Indgange til sessioner' : 'Session pathways'} className="mt-10 flex flex-wrap gap-2">
            {ACCESS_PATHS.map((path) => (
              <Link key={path.id} href={path.href} className="button-secondary min-h-10 px-4 py-2 text-xs">
                {localized(path.label, lang)}
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </main>
  )
}
