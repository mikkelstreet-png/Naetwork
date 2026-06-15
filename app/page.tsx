'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('kandidat');

  return (
    <main className="bg-white text-gray-900">

      {/* 1. HERO */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center py-20 px-6">
        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-6">
          Karrieresessioner · Banking · PE · AI · Consulting
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
          Din næste karrierebeslutning starter her
        </h1>
        <hr className="border-t border-gray-200 my-8 max-w-xs mx-auto w-full" />
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10">
          Book en 1:1 session med en erfaren professionel inden for banking, PE, AI eller consulting — og få den ægte indsigt, der ikke står i jobbeskrivelsen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/professionals" className="bg-green-800 hover:bg-green-900 text-white px-8 py-4 rounded-full text-sm font-semibold transition-all">
            Find en session
          </Link>
          <Link href="/signup" className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-full text-sm font-semibold transition-all">
            Bliv professionel
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-8">1:1 sessions · DKK 300–2.000 · Ingen abonnement</p>
      </section>

      {/* 2. OM NAETWORK */}
      <section className="py-24 md:py-32 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Om Naetwork</p>
              <div className="text-8xl font-black text-gray-100 leading-none select-none">01</div>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Professionel sparring, uden omveje
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Naetwork kobler kandidater direkte med erfarne professionelle. Ingen rekrutteringsbureauer, ingen dyre coaches — bare en ærlig samtale med nogen, der har været der.
              </p>
              <div className="space-y-3">
                <div className="border-l-2 border-green-800 pl-4 py-1 text-sm text-gray-700">
                  Direkte adgang til praktikere med 5–20 års erfaring inden for dit felt
                </div>
                <div className="border-l-2 border-green-800 pl-4 py-1 text-sm text-gray-700">
                  Fleksible formater: fra 30-minutters CV-gennemgang til dybdegående karriærerådgivning
                </div>
                <div className="border-l-2 border-green-800 pl-4 py-1 text-sm text-gray-700">
                  Betaling pr. session — ingen binding, ingen månedlig ydelse
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HVORFOR NAETWORK */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 text-center">Hvorfor Naetwork</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-12">
            Bygget til begge sider af bordet
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-950 text-white rounded-2xl p-8 h-full">
              <h3 className="text-xl font-bold mb-3">Til kandidaten</h3>
              <p className="text-sm leading-relaxed opacity-80 mb-6">
                Du er ambitiøs, men mangler insiderviden. Naetwork giver dig adgang til folk, der kan fortælle dig, hvad der rent faktisk kræves — ikke hvad LinkedIn-profiler viser.
              </p>
              <ul className="space-y-2">
                {[
                  'Ægte feedback på din profil og ansøgning',
                  'Indblik i brancher og virksomhedskulturer',
                  'Forberedelse til de svære interviewspørgsmål',
                  'Sparring om karriæreveje og langsigtede valg',
                ].map((item) => (
                  <li key={item} className="text-sm opacity-90 flex gap-2">
                    <span className="shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-800 text-white rounded-2xl p-8 h-full">
              <h3 className="text-xl font-bold mb-3">Til den professionelle</h3>
              <p className="text-sm leading-relaxed opacity-80 mb-6">
                Du har opbygget erfaring, der er guld værd. Naetwork lader dig dele det på dine præmisser — og støtte en god sag undervejs.
              </p>
              <ul className="space-y-2">
                {[
                  'Sæt din egen pris og tilgængelighed',
                  'Del din viden med dem, der virkelig ønsker den',
                  'En del af betalingen går til Kræftens Bekæmpelse',
                  'Bliv en del af et netværk af topdanskere',
                ].map((item) => (
                  <li key={item} className="text-sm opacity-90 flex gap-2">
                    <span className="shrink-0">→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SESSION-TYPER */}
      <section className="py-24 md:py-32 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 text-center">Session-typer</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-12">
            Vælg det format der passer dig
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              </div>
              <h3 className="text-base font-bold mt-4 mb-1">Mock Interview</h3>
              <p className="text-xs font-semibold text-green-800 mb-3">Fra 600 DKK</p>
              <p className="text-sm text-gray-500 leading-relaxed">Simulér et rigtigt jobinterview med en brancheekspert. Få feedback i realtid og forstå præcis, hvad du skal arbejde på.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </div>
              <h3 className="text-base font-bold mt-4 mb-1">CV Review</h3>
              <p className="text-xs font-semibold text-green-800 mb-3">Fra 300 DKK</p>
              <p className="text-sm text-gray-500 leading-relaxed">Gennemgang af dit CV og LinkedIn-profil med konkrete forbedringer, der matcher dine målbrancher.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h3 className="text-base font-bold mt-4 mb-1">Uformel 1:1</h3>
              <p className="text-xs font-semibold text-green-800 mb-3">Fra 400 DKK</p>
              <p className="text-sm text-gray-500 leading-relaxed">En ustruktureret samtale om din situation, branchen og mulighederne. Perfekt til at finde retning.</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-700">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
                </svg>
              </div>
              <h3 className="text-base font-bold mt-4 mb-1">Karriærerådgivning</h3>
              <p className="text-xs font-semibold text-green-800 mb-3">Fra 800 DKK</p>
              <p className="text-sm text-gray-500 leading-relaxed">Dybdegående strategisk samtale om din karriærevej, transitions og langsigtede ambitioner.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SÅDAN FUNGERER DET */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 text-center">Processen</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-10">
            Sådan fungerer det
          </h2>
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-1 flex gap-1">
              <button
                onClick={() => setActiveTab('kandidat')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'kandidat' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Som kandidat
              </button>
              <button
                onClick={() => setActiveTab('professionel')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'professionel' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Som professionel
              </button>
            </div>
          </div>
          {activeTab === 'kandidat' ? (
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-0">
              {[
                { n: '1', title: 'Søg og find', desc: 'Gennemse profiler og vælg den professionelle der matcher dine behov.' },
                { n: '2', title: 'Book en tid', desc: 'Vælg sessiontype, tidspunkt og betal trygt online.' },
                { n: '3', title: 'Mød op', desc: 'Din session foregår via video — forberedt og fokuseret.' },
                { n: '4', title: 'Kom videre', desc: 'Modtag eventuel opfølgning og gå i gang med næste skridt.' },
              ].map((step, i) => (
                <div key={step.n} className="flex md:flex-col flex-1 w-full gap-4 md:gap-0">
                  <div className="flex md:flex-col gap-4 flex-1">
                    <div className="w-8 h-8 bg-gray-950 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{step.n}</div>
                    <div><p className="font-semibold md:mt-3 mb-1">{step.title}</p><p className="text-sm text-gray-500">{step.desc}</p></div>
                  </div>
                  {i < 3 && <div className="hidden md:block w-full border-t border-dashed border-gray-200 mt-4 mx-4" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-0">
              {[
                { n: '1', title: 'Opret profil', desc: 'Beskriv din baggrund, ekspertise og de sessionstyper du tilbyder.' },
                { n: '2', title: 'Sæt din pris', desc: 'Bestem selv hvad din tid er værd og hvornår du er tilgængelig.' },
                { n: '3', title: 'Mød kandidaten', desc: 'Hold sessionen online og del ud af din erfaring.' },
                { n: '4', title: 'Gør forskel', desc: 'En del af din betaling doneres automatisk til Kræftens Bekæmpelse.' },
              ].map((step, i) => (
                <div key={step.n} className="flex md:flex-col flex-1 w-full gap-4 md:gap-0">
                  <div className="flex md:flex-col gap-4 flex-1">
                    <div className="w-8 h-8 bg-gray-950 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">{step.n}</div>
                    <div><p className="font-semibold md:mt-3 mb-1">{step.title}</p><p className="text-sm text-gray-500">{step.desc}</p></div>
                  </div>
                  {i < 3 && <div className="hidden md:block w-full border-t border-dashed border-gray-200 mt-4 mx-4" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. KRÆFTENS BEKÆMPELSE */}
      <section className="py-24 md:py-32 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto bg-green-50 rounded-3xl p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-green-800">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">Formålet</p>
                <h2 className="text-2xl font-bold text-green-900">Vi støtter Kræftens Bekæmpelse</h2>
              </div>
            </div>
            <p className="text-green-800 text-sm leading-relaxed">
              En andel af hver gennemført session doneres direkte til Kræftens Bekæmpelse. Når du bruger Naetwork — som kandidat eller professionel — bidrager du til forskning og støtte til kræftramte og deres familier. Karriæreudvikling med mening.
            </p>
          </div>
        </div>
      </section>

      {/* 7. TRUST SIGNALS */}
      <section className="py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3 text-center">Naetwork i tal</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-gray-950 text-white rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-1">5+</p>
              <p className="text-xs text-gray-400 leading-tight">brancher repræsenteret</p>
            </div>
            <div className="bg-gray-950 text-white rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-1">300</p>
              <p className="text-xs text-gray-400 leading-tight">DKK laveste sessionspris</p>
            </div>
            <div className="bg-gray-950 text-white rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-1">100%</p>
              <p className="text-xs text-gray-400 leading-tight">online — ingen transport</p>
            </div>
            <div className="bg-gray-950 text-white rounded-2xl p-6 text-center">
              <p className="text-3xl font-black mb-1">1:1</p>
              <p className="text-xs text-gray-400 leading-tight">personlig opmærksomhed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section className="bg-gray-950 text-white py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-6">Kom i gang i dag</p>
          <h2 className="text-4xl font-black tracking-tight mb-4">Din næste session er et klik væk</h2>
          <p className="text-gray-400 mb-8 text-lg">Gennemse profiler og book direkte. Ingen venteliste, ingen abonnement.</p>
          <Link href="/professionals" className="inline-block bg-green-800 hover:bg-green-700 text-white px-10 py-5 rounded-full font-semibold text-base transition-colors">
            Se alle sessioner
          </Link>
        </div>
      </section>

    </main>
  );
}