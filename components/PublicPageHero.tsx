import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface PublicPageHeroProps {
  eyebrow: string
  title: string
  body: string
  action?: {
    href: string
    label: string
  }
  sequence?: readonly [string, string, string]
}

export function PublicPageHero({ eyebrow, title, body, action, sequence }: PublicPageHeroProps) {
  return (
    <section className="public-hero">
      <Image
        src="/naetwork-spectrum.webp"
        alt=""
        fill
        sizes="100vw"
        className="public-hero__spectrum"
      />
      <div className="public-hero__veil" aria-hidden="true" />
      <div className="public-hero__inner">
        <div className="public-hero__content">
          <p className="section-eyebrow text-white/62">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="public-hero__body">{body}</p>
          {action && (
            <Link href={action.href} className="button-inverse public-hero__action">
              {action.label}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          )}
        </div>
        {sequence && (
          <ol className="public-hero__sequence">
            {sequence.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}
          </ol>
        )}
      </div>
    </section>
  )
}
