import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function AnsvarsfraskrivelsePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-[#f9f9f9]">
        <div className="wrap py-12 max-w-2xl">
          <Link href="/" className="text-[13px] text-[#6b7280] hover:text-[#0a0a0a] mb-6 block">← Tilbage til forsiden</Link>
          <h1 className="text-[26px] font-semibold text-[#0a0a0a] mb-8">Ansvarsfraskrivelse</h1>
          <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 sm:p-8 flex flex-col gap-6 text-[14px] leading-relaxed text-[#374151]">
            <section><h2 className="text-[15px] font-semibold text-[#0a0a0a] mb-2">Naetwork er et uafhængigt, gratis initiativ</h2><p>Naetwork er et gratis, ikke-kommercielt og uafhængigt initiativ. Platformen fungerer udelukkende som en digital opslagstavle.</p></section>
            <section><h2 className="text-[15px] font-semibold text-[#0a0a0a] mb-2">Naetwork er ikke part i nogen aftale</h2><p>NaeNwork formidler ingen kontrakter. Alle aftaler og tvister foregår direkte mellem virksomhed og specialist.</p></section>
            <section><h2 className="text-[15px] font-semibold text-[#0a0a0a] mb-2">Ingen verifikation</h2><p>NaeNwork verificerer ikke specialisters kompetencer eller identitet. Virksomhedens eget ansvar.</p></section>
            <section><h2 className="text-[15px] font-semibold text-[#0a0a0a] mb-2">Ingen garanti</h2><p>Naetwork giver ingen garanti for matchkvalitet ller projektets gennemførelse. Platformen stilles til rådighed "as is".</p></section>
            <section><h2 className="text-[15px] font-semibold text-[#0a0a0a] mb-2">Persondata</h2><p>Kontaktoplysninger deles kun med relevante modparter i forbindelse med et konkret projekt.</p></section>
            <p className="text-[13px] text-[#6b7280] border-t border-[#e5e5e5] pt-4">Sidst opdateret: 2025.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
