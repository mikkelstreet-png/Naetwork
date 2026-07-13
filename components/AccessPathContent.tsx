'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'
import { ACCESS_SITUATIONS, SESSION_CONCEPTS, accessPath, localized, type AccessPathId } from '@/lib/brand'

export function AccessPathContent({ pathId }: { pathId: AccessPathId }) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const path = accessPath(pathId)
  const situations = ACCESS_SITUATIONS.filter((item) => item.path === pathId)
  const sessions = SESSION_CONCEPTS.filter((item) => item.path === pathId)

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={`${isDa ? 'Din vej ind' : 'Your starting point'} / ${localized(path.label, lang)}`}
        title={localized(path.title, lang)}
        body={localized(path.description, lang)}
        action={{ href: `/start?path=${path.id}`, label: isDa ? 'Beskriv din situation' : 'Describe your situation' }}
        sequence={isDa
          ? ['Genkend situationen', 'Se relevant erfaring', 'Vælg næste skridt']
          : ['Recognize the situation', 'See relevant experience', 'Choose the next step']}
      />

      <section className="public-section">
        <div className="home-shell path-layout">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Hvornår er det relevant?' : 'When is this relevant?'}</p>
            <h2>{isDa ? 'Vælg den situation, der ligner din.' : 'Choose the situation closest to yours.'}</h2>
            <p>{isDa ? 'Valget bruges til at afgrænse den erfaring, som faktisk kan hjælpe.' : 'The choice narrows the experience that can genuinely help.'}</p>
          </div>
          <div className="situation-index">
            {situations.map((item, index) => (
              <Link key={item.id} href={`/start?situation=${item.id}`}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{localized(item.label, lang)}</h3>
                  <p>{localized(item.result, lang)}</p>
                </div>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="public-section public-section--mist">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Relevante sessioner' : 'Relevant sessions'}</p>
            <h2>{isDa ? 'Et tydeligt formål med de 60 minutter.' : 'A clear purpose for the 60 minutes.'}</h2>
          </div>
          <div className="path-session-list">
            {sessions.map((item, index) => (
              <div key={item.id}>
                <span>0{index + 1}</span>
                <h3>{localized(item.title, lang)}</h3>
                <p>{localized(item.outcome, lang)}</p>
              </div>
            ))}
          </div>
          <Link href="/sessions" className="button-secondary home-inline-action">
            {isDa ? 'Sammenlign alle sessioner' : 'Compare all sessions'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
