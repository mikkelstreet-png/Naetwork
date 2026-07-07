'use client'

import { useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import BookingDrawer from '@/components/BookingDrawer'
import { RefreshCw } from 'lucide-react'
import { contributionAmount, focusLabel, industryAccent } from '@/lib/platform'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'

type Professional = ProfessionalCard

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

function accentFor(pro: Professional) {
  return industryAccent(pro.industries[0])
}

function bestFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Investment case og PE-interview' : 'PE / investment case'
  if (focus.includes('banking_technicals')) return isDa ? 'Tekniske spørgsmål og Banking-interview' : 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Cases og personligt interview' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-roller og positionering' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Ansøgningsmateriale' : 'Applications'
  return isDa ? 'Karriereafklaring' : 'Career clarity'
}

function primaryOutputFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Skarpere investeringsvurdering' : 'Investment case and deal thinking'
  if (focus.includes('banking_technicals')) return isDa ? 'Teknisk sikkerhed og interviewklarhed' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og personlig kommunikation' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function useCasesFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) {
    return isDa
      ? ['Du søger Private Equity og vil forstå interviewniveauet.', 'Du vil træne investment cases, deal-forståelse eller due diligence-logik.', 'Du vil omsætte erfaring fra Banking, Consulting eller startups til en troværdig PE-fortælling.']
      : ['You are targeting Private Equity and want to understand the interview bar.', 'You want to practice investment cases, deal thinking or diligence logic.', 'You want to translate banking, consulting or startup experience into a PE story.']
  }
  if (focus.includes('banking_technicals')) {
    return isDa
      ? ['Du søger Banking og vil forstå interviewniveauet.', 'Du vil træne tekniske spørgsmål, motivation eller M&A-processen.', 'Du har materiale eller en igangværende proces, der skal skærpes hurtigt.']
      : ['You are targeting Banking and want to understand the interview bar.', 'You want to practice technicals, fit or M&A process.', 'You have materials or process context that needs sharper positioning.']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Du vil træne cases med mere struktur og mindre støj.', 'Du vil forbedre dine personlige svar og din kommunikation.', 'Du vil forstå, hvordan konsulenthuse vurderer kandidater.']
      : ['You want to practice cases with more structure and less noise.', 'You want to improve fit answers and personal communication.', 'You want to understand how consultancies evaluate candidates.']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Du vil ind i AI og har brug for en klarere vej ind.', 'Du vil omsætte din erfaring til relevante AI-roller.', 'Du vil forstå portefølje, rolletyper og interviewvinkler.']
      : ['You want to enter AI and need a clearer path in.', 'You want to translate your experience into relevant AI roles.', 'You want to understand portfolio, role types and interview angles.']
  }
  return isDa
    ? ['Du vil gøre dit CV, LinkedIn eller ansøgningsmateriale skarpere.', 'Du vil have ærlig feedback fra en person tættere på markedet.', 'Du vil afklare næste skridt før en vigtig beslutning.']
    : ['You want to sharpen your CV, LinkedIn or application materials.', 'You want honest feedback from someone closer to the market.', 'You want to clarify next steps before an important decision.']
}

function outcomesFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) {
    return isDa
      ? ['Skærp din investment case', 'Træn deal-forståelse', 'Forstå PE-forventninger', 'Få ærlig feedback på dit match']
      : ['Sharpen investment case', 'Practice deal thinking', 'Understand PE expectations', 'Get honest fit feedback']
  }
  if (focus.includes('banking_technicals')) {
    return isDa
      ? ['Forstå interviewniveauet', 'Træn tekniske spørgsmål', 'Skærp din M&A-fortælling', 'Få ærlig feedback på dit match']
      : ['Understand the interview bar', 'Practice technicals', 'Sharpen M&A story', 'Get honest fit feedback']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Strukturér cases bedre', 'Træn hypoteser', 'Kommunikér klarere', 'Forbered personlige svar']
      : ['Structure cases better', 'Practice hypotheses', 'Communicate more clearly', 'Prepare fit answers']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Afkod AI-roller', 'Positionér din erfaring', 'Byg en stærkere portefølje', 'Vælg næste skridt']
      : ['Decode AI roles', 'Position your experience', 'Build a stronger portfolio', 'Choose next steps']
  }
  return isDa
    ? ['Skarpere CV', 'Bedre LinkedIn', 'Klarere ansøgning', 'Mere retning']
    : ['Sharper CV', 'Better LinkedIn', 'Clearer application', 'More direction']
}

