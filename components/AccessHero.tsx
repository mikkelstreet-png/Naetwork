'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, Clock3 } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY, situation, type SituationId } from '@/lib/brand'

const HERO_SITUATIONS = [
  {
    id: 'role',
    shortLabel: { da: 'Rolle', en: 'Role' },
    access: {
      da: ['Har udført arbejdet', 'Kender de reelle forventninger', 'Kan forklare kompromiserne'],
      en: ['Has done the work', 'Knows the real expectations', 'Can explain the trade-offs'],
    },
  },
  {
    id: 'cv',
    shortLabel: { da: 'CV', en: 'CV' },
    access: {
      da: ['Kender kravene til rollen', 'Har vurderet lignende profiler', 'Kan prioritere ændringerne'],
      en: ['Knows the role requirements', 'Has assessed similar profiles', 'Can prioritize the changes'],
    },
  },
  {
    id: 'interview',
    shortLabel: { da: 'Samtale', en: 'Interview' },
    access: {
      da: ['Har haft rollen', 'Har interviewet kandidater', 'Kan træne det sandsynlige format'],
      en: ['Has held the role', 'Has interviewed candidates', 'Can rehearse the likely format'],
    },
  },
  {
    id: 'pivot',
    shortLabel: { da: 'Karriereskift', en: 'Career change' },
    access: {
      da: ['Kender overgangen', 'Kan se overførbare styrker', 'Kan udfordre en realistisk plan'],
      en: ['Knows the transition', 'Can identify transferable strengths', 'Can challenge a realistic plan'],
    },
  },
  {
    id: 'offer',
    shortLabel: { da: 'Tilbud', en: 'Offer' },
    access: {
      da: ['Forstår rollens mandat', 'Kender vilkår og risici', 'Kan skærpe dine forhandlingspunkter'],
      en: ['Understands the mandate', 'Knows the terms and risks', 'Can sharpen your negotiation points'],
    },
  },
] as const satisfies ReadonlyArray<{
  id: SituationId
  shortLabel: { da: string; en: string }
  access: { da: readonly string[]; en: readonly string[] }
}>

export function AccessHero() {
  const { lang } = useLanguage()
  const [selectedId, setSelectedId] = useState<SituationId>('role')
  const copy = BRAND_COPY[lang]
  const selected = situation(selectedId)
  const preview = HERO_SITUATIONS.find((item) => item.id === selectedId)!
  const isDa = lang === 'da'

  return (
    <section id="home" className="access-hero" data-interactive="true">
      <Image
        src="/naetwork-spectrum.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="access-hero__spectrum"
      />
      <div className="access-hero__veil" aria-hidden="true" />

      <div className="access-hero__shell">
        <div className="access-hero__meta">
          <p>{copy.category}</p>
          <p className="access-hero__positioning">{isDa ? 'Relevant erfaring. Ét konkret spørgsmål.' : 'Relevant experience. One concrete question.'}</p>
        </div>

        <div className="access-hero__copy">
          <p className="kicker text-white/62">{isDa ? 'Karriereindsigt fra mennesker, der har været der' : 'Career insight from people who have been there'}</p>
          <h1>{copy.primaryLine}</h1>
          <p className="access-hero__intro">{copy.oneSentence}</p>
          <div className="access-hero__actions">
            <Link href={`/start?situation=${selectedId}`} className="button-inverse">
              {isDa ? 'Beskriv din situation' : 'Describe your situation'}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/how-it-works" className="button-ghost-light">
              {isDa ? 'Sådan fungerer det' : 'How it works'}
            </Link>
          </div>
          <ul className="access-hero__facts" aria-label={isDa ? 'Praktisk information' : 'Practical information'}>
            <li><Clock3 size={14} aria-hidden="true" /> {isDa ? '60 minutter' : '60 minutes'}</li>
            <li>{isDa ? 'Fra DKK 600 inkl. moms' : 'From DKK 600 incl. VAT'}</li>
            <li>{isDa ? 'Mindst 40% af pris ekskl. moms afsættes' : 'At least 40% of the price excl. VAT is allocated'}</li>
          </ul>
        </div>

        <div className="access-brief">
          <div className="access-brief__header">
            <div>
              <p className="access-brief__eyebrow">{isDa ? 'Start her' : 'Start here'}</p>
              <h2>{isDa ? 'Hvad står du overfor?' : 'What are you facing?'}</h2>
            </div>
            <p>{isDa ? 'Vælg den situation, der ligger tættest på.' : 'Choose the situation closest to yours.'}</p>
          </div>

          <div className="access-brief__choices" role="group" aria-label={isDa ? 'Karrieresituation' : 'Career situation'}>
            {HERO_SITUATIONS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selectedId === item.id}
                aria-label={situation(item.id).label[lang]}
                onClick={() => setSelectedId(item.id)}
              >
                <span className="access-brief__number">0{index + 1}</span>
                <span>{item.shortLabel[lang]}</span>
              </button>
            ))}
          </div>

          <div className="access-brief__result" aria-live="polite">
            <div className="access-brief__situation">
              <p className="access-brief__eyebrow">{isDa ? 'Dit fokus' : 'Your focus'}</p>
              <p className="access-brief__situation-title">{selected.label[lang]}</p>
              <p className="access-brief__situation-body">{selected.result[lang]}</p>
            </div>
            <div className="access-brief__relevance">
              <p className="access-brief__eyebrow">{isDa ? 'Vi prioriterer erfaring fra en, der' : 'We prioritize someone who'}</p>
              <ul>
                {preview.access[lang].map((item) => (
                  <li key={item}>
                    <Check size={13} strokeWidth={2} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href={`/start?situation=${selectedId}`} className="access-brief__continue">
                {isDa ? 'Fortsæt' : 'Continue'}
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
