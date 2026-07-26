'use client'

import { useEffect, useRef } from 'react'
import {
  recordClientProductEvent,
  type PublicProductEventSurface,
} from '@/lib/clientProductAnalytics'
import styles from './SessionPlanPreview.module.css'

type SessionPlanLocale = 'da' | 'en'
type SessionPlanTone = 'light' | 'dark'

interface SessionPlanPreviewProps {
  locale?: SessionPlanLocale
  tone?: SessionPlanTone
  compact?: boolean
  headingLevel?: 'h2' | 'h3'
  className?: string
  trackingSurface?: PublicProductEventSurface
}

const COPY = {
  da: {
    ariaLabel: 'Eksempel på en Naetwork Session Plan',
    eyebrow: 'Eksempel på din leverance',
    title: 'Fra problem til dokumenteret næste træk.',
    body: 'Session Plan samler din refleksion, sessionens fokus og det resultat, du skal handle på bagefter.',
    exampleLabel: 'Illustrativt eksempel · jobsamtaletræning',
    stages: [
      {
        number: '01',
        title: 'Reflektér',
        description: 'Gør problemet konkret, og definér hvad en værdifuld session skal gøre tydeligere.',
        fields: [
          ['Problem', 'Jeg skal til mit første interview i en rolle, jeg ikke har haft før.'],
          ['Ønsket resultat', 'Forstå hvad der bliver vurderet, og hvilke svar jeg skal styrke.'],
        ],
      },
      {
        number: '02',
        title: 'Gennemgå',
        description: 'Brug planen som fælles agenda med en professionel, der kender processen indefra.',
        fields: [
          ['Fokus', 'Motivation, relevante eksempler og de vigtigste blinde vinkler.'],
          ['Indsigt', 'Svarene skal være kortere og tydeligere koblet til rollen.'],
        ],
      },
      {
        number: '03',
        title: 'Handl',
        description: 'Saml anbefalingen og højst tre prioriterede handlinger, mens sessionen er frisk.',
        fields: [
          ['Anbefaling', 'Prioritér tre stærke eksempler før bredere interviewtræning.'],
          ['Næste træk', 'Omskriv eksemplerne og test dem højt inden fredag.'],
        ],
      },
    ],
    proof: ['Forberedt før', 'Fokuseret under', 'Dokumenteret efter'],
  },
  en: {
    ariaLabel: 'Example of a Naetwork Session Plan',
    eyebrow: 'Example of your deliverable',
    title: 'From problem to a documented next move.',
    body: 'The Session Plan brings together your reflection, the focus of the session and the outcome you need to act on afterwards.',
    exampleLabel: 'Illustrative example · interview training',
    stages: [
      {
        number: '01',
        title: 'Reflect',
        description: 'Make the problem concrete and define what a valuable session needs to clarify.',
        fields: [
          ['Problem', 'I am preparing for my first interview in a role I have not held before.'],
          ['Desired outcome', 'Understand what is assessed and which answers I need to strengthen.'],
        ],
      },
      {
        number: '02',
        title: 'Review',
        description: 'Use the plan as a shared agenda with a professional who knows the process from within.',
        fields: [
          ['Focus', 'Motivation, relevant examples and the most important blind spots.'],
          ['Insight', 'The answers need to be shorter and more clearly connected to the role.'],
        ],
      },
      {
        number: '03',
        title: 'Act',
        description: 'Capture the recommendation and no more than three prioritized actions while the session is fresh.',
        fields: [
          ['Recommendation', 'Prioritize three strong examples before broader interview practice.'],
          ['Next move', 'Rewrite the examples and test them out loud before Friday.'],
        ],
      },
    ],
    proof: ['Prepared before', 'Focused during', 'Documented after'],
  },
} as const

export function SessionPlanPreview({
  locale = 'da',
  tone = 'light',
  compact = false,
  headingLevel = 'h2',
  className = '',
  trackingSurface,
}: SessionPlanPreviewProps) {
  const copy = COPY[locale]
  const Heading = headingLevel
  const rootRef = useRef<HTMLElement>(null)
  const viewRecordedRef = useRef(false)

  useEffect(() => {
    const element = rootRef.current
    if (!element || !trackingSurface || viewRecordedRef.current) return

    const recordView = () => {
      if (viewRecordedRef.current) return
      viewRecordedRef.current = true
      recordClientProductEvent({
        eventName: 'session_plan_example_viewed',
        surface: trackingSurface,
      })
    }

    if (!('IntersectionObserver' in window)) {
      recordView()
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.2)) {
        recordView()
        observer.disconnect()
      }
    }, { threshold: 0.2 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [trackingSurface])

  return (
    <section
      ref={rootRef}
      aria-label={copy.ariaLabel}
      className={`${styles.root} ${compact ? styles.compact : ''} ${className}`.trim()}
      data-tone={tone}
      data-session-plan-preview
    >
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <Heading className={styles.title}>{copy.title}</Heading>
        </div>
        <p className={styles.intro}>{copy.body}</p>
      </div>

      <p className={styles.exampleLabel}>{copy.exampleLabel}</p>

      <ol className={styles.stages}>
        {copy.stages.map((stage, index) => (
          <li key={stage.number} className={styles.stage}>
            <div className={styles.stageHeading}>
              <span>{stage.number}</span>
              <p className={styles.stageTitle}>{stage.title}</p>
            </div>
            <p className={styles.stageDescription}>{stage.description}</p>
            <dl className={styles.fields}>
              {stage.fields.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {index < copy.stages.length - 1 && <span className={styles.connector} aria-hidden="true">→</span>}
          </li>
        ))}
      </ol>

      <div className={styles.proof} aria-label={locale === 'da' ? 'Session Plan-forløb' : 'Session Plan journey'}>
        {copy.proof.map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  )
}
