import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AI_CATEGORIES } from '@/lib/constants';

const categoryIcons: Record<string, string> = {
  'AI kundeservice': '💬',
  'AI salgsassistent': '📈',
  'Indholdsmotor': '✍️',
  'Rapportautomatisering': '📊',
  'Intern AI-assistent': '🤖',
  'Hjemmeside/MVP med AI': '🌐',
  'AI til tilbud og forslag': '📝',
  'AI workflows til administration': '⚙️',
  'Marked- og konkurrentanalyse': '🔍',
  'AI-opsætning for teamet': '👥',
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="border-b border-[#e5e5e5] bg-white">
        <div className="wrap py-20 sm:py-28 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-[#0a0a0a]">
            Get AI working in your business. Fast.
          </h1>
          <p className="mt-5 text-lg text-[#6b7280] leading-relaxed max-w-xl">
            Post dit AI-projekt gratis. Relevante AI-specialister kan melde interesse direkte. Aftaler indgås direkte mellem jer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projekt/opret"
              className="inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors"
            >
              Opret AI-projekt
            </Link>
            <Link
              href="/specialist"
              className="inline-flex items-center justify-center rounded-md border border-[#e5e5e5] bg-white px-5 py-2.5 text-[14px] font-medium text-[#0a0a0a] hover:bg-[#f9f9f9] transition-colors"
            >
              Bliv specialist
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-[#6b7280]">
            Gratis · Uafhængigt initiativ · Ingen platformsgebyrer · Aftaler indgås direkte mellem brugere
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
        <div className="wrap py-16">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-[#6b7280] mb-10">Sådan fungerer det</h2>
          <div className="grid sm:grid-cols-2 gap-10">
            <div>
              <h3 className="text-[16px] font-semibold text-[#0a0a0a] mb-4">For virksomheder</h3>
              <ol className="space-y-3">
                {[
                  'Opret dit AI-projekt gratis',
                  'AI-specialister gennemser og melder interesse',
                  'Du kontakter relevante specialister direkte',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[#374151]">
                    <span className="flex-none flex items-center justify-center w-6 h-6 rounded-full bg-[#1a1a1a] text-white text-[12px] font-medium mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link
                href="/projekt/opret"
                className="mt-6 inline-flex items-center text-[13px] font-medium text-[#0a0a0a] hover:text-[#374151] underline underline-offset-4"
              >
                Opret projekt →
              </Link>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-[#0a0a0a] mb-4">For specialister</h3>
              <ol className="space-y-3">
                {[
                  'Opret din specialistprofil',
                  'Gennemse åbne AI-projekter fra virksomheder',
                  'Meld interesse — virksomheden kontakter dig direkte',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[14px] text-[#374151]">
                    <span className="flex-none flex items-center justify-center w-6 h-6 rounded-full border border-[#e5e5e5] bg-white text-[12px] font-medium mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
              <Link
                href="/specialist"
                className="mt-6 inline-flex items-center text-[13px] font-medium text-[#0a0a0a] hover:text-[#374151] underline underline-offset-4"
              >
                Bliv specialist →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-b border-[#e5e5e5]">
        <div className="wrap py-16">
          <h2 className="text-[13px] font-medium uppercase tracking-widest text-[#6b7280] mb-10">AI-kategorier</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {AI_CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="rounded-xl border border-[#e5e5e5] bg-[#f9f9f9] p-4 flex flex-col gap-2"
              >
                <span className="text-2xl">{categoryIcons[cat] ?? '✦'}</span>
                <span className="text-[13px] font-medium text-[#0a0a0a] leading-snug">{cat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
        <div className="wrap py-10">
          <div className="rounded-xl border border-[#e5e5e5] bg-white p-6 max-w-2xl">
            <p className="text-[13px] text-[#6b7280] leading-relaxed">
              <strong className="text-[#374151]">Uafhængigt initiativ.</strong>{' '}
              Naetwork er et gratis, ikke-kommercielt og uafhængigt initiativ. Platformen fungerer udelukkende som en opslagstavle. Alle aftaler, al kommunikation, prissætning, levering og eventuelle tvister foregår direkte og eksklusivt mellem virksomheden og specialisten. Naetwork er ikke part i nogen aftale og påtager sig intet ansvar.{' '}
              <Link href="/ansvarsfraskrivelse" className="text-[#0a0a0a] underline underline-offset-2">
                Læs fuld ansvarsfraskrivelse
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
