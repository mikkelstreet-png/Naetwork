import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function SpecialistLandingPage() {
  const steps = [
    { step: 1, title: 'Opret gratis profil', body: 'Angiv dine AI-kompetencer, specialer og tilgængelighed. Det tager under 5 minutter.' },
    { step: 2, title: 'Gennemse projekter', body: 'Se alle åbne AI-projekter fra virksomheder. Filtrer på kategori og omfang.' },
    { step: 3, title: 'Meld interesse', body: 'Klik "Meld interesse" på et projekt du kan hjælpe med. Virksomheden kontakter dig direkte.' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-[#e5e5e5] bg-white">
          <div className="wrap py-20 sm:py-28 max-w-2xl">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#6b7280] mb-4">For specialister</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#0a0a0a] mb-6">
              Bliv specialist på Naetwork
            </h1>
            <p className="text-[17px] text-[#6b7280] leading-relaxed mb-8">
              Find virksomheder der søger præcis din AI-ekspertise. Gratis. Ingen provision. Ingen mellemmand.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-md bg-[#1a1a1a] px-6 py-3 text-[14px] font-medium text-white hover:bg-[#333] transition-colors">
              Opret specialistprofil
            </Link>
          </div>
        </section>

        <section className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
          <div className="wrap py-16">
            <h2 className="text-[20px] font-semibold text-[#0a0a0a] mb-10">Sådan fungerer det</h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map(({step,title,body}) => (
                <div key={step}>
                  <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#e5e5e5] bg-white text-[13px] font-medium text-[#374151] mb-4">{step}</span>
                  <h3 className="font-semibold text-[15px] text-[#0a0a0a] mb-2">{title}</h3>
                  <p className="text-[14px] text-[#6b7280] leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="wrap py-16">
            <div className="rounded-xl border border-[#e5e5e5] bg-[#f9f9f9] p-6 max-w-2xl">
              <p className="text-[13px] text-[#6b7280] leading-relaxed">
                <strong className="text-[#0a0a0a]">Bemærk:</strong> Naetwork er udelukkende en gratis opslagstavle. Vi er ikke part i nogen aftale. Al kommunikation foregår direkte mellem dig og virksomheden. Se{' '}
                <Link href="/ansvarsfraskrivelse" className="underline hover:text-[#0a0a0a]">vores ansvarsfraskrivelse</Link>.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
