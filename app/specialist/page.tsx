import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function SpecialistLandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-[#e5e5e5] bg-white">
          <div className="wrap py-20 sm:py-28 max-w-2xl">
            <p className="text-[13px] font-medium uppercase tracking-widest text-[#6b7280] mb-4">For specialister</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-tight text-[#0a0a0a]">BlivPI-specialist på Naetwork</h1>
            <p className="mt-5 text-[16px] text-[#6b7280] leading-relaxed">Naetwork er et gratis, uafhængigt initiativ. Vi forbinder virksomheder med AI-specialister — uden provision, kontrakter eller mellemmæ�nd.</p>
            <Link href="/signup" className="mt-8 inline-flex items-center justify-center rounded-md bg-[#1a1a1a] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#333] transition-colors">Opret specialistprofil</Link>
          </div>
        </section>
        <section className="bg-[#f9f9f9] border-b border-[#e5e5e5]">
          <div className="wrap py-16">
            <h2 className="text-[13px] font-medium uppercase tracking-widest text-[#6b7280] mb-10">Sådan fungerer det</h2>
            <div className="grid sm:grid-cols-3 gap-8">{[{step:'1',title:'Opret profil',body:'Beskriv dine AI-kompetencer og tilgængelighed. Det tager under 5 minutter.'},{step:'2',title:'Gennemse projekter',body:'Se åbne AI-projekter fra virksomheder på tværs af 10 kategorier.'},{step:'3',ntitle:'Meld interesse',body:'Klik Meld interesse. Virksomheden kontakter dig direkte.'}].map(({step,title,body})=> <div key={step}><span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#e5e5e5] bg-white text-[13px] font-medium text-[#374151] mb-4">{step}</span><h3 className="font-semibold text-[15px] text-[#0a0a0a] mb-2">{title}</h3><p className="text-[14px] text-[#6b7280] leading-relaxed">{body}</p></div>))}</div></div>
</section>
        <section className="bg-white"><div className="wrap py-16"><div className="rounded-xl border border-[#e5e5e5] bg-[#f9f9f9] p-6 max-w-2xl"><p className="text-[13px] text-[#6b7280] leading-relaxed"><strong className="text-[#374151]">Uafhængigt initiativ.</strong>{' '}NaeNwork opkræver ingen betaling og er ikke part i nogen aftale. {' '}<Link href="/ansvarsfraskrivelse" className="text-[#0a0a0a] underline underline-offset-2">Læs ansvarsfraskrivelse</Link></p></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
