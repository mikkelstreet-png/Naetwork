import Link from 'next/link'

export interface LegalSection {
  id: string
  title: string
  body: string[]
  bullets?: string[]
  link?: { href: string; label: string; external?: boolean }
}

interface LegalDocumentProps {
  title: string
  intro: string
  updated: string
  facts: Array<[string, string]>
  sections: LegalSection[]
}

export function LegalDocument({ title, intro, updated, facts, sections }: LegalDocumentProps) {
  return (
    <main className="bg-white">
      <header className="border-b border-gray-200 bg-[#f1f1ec] px-5 py-12 sm:px-8 md:py-20 lg:px-12">
        <div className="mx-auto max-w-[82rem]">
          <Link href="/" className="inline-flex text-sm font-black text-gray-500 transition-colors hover:text-gray-950">&larr; Naetwork</Link>
          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="kicker mb-5">Juridisk</p>
              <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
              <h1 className="display-xl max-w-4xl">{title}</h1>
              <p className="body-lg mt-6 max-w-2xl">{intro}</p>
              <p className="mt-5 text-xs font-semibold text-gray-400">Senest opdateret {updated}</p>
            </div>
            <dl className="border-t border-gray-200">
              {facts.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[110px_1fr] gap-4 border-b border-gray-200 py-3 text-sm">
                  <dt className="text-gray-400">{label}</dt>
                  <dd className="font-bold text-gray-950">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[82rem] gap-12 px-5 py-12 sm:px-8 md:py-20 lg:grid-cols-[240px_1fr] lg:gap-20 lg:px-12">
        <aside className="h-fit lg:sticky lg:top-24">
          <p className="kicker mb-4">Indhold</p>
          <nav aria-label={`Indhold i ${title}`} className="border-t border-gray-200">
            {sections.map((section, index) => (
              <a key={section.id} href={`#${section.id}`} className="grid grid-cols-[28px_1fr] gap-2 border-b border-gray-200 py-3 text-xs font-bold leading-relaxed text-gray-500 transition-colors hover:text-gray-950">
                <span className="text-gray-300">{String(index + 1).padStart(2, '0')}</span>
                <span>{section.title.replace(/^\d+\.\s*/, '')}</span>
              </a>
            ))}
          </nav>
        </aside>

        <div className="border-t border-gray-200">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24 border-b border-gray-200 py-8 md:py-10">
              <h2 className="text-xl font-black text-gray-950 md:text-2xl">{section.title}</h2>
              <div className="mt-4 max-w-3xl space-y-4">
                {section.body.map((paragraph) => <p key={paragraph} className="text-sm leading-7 text-gray-600">{paragraph}</p>)}
                {section.bullets && (
                  <ul className="space-y-3 pt-1">
                    {section.bullets.map((item) => <li key={item} className="grid grid-cols-[16px_1fr] gap-3 text-sm leading-7 text-gray-600"><span aria-hidden="true">•</span><span>{item}</span></li>)}
                  </ul>
                )}
              </div>
              {section.link && (
                section.link.external
                  ? <a href={section.link.href} target="_blank" rel="noreferrer" className="mt-5 inline-flex text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">{section.link.label}</a>
                  : <Link href={section.link.href} className="mt-5 inline-flex text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">{section.link.label}</Link>
              )}
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
