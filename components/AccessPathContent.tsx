'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_SITUATIONS, SESSION_CONCEPTS, accessPath, localized, type AccessPathId } from '@/lib/brand'
import { PublicPageHero } from '@/components/PublicPageHero'

export function AccessPathContent({ pathId }: { pathId: AccessPathId }) {
  const { lang } = useLanguage()
  const path = accessPath(pathId)
  const situations = ACCESS_SITUATIONS.filter((item) => item.path === pathId)
  const sessions = SESSION_CONCEPTS.filter((item) => item.path === pathId)

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={`Career Access / ${path.label[lang]}`}
        title={localized(path.title, lang)}
        body={localized(path.description, lang)}
        action={{ href: `/start?path=${path.id}`, label: lang === 'da' ? 'Start med din situation' : 'Start with your situation' }}
        sequence={lang === 'da'
          ? ['Genkend situationen', 'Vælg relevant erfaring', 'Få et næste skridt']
          : ['Recognize the situation', 'Choose relevant experience', 'Get a next step']}
      />

      <section className="px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="kicker mb-5">{lang === 'da' ? 'Genkend situationen' : 'Recognize the situation'}</p>
            <h2 className="display-lg">
              {lang === 'da' ? 'Start med beslutningen foran dig.' : 'Start with the decision in front of you.'}
            </h2>
          </div>
          <div className="border-t border-gray-200">
            {situations.map((item, index) => (
              <Link key={item.id} href={`/start?situation=${item.id}`} className="group grid gap-3 border-b border-gray-200 py-6 sm:grid-cols-[54px_1fr_auto] sm:items-start sm:gap-6">
                <span className="editorial-label text-gray-400">0{index + 1}</span>
                <span>
                  <span className="block font-['Space_Grotesk'] text-xl font-semibold text-gray-950">{localized(item.label, lang)}</span>
                  <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-gray-600">{localized(item.result, lang)}</span>
                </span>
                <ArrowRight className="mt-1 text-gray-400 transition-colors group-hover:text-gray-950" size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-6 md:grid-cols-[0.75fr_1.25fr] md:items-end">
            <p className="kicker">{lang === 'da' ? 'Relevante sessioner' : 'Relevant sessions'}</p>
            <h2 className="display-lg">{lang === 'da' ? 'Et konkret resultat. Ikke bare en samtale.' : 'A concrete outcome. Not just a conversation.'}</h2>
          </div>
          <div className="mt-9 border-t border-gray-200">
            {sessions.map((item) => (
              <div key={item.id} className="grid gap-3 border-b border-gray-200 py-6 md:grid-cols-[260px_1fr] md:gap-8">
                <h3 className="text-xl font-semibold text-gray-950">{item.title}</h3>
                <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{localized(item.outcome, lang)}</p>
              </div>
            ))}
          </div>
          <Link href="/sessions" className="button-secondary mt-8">
            {lang === 'da' ? 'Se alle sessioner' : 'See all sessions'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
