'use client';

import Link from 'next/link';
import { useTranslation } from '@/context/LanguageContext';

export default function PrivatlivspolitikPage() {
  const { lang } = useTranslation();

  if (lang === 'en') return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">← Back</Link>
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] mt-6 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: June 2025</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Who we are</h2>
          <p>Naetwork is a free, non-commercial initiative operated by Mikkel Munksgaard-Street. We are not a company, and we charge nothing for our services. Our purpose is to connect AI professionals with businesses that need help with AI projects.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">What data we collect</h2>
          <p>We collect the following personal data when you create an account and use the platform:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Account type (business or specialist)</li>
            <li>Project descriptions (for businesses)</li>
            <li>Specialist profile information (title, bio, skill areas, LinkedIn URL)</li>
            <li>Interest signals (which projects a specialist has shown interest in)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Why we collect it</h2>
          <p>We collect this data solely to enable the platform's core function: allowing businesses to post AI projects and allowing specialists to express interest in those projects. We do not use your data for advertising or profiling purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Where data is stored</h2>
          <p>All data is stored in Supabase, an EU-based (Ireland) cloud database that is fully GDPR compliant. Supabase acts as a data processor on our behalf.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">How long we keep your data</h2>
          <p>Your data is kept until you delete your account. You can delete your account at any time from the Settings page, which will permanently remove all your data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Your rights</h2>
          <p>Under GDPR you have the right to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data (by deleting your account in Settings)</li>
            <li>Object to processing</li>
            <li>Data portability</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@naetwork.dk" className="text-[#4F46E5] hover:underline">privacy@naetwork.dk</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Cookies</h2>
          <p>We use only functional cookies necessary for keeping you logged in. We do not use advertising cookies, tracking cookies, or share cookie data with third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Contact</h2>
          <p>For privacy-related questions: <a href="mailto:privacy@naetwork.dk" className="text-[#4F46E5] hover:underline">privacy@naetwork.dk</a></p>
        </section>
      </div>
    </main>
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-[#4F46E5] hover:text-[#4338CA] transition-colors">← Tilbage</Link>
      <h1 className="text-4xl font-extrabold tracking-tight text-[#0A0A0A] mt-6 mb-2">Privatlivspolitik</h1>
      <p className="text-sm text-gray-400 mb-10">Sidst opdateret: Juni 2025</p>

      <div className="prose prose-sm max-w-none text-gray-600 space-y-8">
        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Hvem vi er</h2>
          <p>Naetwork er et gratis, ikke-kommercielt initiativ drevet af Mikkel Munksgaard-Street. Vi er ikke en virksomhed, og vi opkræver ingen betaling for vores tjenester. Formålet er at forbinde AI-professionelle med virksomheder, der har brug for hjælp til AI-projekter.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Hvilke data vi indsamler</h2>
          <p>Vi indsamler følgende personoplysninger, når du opretter en konto og bruger platformen:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Navn</li>
            <li>E-mailadresse</li>
            <li>Kontotype (virksomhed eller specialist)</li>
            <li>Projektbeskrivelser (for virksomheder)</li>
            <li>Specialistprofiloplysninger (titel, bio, kompetenceområder, LinkedIn URL)</li>
            <li>Interessesignaler (hvilke projekter en specialist har vist interesse i)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Hvorfor vi indsamler dem</h2>
          <p>Vi indsamler disse data udelukkende for at muliggøre platformens kernefunktion: at lade virksomheder poste AI-projekter og lade specialister vise interesse. Vi bruger ikke dine data til reklame- eller profileringformål.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Hvor data opbevares</h2>
          <p>Alle data opbevares i Supabase, en EU-baseret (Irland) cloud-database, der er fuldt GDPR-kompatibel. Supabase agerer som databehandler på vores vegne.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Hvor længe vi opbevarer dine data</h2>
          <p>Dine data opbevares, indtil du sletter din konto. Du kan til enhver tid slette din konto fra indstillingssiden, hvilket permanent fjerner alle dine data.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Dine rettigheder</h2>
          <p>Under GDPR har du ret til:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Indsigt i dine personoplysninger</li>
            <li>Berigtigelse af urigtige data</li>
            <li>Sletning af dine data (ved at slette din konto i Indstillinger)</li>
            <li>Indsigelse mod behandling</li>
            <li>Dataportabilitet</li>
          </ul>
          <p className="mt-3">Kontakt os på <a href="mailto:privacy@naetwork.dk" className="text-[#4F46E5] hover:underline">privacy@naetwork.dk</a> for at udøve disse rettigheder.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Cookies</h2>
          <p>Vi bruger kun funktionelle cookies, der er nødvendige for at holde dig logget ind. Vi bruger ingen reklame-cookies, tracking-cookies eller deler cookie-data med tredjeparter.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-3">Kontakt</h2>
          <p>Spørgsmål om privatliv: <a href="mailto:privacy@naetwork.dk" className="text-[#4F46E5] hover:underline">privacy@naetwork.dk</a></p>
        </section>
      </div>
    </main>
  );
}
