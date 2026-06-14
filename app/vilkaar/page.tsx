'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export default function VilkaarPage() {
  const { lang } = useTranslation();

  if (lang === 'en') return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">← Back</Link>
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] mt-6 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Free and non-commercial</h2>
          <p>Naetwork is a free, non-commercial platform. There are no fees for using the platform, and Naetwork does not receive any commission or payment from collaborations arranged through the platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">No guarantees</h2>
          <p>Naetwork makes no guarantees of outcomes, matches, results, or the quality of collaborations. The platform simply provides a space for businesses and specialists to find each other.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">User responsibility</h2>
          <p>Users are solely responsible for their own agreements, contracts, payment terms, and any other arrangements made with other users. Naetwork does not participate in, mediate, or take any responsibility for any collaboration that arises through the platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">No validation of specialists</h2>
          <p>Naetwork does not verify, validate, or endorse any specialist profiles. Businesses are responsible for conducting their own due diligence before engaging with any specialist.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Limitation of liability</h2>
          <p>Naetwork accepts no liability for any loss, damage, or dispute arising between users. This includes but is not limited to financial loss, missed deadlines, or poor deliverables. Use of the platform is entirely at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Acceptable use</h2>
          <p>Users agree not to misuse the platform. Prohibited behaviour includes but is not limited to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Posting spam or false information</li>
            <li>Harassing other users</li>
            <li>Creating multiple accounts to game the system</li>
            <li>Using the platform for illegal purposes</li>
          </ul>
          <p className="mt-3">Violation of these terms may result in account termination.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Governing law</h2>
          <p>These terms are governed by Danish law. Any disputes shall be resolved under Danish jurisdiction.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Changes to terms</h2>
          <p>We may update these terms from time to time. Continued use of the platform constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </main>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">← Tilbage</Link>
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] mt-6 mb-2">Vilkår for brug</h1>
      <p className="text-sm text-gray-400 mb-10">Sidst opdateret: Juni 2025</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Gratis og ikke-kommerciel</h2>
          <p>Naetwork er en gratis, ikke-kommerciel platform. Der er ingen gebyrer for at bruge platformen, og Naetwork modtager ingen provision eller betaling fra samarbejder, der opstår gennem platformen.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Ingen garantier</h2>
          <p>Naetwork giver ingen garantier for resultater, matches, kvalitet af samarbejder eller lignende. Platformen stiller udelukkende et rum til rådighed, hvor virksomheder og specialister kan finde hinanden.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Brugernes ansvar</h2>
          <p>Brugerne er selv ansvarlige for egne aftaler, kontrakter, betalingsbetingelser og alle andre arrangementer indgået med andre brugere. Naetwork deltager ikke i, mægler ikke for, og påtager sig intet ansvar for nogen form for samarbejde, der opstår via platformen.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Ingen validering af specialister</h2>
          <p>Naetwork verificerer, validerer eller anbefaler ikke specialistprofiler. Virksomheder er selv ansvarlige for at foretage den nødvendige due diligence, inden de indgår aftaler med specialister.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Ansvarsbegrænsning</h2>
          <p>Naetwork påtager sig intet ansvar for tab, skader eller tvister, der opstår mellem brugere. Dette inkluderer, men er ikke begrænset til, økonomiske tab, manglende deadlines eller utilfredsstillende leverancer. Brug af platformen sker udelukkende på eget ansvar.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Acceptabel brug</h2>
          <p>Brugerne forpligter sig til ikke at misbruge platformen. Forbudt adfærd inkluderer:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Spam eller falske oplysninger</li>
            <li>Chikane af andre brugere</li>
            <li>Oprettelse af flere konti for at omgå systemet</li>
            <li>Brug af platformen til ulovlige formål</li>
          </ul>
          <p className="mt-3">Overtrædelse af disse vilkår kan medføre lukning af kontoen.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Lovvalg</h2>
          <p>Disse vilkår er underlagt dansk ret. Eventuelle tvister afgøres efter dansk jurisdiktion.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Ændringer af vilkår</h2>
          <p>Vi forbeholder os ret til at opdatere disse vilkår. Fortsat brug af platformen udgør accept af de opdaterede vilkår.</p>
        </section>
      </div>
    </main>
  );
}
