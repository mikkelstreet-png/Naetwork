'use client'

import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'
import { BRAND_COPY } from '@/lib/brand'

export function HowItWorksContent() {
  const { lang } = useLanguage()
  const copy = BRAND_COPY[lang]
  const steps = lang === 'da'
    ? [
        ['Fortæl, hvad du overvejer', 'Start med rollen, virksomheden, ansøgningen eller beslutningen foran dig.'],
        ['Mød relevant erfaring', 'Naetwork hjælper dig frem til mennesker, der kender situationen fra den anden side.'],
        ['Gå videre med klarhed', 'Brug sessionen på et konkret spørgsmål og slut med prioriterede næste skridt.'],
      ]
    : [
        ['Tell us what you are considering', 'Start with the role, company, application or decision in front of you.'],
        ['Meet relevant experience', 'Naetwork helps you reach people who know the situation from the other side.'],
        ['Leave with clarity', 'Use the session for one concrete question and finish with prioritized next steps.'],
      ]

  const boundaries = lang === 'da'
    ? ['Ikke et socialt netværk', 'Ikke et offentligt CV', 'Ikke generisk karrierecoaching', 'Ikke en jobportal']
    : ['Not a social network', 'Not a public CV', 'Not generic career coaching', 'Not a job board']

  return (
    <main className="page-shell">
      <section className="border-b border-white/15 bg-[#09090b] px-5 py-12 text-white sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <p className="kicker mb-5 text-white/50">{copy.category}</p>
          <h1 className="display-xl max-w-5xl text-white">{copy.positioning}</h1>
          <p className="body-lg mt-7 max-w-2xl text-white/65">{copy.oneSentence}</p>
          <Link href="/start" className="button-inverse mt-8">
            {lang === 'da' ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="px-5 py-14 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr] md:items-end">
            <p className="kicker">{lang === 'da' ? 'Fra situation til næste skridt' : 'From situation to next step'}</p>
            <h2 className="display-lg">{lang === 'da' ? 'Tre trin. Ét konkret spørgsmål.' : 'Three steps. One concrete question.'}</h2>
          </div>
          <ol className="mt-10 grid border-l border-t border-gray-300 md:grid-cols-3">
            {steps.map(([title, body], index) => (
              <li key={title} className="min-h-[220px] border-b border-r border-gray-300 bg-white p-6">
                <p className="editorial-label text-gray-400">0{index + 1}</p>
                <h3 className="mt-10 text-2xl font-semibold text-gray-950">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white px-5 py-14 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto grid max-w-[82rem] gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="kicker mb-5">{lang === 'da' ? 'Hvorfor Naetwork findes' : 'Why Naetwork exists'}</p>
            <h2 className="display-lg max-w-3xl">{copy.problem}</h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600">
              {lang === 'da'
                ? 'Naetwork gør den viden mindre tilfældig: relevant erfaring bliver struktureret omkring den beslutning, du faktisk står overfor.'
                : 'Naetwork makes that knowledge less random by structuring relevant experience around the decision you actually face.'}
            </p>
          </div>
          <aside className="border-t border-gray-300">
            {boundaries.map((item) => (
              <p key={item} className="flex items-center gap-3 border-b border-gray-300 py-4 text-sm font-semibold text-gray-700">
                <Check size={15} aria-hidden="true" />
                {item}
              </p>
            ))}
          </aside>
        </div>
      </section>
    </main>
  )
}
