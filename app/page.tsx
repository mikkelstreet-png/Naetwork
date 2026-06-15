import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Naetwork – Din næste karrierebeslutning starter her',
  description:
    'Book en 1:1 session med erfarne professionelle inden for Banking, Private Equity, AI og Consulting.',
}

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fade-up 0.65s cubic-bezier(.22,1,.36,1) both;
        }
        .delay-1 { animation-delay: 0.10s; }
        .delay-2 { animation-delay: 0.20s; }
        .delay-3 { animation-delay: 0.32s; }
        .delay-4 { animation-delay: 0.46s; }
        @keyframes bounce-y {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(7px); }
        }
        .animate-bounce-y { animation: bounce-y 1.5s ease-in-out infinite; }
      `}</style>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center bg-white px-6 pt-24 pb-0">
        <div className="max-w-6xl mx-auto w-full">

          <div className="animate-fade-up">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-green-700 mb-10 border border-green-200 bg-green-50 px-3 py-1.5 rounded-full">
              Naetwork · København · DKK 300–2.000
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none text-gray-950 mb-6 animate-fade-up delay-1">
            Din næste karriere­beslutning<br className="hidden md:block" /> starter med én samtale.
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mb-10 animate-fade-up delay-2">
            Book en 1:1 session med erfarne professionelle inden for Banking, Private Equity, AI og Consulting — og få den indsigt, du ikke finder på LinkedIn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-3">
            <Link
              href="/find-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-950 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors text-base"
            >
              Jeg er kandidat →
            </Link>
            <Link
              href="/bliv-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl border-2 border-gray-950 hover:bg-gray-50 transition-colors text-base"
            >
              Jeg er professionel →
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="max-w-6xl mx-auto w-full mt-20 pb-10 animate-fade-up delay-4">
          <div className="flex flex-col items-start gap-2">
            <span className="text-xs text-gray-400 tracking-widest uppercase">Scroll</span>
            <svg
              className="animate-bounce-y text-gray-400"
              width="20" height="20" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ─── DUAL-VALUE SPLIT ─────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            Hvad er Naetwork?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            To veje. Ét formål.
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Kandidater – dark */}
            <div className="bg-gray-950 text-white rounded-3xl p-10 md:p-12 flex flex-col justify-between min-h-[420px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-green-400 mb-6">
                  For kandidater
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                  Adgang til indsigt du ikke finder andre steder.
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    'Mød professionelle på din karrierevej',
                    'Forbered dig til interviews og ansøgninger',
                    'Få ærlig, konkret feedback der rykker',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                      <span className="text-green-400 font-bold mt-0.5 shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/find-professionel"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                Se tilgængelige professionelle →
              </Link>
            </div>

            {/* Professionelle – green */}
            <div className="bg-green-800 text-white rounded-3xl p-10 md:p-12 flex flex-col justify-between min-h-[420px]">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-green-200 mb-6">
                  For professionelle
                </p>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-6">
                  Del din erfaring. Gør en forskel.
                </h3>
                <ul className="space-y-3 mb-8">
                  {[
                    'Sæt dine egne priser og tilgængelighed',
                    'Hjæmp unge talenter videre',
                    '15% provision — 7,5% hvis du donerer til Kræftens Bekæmpelse',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-green-100 text-sm leading-relaxed">
                      <span className="text-green-300 font-bold mt-0.5 shrink-0">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href="/bliv-professionel"
                className="inline-flex items-center gap-2 text-white text-sm font-semibold border border-white/25 rounded-xl px-6 py-3 hover:bg-white/10 transition-colors w-fit"
              >
                Bliv professionel på Naetwork →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SESSIONSTYPER ────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            Vælg din session
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-3">
            Fire formater. Ét formål: Dit næste skridt.
          </h2>
          <p className="text-gray-600 leading-relaxed mb-12 max-w-xl">
            DKK 300–2.000 pr. session — prissat af den professionelle.
          </p>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Mock Interview */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Mock Interview</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Øv dig med en der har siddet på begge sider af bordet
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>

            {/* CV & LinkedIn */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <line x1="10" y1="9" x2="8" y2="9" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">CV &amp; LinkedIn Review</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Få konkret, ærlig feedback på dit materiale
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>

            {/* Uformel 1:1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Uformel 1:1</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  En åben samtale om karriere, muligheder og næste skridt
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>

            {/* Karriererådgivning */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg transition-shadow flex flex-col gap-4">
              <div className="text-gray-950">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-950 mb-1">Karriererådgivning</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Strategisk sparring fra nogen der har prøvet det
                </p>
              </div>
              <p className="text-xs font-semibold text-green-700 mt-auto">DKK 300–2.000</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SÅDAN FUNGERER DET ───────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            Sådan fungerer det
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-16">
            Tre skridt. Ingen besvær.
          </h2>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: '01',
                title: 'Find din professionelle',
                desc: 'Browse profiler, filtrer på industri og sessiontype. Find den rette match.',
              },
              {
                num: '02',
                title: 'Book og betal',
                desc: 'Vælg tidspunkt, betal sikkert. DKK 300–2.000. Ingen skjulte gebyrer.',
              },
              {
                num: '03',
                title: 'Mød op og ryk dig',
                desc: '45 min. Video eller fysisk. Ingen bullshit.',
              },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                <span className="text-5xl font-black text-green-700 leading-none">{step.num}</span>
                <h3 className="text-xl font-bold text-gray-950">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRANSPARENS ──────────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-gray-50 border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
            Transparens
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-12">
            Du ved præcis hvad du betaler for.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">300–2.000</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">DKK pr. session</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Prisen sættes af den professionelle. Du ser den altid inden du booker.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">15%</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Provision til Naetwork</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Resten går direkte til den professionelle. Vi tager intet skjult.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <p className="text-4xl font-black text-gray-950 mb-1">45 min</p>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Pr. session</p>
              <p className="text-gray-600 leading-relaxed text-sm">
                Fokuseret, konkret, no-nonsense. Ingen small talk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── KRÆFTENS BEKÆMPELSE ──────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white border-t-2 border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-green-50 rounded-3xl p-8 md:p-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-green-700 mb-4">
              Samfundsansvar
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 mb-4">
              Vi donerer til dem der kæmper.
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-2xl mb-8 text-base">
              Professionelle der vælger at donere 7,5% af deres honorar til Kræftens Bekæmpelse, betaler kun 7,5% i provision til Naetwork. En lille beslutning med stor effekt.
            </p>
            <p className="text-sm font-semibold text-green-800 tracking-wide">
              Officiel partner: Kræftens Bekæmpelse
            </p>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────────── */}
      <section className="py-32 text-center bg-gray-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-4">
            Hvad venter du på?
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12">
            Bliv en del af et netværk der åbner døre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/find-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-950 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base"
            >
              Find din professionelle
            </Link>
            <Link
              href="/bliv-professionel"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-green-400 font-semibold rounded-xl border-2 border-green-700 hover:bg-green-950 transition-colors text-base"
            >
              Bliv professionel
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
