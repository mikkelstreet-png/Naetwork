'use client'

import Link from 'next/link'
import { ArrowRight, Check, Clock3 } from 'lucide-react'
import { PublicPageHero } from '@/components/PublicPageHero'
import { RevenueSplit } from '@/components/RevenueSplit'
import { useLanguage } from '@/context/LanguageContext'
import { localized } from '@/lib/brand'
import { CATEGORIES } from '@/lib/categories'
import { PRICE_OPTIONS, SESSION_MINUTES } from '@/lib/platform'
import { SESSION_TYPES } from '@/lib/sessionTypes'

export function SessionsContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={isDa ? 'Karrieresessioner' : 'Career sessions'}
        title={isDa ? 'Et konkret resultat. Én fokuseret time.' : 'A concrete outcome. One focused hour.'}
        body={isDa
          ? 'Vælg mellem syv sessionstyper udviklet til de beslutninger, materialer og processer, studerende og jobsøgende står med.'
          : 'Choose from seven session types designed around the decisions, materials and processes students and jobseekers face.'}
        action={{ href: '/start', label: isDa ? 'Find din session' : 'Find your session' }}
        sequence={isDa
          ? ['Vælg resultat', 'Find relevant erfaring', 'Book 60 minutter']
          : ['Choose outcome', 'Find relevant experience', 'Book 60 minutes']}
      />

      <section className="public-section bg-white">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Sessionkatalog' : 'Session catalogue'}</p>
            <h2>{isDa ? 'Start med det, du vil have hjælp til.' : 'Start with what you need help with.'}</h2>
            <p>{isDa ? 'Alle sessioner varer 60 minutter. Forskellen er forberedelsen og det output, du går derfra med.' : 'Every session lasts 60 minutes. The difference is the preparation and the output you leave with.'}</p>
          </div>

          <div className="mb-10 grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3" aria-label={isDa ? 'Kategorier' : 'Categories'}>
            {CATEGORIES.map((category) => (
              <Link key={category.id} href={`/fields/${category.slug}`} className="bg-white p-5 transition-colors hover:bg-[#f7f7f4]">
                <span className={`mb-4 block h-1.5 w-10 ${category.accent}`} aria-hidden="true" />
                <strong className="text-base text-gray-950">{category.id}</strong>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{category.areas.join(' · ')}</p>
              </Link>
            ))}
          </div>

          <div className="session-catalog">
            {SESSION_TYPES.map((session, index) => (
              <article key={session.id} id={session.id}>
                <div className="session-catalog__meta">
                  <span>0{index + 1}</span>
                  <p>{SESSION_MINUTES} min</p>
                </div>
                <div className="session-catalog__main">
                  <h2>{localized(session.title, lang)}</h2>
                  <p>{localized(session.description, lang)}</p>
                  <p className="mt-3 flex items-start gap-2 text-gray-500"><Check size={14} className="mt-1 shrink-0" aria-hidden="true" />{localized(session.preparation, lang)}</p>
                </div>
                <div className="session-catalog__outcome">
                  <p>{isDa ? 'Du går derfra med' : 'You leave with'}</p>
                  <strong>{localized(session.outcome, lang)}</strong>
                  <ul className="mt-4 space-y-1.5">
                    {session.deliverables[lang].map((item) => <li key={item} className="text-xs font-semibold text-gray-500">— {item}</li>)}
                  </ul>
                </div>
                <div className="session-catalog__action">
                  <span><Clock3 size={14} aria-hidden="true" />{SESSION_MINUTES} min</span>
                  <Link href={`/start?session=${session.id}`} aria-label={`${isDa ? 'Vælg' : 'Choose'} ${localized(session.title, lang)}`}>
                    {isDa ? 'Vælg' : 'Choose'}<ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-section--ink">
        <div className="home-shell pricing-product-layout">
          <div>
            <p className="section-eyebrow text-white/50">{isDa ? 'Samme transparente model' : 'The same transparent model'}</p>
            <h2 className="text-white">{isDa ? 'Prisen ændrer ikke fordelingen.' : 'The price does not change the split.'}</h2>
            <p className="!text-white/55">{isDa ? `Fagpersonen vælger én af fire priser: ${PRICE_OPTIONS.map((price) => `DKK ${price.toLocaleString('da-DK')}`).join(', ')}. Momsen skilles ud, og resten fordeles fast.` : `The professional selects one of four prices: ${PRICE_OPTIONS.map((price) => `DKK ${price.toLocaleString('en-GB')}`).join(', ')}. VAT is separated and the rest follows the fixed split.`}</p>
          </div>
          <RevenueSplit price={PRICE_OPTIONS[0]} locale={lang} tone="dark" />
        </div>
      </section>

      <section className="public-cta">
        <div className="home-shell">
          <h2>{isDa ? 'Ikke sikker på, hvilken session der passer?' : 'Not sure which session fits?'}</h2>
          <p>{isDa ? 'Start med det ønskede resultat. Du kan justere sessionstypen igen i bookingflowet.' : 'Start with the intended outcome. You can adjust the session type again during booking.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Find din session' : 'Find your session'}<ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
