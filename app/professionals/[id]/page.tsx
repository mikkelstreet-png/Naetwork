'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/context/LanguageContext'
import Link from 'next/link'
import BookingDrawer from '@/components/BookingDrawer'
import { RefreshCw } from 'lucide-react'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  price: number
  contributionPercent: number
  bio: string
  focus_areas?: string[]
}

const FOCUS_LABELS: Record<string, string> = {
  cv_linkedin: 'CV / LinkedIn',
  application_review: 'Application Review',
  interview_prep: 'Interview Prep',
  case_prep: 'Case Prep',
  banking_technicals: 'Banking Technicals',
  consulting_cases: 'Consulting Cases',
  pe_investment_case: 'PE / Investment Case',
  career_direction: 'Career Direction',
  ai_career_strategy: 'AI Career Strategy',
  industry_insight: 'Industry Insight',
  mock_interview: 'Interview Prep',
  cv_review: 'CV / LinkedIn',
  career_strategy: 'Career Direction',
  career_advice: 'Career Direction',
  informal_chat: 'Industry Insight',
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'N'
}

function accentFor(pro: Professional) {
  if (pro.industries.includes('AI')) return 'bg-cyan-300'
  if (pro.industries.includes('Banking')) return 'bg-emerald-300'
  if (pro.industries.includes('Management Consulting')) return 'bg-blue-300'
  return 'bg-lime-300'
}

function contributionAmount(price: number, percentage: number) {
  return Math.round(price * percentage / 100)
}

function bestFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'PE / investment case' : 'PE / investment case'
  if (focus.includes('banking_technicals')) return isDa ? 'Banking technicals' : 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Consulting cases' : 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI career strategy' : 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Applications' : 'Applications'
  return isDa ? 'Career clarity' : 'Career clarity'
}

function primaryOutputFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return isDa ? 'Investment case og deal thinking' : 'Investment case and deal thinking'
  if (focus.includes('banking_technicals')) return isDa ? 'Technicals og interviewbar' : 'Technicals and interview bar'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return isDa ? 'Casestruktur og fit' : 'Case structure and fit'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return isDa ? 'AI-positionering' : 'AI positioning'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return isDa ? 'Skarpere materiale' : 'Sharper materials'
  return isDa ? 'Klarere næste skridt' : 'Clearer next steps'
}

function useCasesFor(pro: Professional, isDa: boolean) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) {
    return isDa
      ? ['Du søger Private Equity og vil forstå interviewbaren.', 'Du vil træne investment cases, deal thinking eller diligence-logik.', 'Du vil oversætte banking, consulting eller startup-erfaring til en PE-fortælling.']
      : ['You are targeting Private Equity and want to understand the interview bar.', 'You want to practice investment cases, deal thinking or diligence logic.', 'You want to translate banking, consulting or startup experience into a PE story.']
  }
  if (focus.includes('banking_technicals')) {
    return isDa
      ? ['Du søger Banking og vil forstå interviewbaren.', 'Du vil træne technicals, fit eller M&A-proces.', 'Du har materiale eller processtatus, der skal skærpes hurtigt.']
      : ['You are targeting Banking and want to understand the interview bar.', 'You want to practice technicals, fit or M&A process.', 'You have materials or process context that needs sharper positioning.']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Du vil træne cases med mere struktur og mindre støj.', 'Du vil forbedre fit-svar og personlig kommunikation.', 'Du vil forstå, hvordan konsulenthuse vurderer kandidater.']
      : ['You want to practice cases with more structure and less noise.', 'You want to improve fit answers and personal communication.', 'You want to understand how consultancies evaluate candidates.']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Du vil ind i AI og har brug for en klarere vej ind.', 'Du vil oversætte din erfaring til relevante AI-roller.', 'Du vil forstå portfolio, rolletyper og interviewvinkler.']
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
      ? ['Skærp investment case', 'Træn deal thinking', 'Forstå PE-forventninger', 'Få ærlig feedback på fit']
      : ['Sharpen investment case', 'Practice deal thinking', 'Understand PE expectations', 'Get honest fit feedback']
  }
  if (focus.includes('banking_technicals')) {
    return isDa
      ? ['Forstå interviewbaren', 'Træn technicals', 'Skærp M&A-story', 'Få ærlig feedback på fit']
      : ['Understand the interview bar', 'Practice technicals', 'Sharpen M&A story', 'Get honest fit feedback']
  }
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) {
    return isDa
      ? ['Strukturer cases bedre', 'Træn hypoteser', 'Kommunikér klarere', 'Forbered fit-svar']
      : ['Structure cases better', 'Practice hypotheses', 'Communicate more clearly', 'Prepare fit answers']
  }
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) {
    return isDa
      ? ['Afkod AI-roller', 'Positionér din erfaring', 'Byg stærkere portfolio', 'Vælg næste skridt']
      : ['Decode AI roles', 'Position your experience', 'Build a stronger portfolio', 'Choose next steps']
  }
  return isDa
    ? ['Skarpere CV', 'Bedre LinkedIn', 'Klarere ansøgning', 'Mere retning']
    : ['Sharper CV', 'Better LinkedIn', 'Clearer application', 'More direction']
}

