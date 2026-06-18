'use client';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export function HomeContent() {
  const { tr } = useLanguage();

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up 0.65s cubic-bezier(.22,1,.36,1) both; }
        .delay-1 { animation-delay: 0.10s; }
        .delay-2 { animation-delay: 0.20s; }
        .delay-3 { animation-delay: 0.32s; }
        .delay-4 { animation-delay: 0.46s; }
      `}</style>

      {/* SECTION 1: HERO */}
      <section
        id="home"
        className="min-h-screen flex items-center bg-white px-6 pt-24 pb-16"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79,70,229,0.06) 0%, transparent 70%)' }}
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="animate-fade-up">
                <span className="inline-block text-xs font-semibold tracking-[0.18em] uppercase text-gray-400 mb-8">
                  For candidates who prepare seriously
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-gray-950 mb-6 animate-fade-up delay-1">
                Book 60 minutes with someone who knows the path from inside.
              </h1>

              <p className="text-lg text-gray-500 leading-relaxed max-w-lg mb-10 animate-fade-up delay-2">
                One 1:1 session with someone who has already been through the process. Choose your focus, book your time, and arrive sharper.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up delay-3">
                <Link
                  href="/professionals"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-gray-950 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-sm"
                >
                  Find a professional
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent text-gray-950 font-semibold rounded-full border border-gray-300 hover:border-gray-950 transition-colors text-sm"
                >
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right: Session preview card */}
            <div className="animate-fade-up delay-4">
              <div className="bg-gray-950 rounded-3xl p-8 text-white">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold tracking-widest uppercase text-gray-400">Session preview</span>
                  <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full">60 min</span>
                </div>

                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-800">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    S
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">Sophie Andersen</p>
                    <p className="text-xs text-gray-400">VP · Goldman Sachs · IBD</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    <span className="text-xs text-emerald-400 font-medium">Available</span>
                  </div>
                </div>

                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-3">Choose focus area</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Mock Interview', 'CV Review', 'Career path', 'Industry insight'].map((chip) => (
                    <span
                      key={chip}
                      className={`text-xs px-3 py-1.5 rounded-full font-medium border ${
                        chip === 'Mock Interview'
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-transparent border-gray-700 text-gray-400'
                      }`}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-2xl p-4 mb-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Session</span>
                    <span className="text-white font-semibold">60 min · DKK 1.200</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Format</span>
                    <span className="text-white">Video call</span>
                  </div>
                </div>

                <Link
                  href="/professionals"
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                >
                  Book session →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROFESSIONALS */}
      <section className="py-28 md:py-36 bg-gray-950 px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-4">
              Who you book
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl leading-tight">
              People who have already been through what you&apos;re preparing for.
            </h2>
            <p className="text-gray-400 text-base max-w-xl leading-relaxed">
              Access to honest career guidance should not depend on who you happen to know.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                initial: 'S',
                name: 'Sophie A.',
                role: 'AI Product Lead',
                tagline: '"AI roles reward clarity of thought above all else."',
                field: 'AI',
              },
              {
                initial: 'M',
                name: 'Marcus T.',
                role: 'VP · Investment Banking',
                tagline: '"The recruiting process is a test of preparation, not luck."',
                field: 'Banking',
              },
              {
                initial: 'C',
                name: 'Caroline H.',
                role: 'Senior Manager · McKinsey',
                tagline: '"The case interview is learnable. Most people just don't practise right."',
                field: 'Consulting',
              },
              {
                initial: 'J',
                name: 'Jakob N.',
                role: 'Associate · Nordic Capital',
                tagline: '"PE is about pattern recognition — I help you build it faster."',
                field: 'Private Equity',
              },
            ].map((pro) => (
              <div key={pro.field} className="bg-white rounded-2xl p-8 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {pro.initial}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block"></span>
                    <span className="text-xs text-indigo-600 font-medium">Available</span>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-950 text-sm">{pro.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{pro.role}</p>
                </div>

                <p className="text-sm text-gray-400 italic leading-relaxed flex-1">
                  {pro.tagline}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">DKK 500–1.800</span>
                  <Link
                    href="/professionals"
                    className="text-sm text-indigo-600 font-medium hover:underline"
                  >
                    Book session →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section id="how-it-works" className="py-28 md:py-36 bg-white px-6">
        <div className="max-w-6xl mx-auto">

          <div className="mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-indigo-600 mb-4">
              {tr('how.label')}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-950 max-w-xl leading-tight">
              Four steps to sharper preparation.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { num: '01', titleKey: 'how.step1_title', bodyKey: 'how.step1_body' },
              { num: '02', titleKey: 'how.step2_title', bodyKey: 'how.step2_body' },
              { num: '03', titleKey: 'how.step3_title', bodyKey: 'how.step3_body' },
              { num: '04', titleKey: 'how.step4_title', bodyKey: 'how.step4_body' },
            ].map((step) => (
              <div key={step.num} className="flex flex-col gap-4">
                <span className="text-5xl font-black text-indigo-100 leading-none select-none">
                  {step.num}
                </span>
                <h3 className="text-base font-bold text-gray-950">{tr(step.titleKey)}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tr(step.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: IMPACT */}
      <section id="pricing" className="py-28 md:py-36 bg-gray-950 px-6">
        <div className="max-w-4xl mx-auto">

          <div className="mb-12">
            <span className="inline-block text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-4">
              {tr('impact.label')}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Professional. And purposeful.
            </h2>
            <p className="text-gray-400 text-base leading-relaxed max-w-xl">
              Professionals set their own price and can choose to donate part of their fee to Kræftens Bekæmpelse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* Shared Impact */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-lg">{tr('impact.shared_name')}</span>
                <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">20% fee</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{tr('impact.shared_tag')}</p>
              <div className="bg-gray-800 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-white">50%</div>
                    <div className="text-xs text-gray-500 mt-1">Donation</div>
                  </div>
                  <div className="text-gray-600 text-lg">+</div>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-bold text-indigo-400">50%</div>
                    <div className="text-xs text-gray-500 mt-1">{tr('impact.shared_keep')}</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{tr('impact.shared_body')}</p>
              <p className="text-gray-500 text-xs leading-relaxed mt-auto">{tr('impact.shared_note')}</p>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-xs text-gray-600">{tr('impact.shared_fee')}</span>
              </div>
            </div>

            {/* All-In Impact */}
            <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-8 flex flex-col">
              <div className="flex items-center justify-between mb-5">
                <span className="text-white font-bold text-lg">{tr('impact.allin_name')}</span>
                <span className="bg-indigo-900 text-indigo-300 text-xs px-3 py-1 rounded-full">10% fee</span>
              </div>
              <p className="text-indigo-300 text-sm leading-relaxed mb-6">{tr('impact.allin_tag')}</p>
              <div className="bg-indigo-900 rounded-xl p-5 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">100%</div>
                  <div className="text-xs text-indigo-400 mt-1">Donation</div>
                </div>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">{tr('impact.allin_body')}</p>
              <p className="text-indigo-400 text-xs leading-relaxed mt-auto">{tr('impact.allin_note')}</p>
              <div className="mt-4 pt-4 border-t border-indigo-800">
                <span className="text-xs text-indigo-600">{tr('impact.allin_fee')}</span>
              </div>
            </div>

          </div>

          <p className="text-xs text-gray-700 text-center">{tr('impact.kb_legal')}</p>
        </div>
      </section>

      {/* SECTION 5: FINAL CTA */}
      <section className="py-36 bg-white px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight mb-5">
            Book 60 minutes. Get closer to the job.
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed mb-10">
            Concrete guidance from people who already understand the process, the culture and the bar.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/professionals"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-gray-950 text-white font-semibold rounded-full hover:bg-gray-800 transition-colors text-sm"
            >
              Find a professional
            </Link>
            <Link
              href="/professional/signup"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-transparent text-gray-950 font-semibold rounded-full border border-gray-300 hover:border-gray-950 transition-colors text-sm"
            >
              Become a professional
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
