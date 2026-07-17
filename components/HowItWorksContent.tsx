'use client'

import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { PublicPageHero } from '@/components/PublicPageHero'
import { useLanguage } from '@/context/LanguageContext'

export function HowItWorksContent() {
  const { lang } = useLanguage()
  const isDa = lang === 'da'

  const stages = isDa
    ? [
        ['Før sessionen', 'Beskriv situationen', 'Vælg ét spørgsmål, del den nødvendige kontekst, og se hvorfor den professionelles erfaring er relevant.'],
        ['I sessionen', 'Arbejd på det konkrete', 'Brug 60 minutter på vurdering, modspil eller træning - ikke på at forklare hele din baggrund fra bunden.'],
        ['Efter sessionen', 'Gå videre med et svar', 'Saml konklusionen, de væsentligste risici og de næste handlinger, mens samtalen stadig er frisk.'],
      ]
    : [
        ['Before the session', 'Describe the situation', 'Choose one question, share the necessary context and see why the professional experience is relevant.'],
        ['During the session', 'Work on the concrete issue', 'Use 60 minutes for assessment, challenge or practice, not for explaining your entire background from scratch.'],
        ['After the session', 'Move forward with an answer', 'Capture the conclusion, main risks and next actions while the conversation is still fresh.'],
      ]

  const included = isDa
    ? ['En professionel med relevant, gennemgået erfaring', 'Et brief med ét tydeligt fokus', '60 minutters konkret sparring', 'En klar vurdering og prioriterede næste skridt']
    : ['A professional with relevant, reviewed experience', 'A brief with one clear focus', '60 minutes of concrete discussion', 'A clear assessment and prioritized next steps']

  const notIncluded = isDa
    ? ['Garanti for job, interview eller tilbud', 'Juridisk, skattemæssig eller terapeutisk rådgivning', 'Fortrolige oplysninger om arbejdsgivere', 'En erstatning for din egen vurdering']
    : ['A guarantee of a job, interview or offer', 'Legal, tax or therapeutic advice', 'Confidential employer information', 'A substitute for your own judgment']

  return (
    <main className="page-shell">
      <PublicPageHero
        eyebrow={isDa ? 'Sådan fungerer Naetwork' : 'How Naetwork works'}
        title={isDa ? 'Fra spørgsmål til et brugbart svar.' : 'From a question to an answer you can use.'}
        body={isDa
          ? 'Du starter med situationen. Naetwork hjælper dig med at finde en fagperson, der kender forventningerne indefra, og gøre resultatet konkret.'
          : 'You start with the situation. Naetwork helps you find relevant experience, prepare the conversation and make the outcome concrete.'}
        action={{ href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' }}
        sequence={isDa
          ? ['Din situation', 'Indsigt indefra', 'En konkret plan']
          : ['Situation', 'Relevant experience', 'Next step']}
      />

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Hele forløbet' : 'The complete journey'}</p>
            <h2>{isDa ? 'Forberedt før. Fokuseret under. Konkret efter.' : 'Prepared before. Focused during. Concrete after.'}</h2>
            <p>{isDa ? 'Strukturen er enkel, fordi tiden skal bruges på det, du faktisk skal have afklaret.' : 'The structure is simple because the time should be spent on what you actually need to clarify.'}</p>
          </div>
          <ol className="editorial-journey">
            {stages.map(([stage, title, body], index) => (
              <li key={stage}>
                <span>0{index + 1}</span>
                <p>{stage}</p>
                <h3>{title}</h3>
                <div>{body}</div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="public-section public-section--mist">
        <div className="home-shell clarity-split">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Klar forventningsafstemning' : 'Clear expectations'}</p>
            <h2>{isDa ? 'Hvad du får - og hvad du ikke køber.' : 'What you get - and what you are not buying.'}</h2>
            <p>{isDa ? 'Naetwork giver adgang til erfaring og et bedre beslutningsgrundlag. Ikke løfter, der ikke kan holdes.' : 'Naetwork provides access to experience and a better basis for a decision, not promises that cannot be kept.'}</p>
          </div>
          <div className="clarity-columns">
            <div>
              <h3>{isDa ? 'Det kan du forvente' : 'What to expect'}</h3>
              {included.map((item) => <p key={item}><Check size={16} aria-hidden="true" />{item}</p>)}
            </div>
            <div>
              <h3>{isDa ? 'Det lover Naetwork ikke' : 'What Naetwork does not promise'}</h3>
              {notIncluded.map((item) => <p key={item}><X size={16} aria-hidden="true" />{item}</p>)}
            </div>
          </div>
        </div>
      </section>

      <section className="public-cta">
        <div className="home-shell">
          <h2>{isDa ? 'Hvilken beslutning står du med?' : 'What decision are you facing?'}</h2>
          <p>{isDa ? 'Start uden at oprette en konto. Vælg situationen, og se hvilken erfaring der er relevant.' : 'Start without creating an account. Choose the situation and see what experience is relevant.'}</p>
          <Link href="/start" className="button-primary">
            {isDa ? 'Start med din situation' : 'Start with your situation'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  )
}