interface ProfessionalDetailProps {
  id: string
  initialProfessional: Professional | null
  initialLoadError?: boolean
}

export default function ProfessionalDetail({ id, initialProfessional, initialLoadError = false }: ProfessionalDetailProps) {
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [professional, setProfessional] = useState<Professional | null>(initialProfessional)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState(initialLoadError)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const fetchProfessional = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setLoadError(false)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.rpc('get_public_professionals', { requested_id: id }).maybeSingle()
      if (error) {
        setLoadError(true)
        return
      }
      setProfessional(mapPublicProfessionals(data ? [data] : [])[0] ?? null)
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  if (loading) return <main aria-busy="true" className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">{isDa ? 'Indlæser...' : 'Loading...'}</p></main>

  if (loadError) return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white px-5 py-10">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-[#f7f7f4] p-6">
        <span className="block h-2 w-10 rounded-full bg-cyan-300" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-black text-gray-950">{isDa ? 'Profilen kunne ikke indlæses' : 'The profile could not be loaded'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{isDa ? 'Profilservicen svarer ikke lige nu. Prøv igen; hvis fejlen fortsætter, hjælper vi dig videre.' : 'The profile service is not responding right now. Try again; if the issue continues, we can help.'}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => void fetchProfessional()} className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm font-black text-white">
            <RefreshCw size={16} aria-hidden="true" />{isDa ? 'Prøv igen' : 'Try again'}
          </button>
          <Link href="/professionals" className="inline-flex items-center px-2 py-3 text-sm font-black text-gray-600">{isDa ? 'Alle profiler' : 'All profiles'}</Link>
          <Link href="/contact" className="inline-flex items-center px-2 py-3 text-sm font-black text-gray-600">{isDa ? 'Kontakt os' : 'Contact us'}</Link>
        </div>
      </div>
    </main>
  )

  if (!professional) return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-black text-gray-950">{isDa ? 'Profilen findes ikke' : 'Profile not found'}</h1>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">{isDa ? 'Profilen kan være fjernet, skjult eller have fået en ny adresse.' : 'The profile may have been removed, hidden or moved to a new address.'}</p>
        <Link href="/professionals" className="text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Tilbage til profiler' : 'Back to profiles'}</Link>
      </div>
    </main>
  )

  const minimumImpact = contributionAmount(professional.price, professional.contributionPercent)
  const focusAreas = professional.focus_areas ?? []
  const bestFit = bestFor(professional, isDa)
  const primaryOutput = primaryOutputFor(professional, isDa)
  const useCases = useCasesFor(professional, isDa)
  const outcomes = outcomesFor(professional, isDa)
  const t = {
    back: isDa ? 'Tilbage til profiler' : 'Back to profiles',
    focusAreas: isDa ? 'Fokusområder' : 'Focus areas',
    bookCta: isDa ? 'Book 60 min' : 'Book 60 min',
    session: isDa ? '60 min 1:1 session' : '60 min 1:1 session',
    briefing: isDa ? `Du vælger selv fokus. Ved gennemført betaling afsættes ${professional.contributionPercent}% / DKK ${minimumImpact} til støtte for Kræftens Bekæmpelse.` : `You choose the focus. Once completed and paid, ${professional.contributionPercent}% / DKK ${minimumImpact} is allocated in support of Kræftens Bekæmpelse.`,
    bestFor: isDa ? 'Bedst til' : 'Best for',
    sessionBrief: isDa ? 'Brief til sessionen' : 'Session brief',
    sessionBriefBody: isDa
      ? 'Før du sender bookinganmodningen, vælger du fokus, beskriver dit mål og kan tilføje relevant materiale.'
      : 'Before sending the booking request, choose a focus, describe your goal and optionally add relevant material.',
    profileSignal: isDa ? 'Profilmatch' : 'Profile signal',
    useThisProfileIf: isDa ? 'Brug profilen hvis' : 'Use this profile if',
    leaveWith: isDa ? 'Muligt output' : 'Possible output',
    impact: isDa ? 'Bidrag' : 'Impact',
  }
  const facts = [
    { label: isDa ? 'Format' : 'Format', value: '60 min' },
    { label: isDa ? 'Pris' : 'Price', value: `DKK ${professional.price}` },
    { label: t.impact, value: `${professional.contributionPercent}% / DKK ${minimumImpact}` },
    { label: t.bestFor, value: bestFit },
    { label: isDa ? 'Output' : 'Output', value: primaryOutput },
  ]

  return (
    <main className="min-h-screen bg-white pb-24 md:pb-0">
      <section className="border-b border-white/15 bg-[#09090b] px-5 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[82rem] py-9 md:py-20">
          <Link href="/professionals" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/45 transition-colors hover:text-white md:mb-12">
            <span>&larr;</span><span>{t.back}</span>
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="signal-rail mb-7 max-w-24"><span /><span /><span /><span /></div>
              <p className="kicker mb-4 text-white/40 md:mb-6">
                {professional.industries.join(' / ')}
              </p>
              <h1 className="max-w-4xl text-5xl font-medium leading-[0.94] text-white text-balance sm:text-6xl md:text-8xl">{professional.name}</h1>
              <p className="mt-5 font-['Space_Grotesk'] text-base font-semibold text-white/70 md:mt-7 md:text-xl">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/52 md:mt-7 md:text-lg">{professional.bio}</p>
            </div>

            <aside className="hidden border border-white/20 bg-white/[0.035] p-6 text-white lg:block">
              <div className={`flex h-12 w-12 items-center justify-center rounded-md font-['Space_Grotesk'] text-sm font-bold text-gray-950 ${accentFor(professional)}`}>
                {initials(professional.name)}
              </div>
              <div className="mt-6 border-y border-white/15 py-5">
                <p className="editorial-label text-white/40">{t.session}</p>
                <p className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold text-white">DKK {professional.price}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t.briefing}</p>
              </div>
              <button type="button" onClick={() => setDrawerOpen(true)} className="button-inverse mt-5 w-full">
                {t.bookCta}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[82rem] px-5 py-12 sm:px-8 md:py-24 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10 md:space-y-14">
            <section>
              <p className="kicker mb-5">{t.profileSignal}</p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-gray-950 sm:text-4xl md:text-5xl">{t.useThisProfileIf}</h2>
              <div className="mt-8 border-t border-gray-200">
                {useCases.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[80px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="max-w-2xl font-['Space_Grotesk'] text-base font-semibold leading-relaxed text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="kicker mb-5">{t.leaveWith}</p>
              <h2 className="text-3xl font-semibold text-gray-950 sm:text-4xl md:text-5xl">{primaryOutput}</h2>
              <div className="mt-8 grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="bg-[#f4f4f0] p-5 transition-colors hover:bg-white">
                    <p className="font-['Space_Grotesk'] text-sm font-semibold text-gray-950">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="kicker mb-5">{t.focusAreas}</p>
              {focusAreas.length > 0 ? (
                <div className="border-t border-gray-200">
                  {focusAreas.map((area) => (
                    <div key={area} className="grid gap-3 border-b border-gray-200 py-5 md:grid-cols-[220px_1fr]">
                      <p className="text-sm font-black text-gray-950">{focusLabel(area, isDa ? 'da' : 'en')}</p>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {isDa ? 'Brug sessionen på konkrete spørgsmål, feedback og næste skridt.' : 'Use the session for concrete questions, feedback and next steps.'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{isDa ? 'Fokus aftales ved booking.' : 'Focus is agreed when booking.'}</p>
              )}
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">{t.sessionBrief}</p>
              <p className="max-w-2xl text-base leading-relaxed text-gray-600">{t.sessionBriefBody}</p>
            </section>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
            <span className={`mb-4 block h-1.5 w-10 rounded-full ${accentFor(professional)}`} />
            <div className="border-t border-gray-200">
              {facts.map((item) => (
                <div key={item.label} className="border-b border-gray-200 py-5">
                  <p className="text-xs font-black uppercase text-gray-400">{item.label}</p>
                  <p className="mt-2 text-lg font-black text-gray-950">{item.value}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setDrawerOpen(true)} className="button-primary mt-6 w-full">
              {t.bookCta}
            </button>
          </aside>
        </div>
      </div>

      {!drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-12px_40px_rgba(9,9,11,0.10)] backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-950">DKK {professional.price} · 60 min</p>
              <p className="truncate text-[11px] font-semibold text-gray-500">{isDa ? `DKK ${minimumImpact} afsættes ved betaling` : `DKK ${minimumImpact} allocated when paid`}</p>
            </div>
            <button type="button" onClick={() => setDrawerOpen(true)} className="button-primary min-h-11 shrink-0 px-5 py-2.5">
              {t.bookCta}
            </button>
          </div>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} />
    </main>
  )
}