export default function ProfessionalDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const { lang } = useLanguage()
  const isDa = lang === 'da'
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
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
      if (data) {
        const row = data as {
          id: string; name: string | null; title: string | null; company: string | null; bio: string | null
          price_dkk: number | null; contribution_percent: number | null; industries: string[] | null; focus_areas: string[] | null
        }
        setProfessional({
          id: row.id, name: row.name ?? '',
          title: row.title ?? '', company: row.company ?? '',
          industries: row.industries ?? [], price: row.price_dkk ?? 1200,
          contributionPercent: row.contribution_percent ?? 40,
          bio: row.bio ?? '', focus_areas: row.focus_areas ?? [],
        })
      } else {
        setProfessional(null)
      }
    } catch {
      setLoadError(true)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetchProfessional()
  }, [fetchProfessional])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">{isDa ? 'Indlæser...' : 'Loading...'}</p></div>

  if (loadError) return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white px-5 py-10">
      <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-[#f7f7f4] p-6">
        <span className="block h-2 w-10 rounded-full bg-cyan-300" aria-hidden="true" />
        <h1 className="mt-5 text-2xl font-black text-gray-950">{isDa ? 'Profilen kunne ikke indlæses' : 'The profile could not be loaded'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{isDa ? 'Forbindelsen svarede ikke. Prøv igen om et øjeblik.' : 'The connection did not respond. Please try again in a moment.'}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => void fetchProfessional()} className="inline-flex items-center gap-2 rounded-lg bg-gray-950 px-4 py-3 text-sm font-black text-white">
            <RefreshCw size={16} aria-hidden="true" />{isDa ? 'Prøv igen' : 'Try again'}
          </button>
          <Link href="/professionals" className="inline-flex items-center px-2 py-3 text-sm font-black text-gray-600">{isDa ? 'Alle profiler' : 'All profiles'}</Link>
        </div>
      </div>
    </main>
  )

  if (!professional) return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="mb-4 text-gray-500">{isDa ? 'Profil ikke fundet' : 'Profile not found'}</p>
        <Link href="/professionals" className="text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">{isDa ? 'Tilbage til profiler' : 'Back to profiles'}</Link>
      </div>
    </div>
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
    briefing: isDa ? `Du vælger selv fokus, når du booker. ${professional.contributionPercent}% / DKK ${minimumImpact} af en betalt session bidrager til Kræftens Bekæmpelse.` : `You choose the focus when you book. ${professional.contributionPercent}% / DKK ${minimumImpact} from a paid session contributes to Kræftens Bekæmpelse.`,
    bestFor: isDa ? 'Best for' : 'Best for',
    sessionBrief: isDa ? 'Session brief' : 'Session brief',
    sessionBriefBody: isDa
      ? 'Før du sender bookinganmodningen, vælger du fokus, beskriver dit mål og kan tilføje relevant materiale.'
      : 'Before sending the booking request, choose a focus, describe your goal and optionally add relevant material.',
    profileSignal: isDa ? 'Profil-signal' : 'Profile signal',
    useThisProfileIf: isDa ? 'Brug profilen hvis' : 'Use this profile if',
    leaveWith: isDa ? 'Muligt output' : 'Possible output',
    impact: isDa ? 'Impact' : 'Impact',
  }
  const facts = [
    { label: isDa ? 'Format' : 'Format', value: '60 min' },
    { label: isDa ? 'Pris' : 'Price', value: `DKK ${professional.price}` },
    { label: t.impact, value: `${professional.contributionPercent}% / DKK ${minimumImpact}` },
    { label: t.bestFor, value: bestFit },
    { label: isDa ? 'Output' : 'Output', value: primaryOutput },
  ]

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <section className="border-b border-gray-200 bg-white px-5 sm:px-8">
        <div className="mx-auto max-w-6xl py-7 md:py-16">
          <Link href="/professionals" className="mb-7 inline-flex items-center gap-2 text-sm font-black text-gray-500 transition-colors hover:text-gray-950 md:mb-10">
            <span>&larr;</span><span>{t.back}</span>
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <span className={`mb-5 block h-1.5 w-16 rounded-full md:mb-8 md:h-2 md:w-24 ${accentFor(professional)}`} />
              <p className="mb-3 text-xs font-black uppercase text-gray-400 md:mb-5">
                {professional.industries.join(' / ')}
              </p>
              <h1 className="max-w-4xl text-4xl font-black leading-none text-gray-950 text-balance sm:text-5xl md:text-7xl">{professional.name}</h1>
              <p className="mt-4 text-base font-black text-gray-700 md:mt-6 md:text-lg">{professional.title}{professional.company ? ` · ${professional.company}` : ''}</p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-600 md:mt-7 md:text-lg">{professional.bio}</p>
            </div>

            <aside className="hidden lg:block">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-950 text-sm font-black text-white">
                {initials(professional.name)}
              </div>
              <div className="mt-6 border-y border-gray-200 py-5">
                <p className="text-xs font-black uppercase text-gray-400">{t.session}</p>
                <p className="mt-2 text-3xl font-black text-gray-950">DKK {professional.price}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{t.briefing}</p>
              </div>
              <button onClick={() => setDrawerOpen(true)} className="mt-5 w-full rounded-lg bg-gray-950 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800">
                {t.bookCta}
              </button>
            </aside>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10 md:space-y-14">
            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{t.profileSignal}</p>
              <h2 className="max-w-2xl text-2xl font-black text-gray-950 sm:text-3xl md:text-5xl">{t.useThisProfileIf}</h2>
              <div className="mt-8 border-t border-gray-200">
                {useCases.map((item, index) => (
                  <div key={item} className="grid gap-4 border-b border-gray-200 py-6 md:grid-cols-[80px_1fr]">
                    <p className="text-xs font-black text-gray-300">0{index + 1}</p>
                    <p className="max-w-2xl text-base font-black leading-relaxed text-gray-950">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{t.leaveWith}</p>
              <h2 className="text-2xl font-black text-gray-950 sm:text-3xl md:text-5xl">{primaryOutput}</h2>
              <div className="mt-8 grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="bg-[#f7f7f4] p-5">
                    <p className="text-sm font-black text-gray-950">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">{t.focusAreas}</p>
              {focusAreas.length > 0 ? (
                <div className="border-t border-gray-200">
                  {focusAreas.map((area) => (
                    <div key={area} className="grid gap-3 border-b border-gray-200 py-5 md:grid-cols-[220px_1fr]">
                      <p className="text-sm font-black text-gray-950">{FOCUS_LABELS[area] ?? area}</p>
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
            <button onClick={() => setDrawerOpen(true)} className="mt-6 w-full rounded-lg bg-gray-950 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800">
              {t.bookCta}
            </button>
          </aside>
        </div>
      </main>

      {!drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-2xl shadow-gray-950/10 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-black text-gray-950">DKK {professional.price} · 60 min</p>
              <p className="truncate text-[11px] font-semibold text-gray-500">{isDa ? `Min. DKK ${minimumImpact} til kræftsagen` : `Min. DKK ${minimumImpact} contribution`}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="shrink-0 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              {t.bookCta}
            </button>
          </div>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={lang} />
    </div>
  )
}
