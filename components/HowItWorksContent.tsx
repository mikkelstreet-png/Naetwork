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
        ['Før', 'Sæt fokus', 'Vælg ét spørgsmål, del den nødvendige kontekst, og se hvorfor erfaringen er relevant.'],
        ['Under', 'Arbejd på det konkrete', 'Brug 60 minutter på vurdering, modspil eller træning - ikke på introduktioner.'],
        ['Efter', 'Gå videre med et svar', 'Saml konklusionen, de vigtigste risici og de næste handlinger.'],
      ]
    : [
        ['Before', 'Set the focus', 'Choose one question, share the necessary context and see why the experience is relevant.'],
        ['During', 'Work on the concrete issue', 'Use 60 minutes for assessment, challenge or practice, not introductions.'],
        ['After', 'Move forward with an answer', 'Capture the conclusion, main risks and next actions.'],
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
        title={isDa ? 'Et konkret spørgsmål. Et brugbart svar.' : 'One concrete question. One answer you can use.'}
        body={isDa
          ? 'Start med situationen. Vi hjælper dig med at vælge relevant erfaring, forberede samtalen og definere resultatet.'
          : 'Start with the situation. We help you choose relevant experience, prepare the conversation and define the outcome.'}
        action={{ href: '/start', label: isDa ? 'Start med din situation' : 'Start with your situation' }}
        sequence={isDa
          ? ['Situation', 'Relevant erfaring', 'Næste skridt']
          : ['Situation', 'Relevant experience', 'Next step']}
      />

      <section className="public-section">
        <div className="home-shell">
          <div className="section-heading">
            <p className="section-eyebrow">{isDa ? 'Forløbet' : 'The process'}</p>
            <h2>{isDa ? 'Tre trin. Ingen spildtid.' : 'Three steps. No wasted time.'}</h2>
            <p>{isDa ? 'Tiden bruges på det, du faktisk skal have afklaret.' : 'The time is spent on what you actually need to clarify.'}</p>
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
            <p className="section-eyebrow">{isDa ? 'Forventninger' : 'Expectations'}</p>
            <h2>{isDa ? 'Du køber indsigt. Ikke et løfte.' : 'You are buying insight. Not a promise.'}</h2>
            <p>{isDa ? 'Relevant erfaring kan styrke din beslutning. Den kan ikke garantere et bestemt resultat.' : 'Relevant experience can strengthen your decision. It cannot guarantee a particular outcome.'}</p>
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
