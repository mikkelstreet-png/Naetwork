import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookiepolitik - Naetwork',
  description: 'Læs hvordan Naetwork bruger nødvendige cookies og lokal lagring.',
}

const updated = '18. juni 2026'

const cookieRows = [
  ['cookie_consent', 'Gemmer dit valg i cookie-banneret', 'Lokal lagring', 'Nødvendig'],
  ['naetwork_lang', 'Gemmer dit valgte sprog', 'Lokal lagring', 'Funktionel'],
  ['Supabase auth/session', 'Holder dig logget ind og beskytter din konto', 'Cookie eller lokal lagring', 'Nødvendig'],
]

const sections = [
  {
    title: '1. Kort fortalt',
    body: [
      'Naetwork bruger kun cookies og lokal lagring, når det hjælper platformen med at fungere, holde dig logget ind, huske sprogvalg eller gemme dine cookiepræferencer.',
      'Vi bruger ikke reklamecookies på nuværende tidspunkt. Hvis vi senere tilføjer analytics eller marketingcookies, skal det beskrives tydeligt og kræve samtykke, hvor loven kræver det.',
    ],
  },
  {
    title: '2. Nødvendige cookies',
    body: [
      'Nødvendige cookies bruges til login, sikkerhed, sessioner og basale funktioner. De kan normalt ikke fravælges, fordi platformen ellers ikke fungerer korrekt.',
    ],
  },
  {
    title: '3. Funktionelle valg',
    body: [
      'Vi kan gemme valg som sprog og cookiepræference lokalt i browseren. Det gør oplevelsen mere stabil uden at bruge oplysningerne til reklameprofilering.',
    ],
  },
  {
    title: '4. Sådan ændrer du valg',
    body: [
      'Du kan altid slette cookies og lokal lagring i din browser. Hvis du gør det, kan du blive logget ud, og Naetwork kan spørge om dine valg igen.',
      'Hvis Naetwork senere bruger ikke-nødvendige cookies, skal du kunne ændre eller trække samtykke tilbage på en tilsvarende enkel måde.',
    ],
  },
  {
    title: '5. Privatliv',
    body: ['Du kan læse mere om vores behandling af personoplysninger i privatlivspolitikken.'],
    link: { href: '/privacy', label: 'Læs privatlivspolitik' },
  },
]

export default function CookiesPage() {
  return (
    <main className="bg-[#f7f7f4] pt-16">
      <section className="border-b border-gray-200 bg-white px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="mb-8 inline-flex rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm hover:text-gray-950">&larr; Naetwork</Link>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Legal</p>
          <h1 className="max-w-4xl text-4xl font-black leading-none tracking-tight text-gray-950 md:text-6xl">Cookiepolitik</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">En enkel oversigt over cookies og lokal lagring på Naetwork.</p>
          <p className="mt-6 text-sm font-medium text-gray-400">Senest opdateret: {updated}</p>
        </div>
      </section>

      <section className="px-6 py-10 md:py-14">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="grid grid-cols-4 border-b border-gray-100 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-gray-400">
              <span>Navn</span><span>Formål</span><span>Type</span><span>Kategori</span>
            </div>
            {cookieRows.map(([name, purpose, type, category]) => (
              <div key={name} className="grid grid-cols-1 gap-2 border-b border-gray-100 px-4 py-4 text-sm last:border-b-0 md:grid-cols-4">
                <span className="font-semibold text-gray-950">{name}</span>
                <span className="text-gray-600">{purpose}</span>
                <span className="text-gray-500">{type}</span>
                <span className="font-medium text-gray-700">{category}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <article key={section.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-xl font-black text-gray-950">{section.title}</h2>
                <div className="mt-4 space-y-3">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-relaxed text-gray-600">{paragraph}</p>
                  ))}
                </div>
                {section.link && (
                  <Link href={section.link.href} className="mt-5 inline-flex rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-950 hover:border-gray-950 hover:bg-gray-50">
                    {section.link.label}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
