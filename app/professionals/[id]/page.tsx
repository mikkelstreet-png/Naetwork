'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BookingDrawer from '@/components/BookingDrawer'
import { ECONOMICS, economicsSummary, formatDkk, splitPayment } from '@/lib/economics'

type VerificationStatus = 'pending' | 'verified' | 'placeholder'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  price: number
  bio: string
  focus_areas?: string[]
  photoUrl?: string
  linkedinUrl?: string
  verificationStatus?: VerificationStatus
  outputPromise?: string
  sessionsCompleted?: number
}

const FOCUS_LABELS: Record<string, string> = {
  cv_linkedin: 'CV / LinkedIn',
  application_review: 'Ansøgning',
  interview_prep: 'Interviewtræning',
  case_prep: 'Case prep',
  banking_technicals: 'Banking technicals',
  consulting_cases: 'Consulting cases',
  pe_investment_case: 'PE / investment case',
  career_direction: 'Karriereretning',
  ai_career_strategy: 'AI career strategy',
  industry_insight: 'Industriindsigt',
  mock_interview: 'Interviewtræning',
  cv_review: 'CV / LinkedIn',
  career_strategy: 'Karriereretning',
  career_advice: 'Karriereretning',
  informal_chat: 'Industriindsigt',
}

const DEMO_PROFESSIONALS: Record<string, Professional> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Pladsholder: Banking',
    title: 'Associate Director',
    company: 'TODO: Danske Bank',
    industries: ['Banking'],
    price: 1200,
    bio: 'Pladsholderprofil til at demonstrere strukturen. Skal erstattes af en rigtig, samtykket professional før lancering.',
    focus_areas: ['cv_linkedin', 'interview_prep', 'banking_technicals'],
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med technicals, fit-story og tre prioriterede næste skridt.',
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Pladsholder: Consulting',
    title: 'Senior Consultant',
    company: 'TODO: McKinsey & Company',
    industries: ['Management Consulting'],
    price: 1100,
    bio: 'Pladsholderprofil til consulting-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    focus_areas: ['case_prep', 'consulting_cases', 'interview_prep', 'career_direction'],
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med casestruktur, fit-svar og træningsprioriteter.',
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Pladsholder: AI',
    title: 'AI Product Lead',
    company: 'TODO: Synthesia',
    industries: ['AI'],
    price: 900,
    bio: 'Pladsholderprofil til AI-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    focus_areas: ['ai_career_strategy', 'industry_insight', 'career_direction', 'application_review'],
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med rolle-shortlist, portfolio-prioriteter og proof points.',
  },
  'demo-4': {
    id: 'demo-4',
    name: 'Pladsholder: Private Equity',
    title: 'Investment Professional',
    company: 'TODO: Nordic Capital',
    industries: ['Private Equity'],
    price: 1500,
    bio: 'Pladsholderprofil til PE-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    focus_areas: ['pe_investment_case', 'interview_prep', 'career_direction', 'industry_insight'],
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med investment case, deal thinking og diligence-spørgsmål.',
  },
}

function initials(name: string) {
  return name
    .replace('Pladsholder:', '')
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

function verificationLabel(status?: VerificationStatus) {
  if (status === 'verified') return 'Verificeret profil'
  if (status === 'placeholder') return 'Pladsholder - ikke verificeret'
  return 'Afventer verifikation'
}

function bestFor(pro: Professional) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return 'PE / investment case'
  if (focus.includes('banking_technicals')) return 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return 'Ansøgninger'
  return 'Karriereretning'
}

function primaryOutputFor(pro: Professional) {
  if (pro.outputPromise) return pro.outputPromise
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return '1-sides action-plan med investment case og deal thinking.'
  if (focus.includes('banking_technicals')) return '1-sides action-plan med technicals, fit-story og interviewbar.'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return '1-sides action-plan med casestruktur, hypoteser og fit-svar.'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return '1-sides action-plan med AI-positionering, rollevalg og portfolio-prioriteter.'
  return '1-sides action-plan med næste skridt, tre prioriteter og konkrete ressourcer.'
}

function useCasesFor(pro: Professional) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return ['Du søger Private Equity og vil forstå interviewbaren.', 'Du vil træne investment cases, deal thinking eller diligence-logik.', 'Du vil oversætte banking, consulting eller startup-erfaring til en PE-fortælling.']
  if (focus.includes('banking_technicals')) return ['Du søger Banking og vil forstå interviewbaren.', 'Du vil træne technicals, fit eller M&A-proces.', 'Du har materiale eller processtatus, der skal skærpes hurtigt.']
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return ['Du vil træne cases med mere struktur og mindre støj.', 'Du vil forbedre fit-svar og personlig kommunikation.', 'Du vil forstå, hvordan konsulenthuse vurderer kandidater.']
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return ['Du vil ind i AI og har brug for en klarere vej ind.', 'Du vil oversætte din erfaring til relevante AI-roller.', 'Du vil forstå portfolio, rolletyper og interviewvinkler.']
  return ['Du vil gøre dit CV, LinkedIn eller ansøgningsmateriale skarpere.', 'Du vil have ærlig feedback fra en person tættere på markedet.', 'Du vil afklare næste skridt før en vigtig beslutning.']
}

function outcomesFor(pro: Professional) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return ['Skærp investment case', 'Træn deal thinking', 'Forstå PE-forventninger', 'Få ærlig feedback på fit']
  if (focus.includes('banking_technicals')) return ['Forstå interviewbaren', 'Træn technicals', 'Skærp M&A-story', 'Få ærlig feedback på fit']
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return ['Strukturer cases bedre', 'Træn hypoteser', 'Kommunikér klarere', 'Forbered fit-svar']
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return ['Afkod AI-roller', 'Positionér din erfaring', 'Byg stærkere portfolio', 'Vælg næste skridt']
  return ['Skarpere CV', 'Bedre LinkedIn', 'Klarere ansøgning', 'Mere retning']
}

export default function ProfessionalDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (!id) return
    if (id.startsWith('demo-')) {
      setProfessional(DEMO_PROFESSIONALS[id] ?? null)
      setLoading(false)
      return
    }
    async function fetchProfessional() {
      const { data } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, focus_areas, photo_url, linkedin_url, verification_status, output_promise, sessions_completed, profiles!inner(name)')
        .eq('id', id)
        .single()
      if (data) {
        const row = data as {
          id: string; title: string | null; company: string | null; bio: string | null
          price_dkk: number | null; industries: string[] | null; focus_areas: string[] | null
          photo_url?: string | null; linkedin_url?: string | null; verification_status?: VerificationStatus | null
          output_promise?: string | null; sessions_completed?: number | null
          profiles: { name?: string | null } | null
        }
        setProfessional({
          id: row.id,
          name: row.profiles?.name ?? '',
          title: row.title ?? '',
          company: row.company ?? '',
          industries: row.industries ?? [],
          price: row.price_dkk ?? 1200,
          bio: row.bio ?? '',
          focus_areas: row.focus_areas ?? [],
          photoUrl: row.photo_url ?? undefined,
          linkedinUrl: row.linkedin_url ?? undefined,
          verificationStatus: row.verification_status ?? 'pending',
          outputPromise: row.output_promise ?? undefined,
          sessionsCompleted: row.sessions_completed ?? 0,
        })
      }
      setLoading(false)
    }
    fetchProfessional()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading) return <div className="flex min-h-screen items-center justify-center bg-white"><p className="text-gray-400">Indlæser...</p></div>

  if (!professional) return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="text-center">
        <p className="mb-4 text-gray-500">Profil ikke fundet</p>
        <Link href="/professionals" className="text-sm font-semibold text-gray-950 underline decoration-gray-300 underline-offset-4">Tilbage til profiler</Link>
      </div>
    </div>
  )

  const split = splitPayment(professional.price)
  const focusAreas = professional.focus_areas ?? []
  const bestFit = bestFor(professional)
  const primaryOutput = primaryOutputFor(professional)
  const useCases = useCasesFor(professional)
  const outcomes = outcomesFor(professional)
  const facts = [
    { label: 'Format', value: `${ECONOMICS.sessionMinutes} min` },
    { label: 'Pris', value: formatDkk(professional.price) },
    { label: ECONOMICS.charityName, value: formatDkk(split.charity) },
    { label: 'Ekspert', value: formatDkk(split.professional) },
    { label: 'Platform', value: formatDkk(split.platform) },
    { label: 'Best for', value: bestFit },
  ]

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-0">
      <section className="border-b border-gray-200 bg-white px-5 pt-16 sm:px-8">
        <div className="mx-auto max-w-6xl py-10 md:py-20">
          <Link href="/professionals" className="mb-10 inline-flex items-center gap-2 text-sm font-black text-gray-500 transition-colors hover:text-gray-950">
            <span>&larr;</span><span>Tilbage til profiler</span>
          </Link>

          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <span className={`mb-8 block h-2 w-24 rounded-full ${accentFor(professional)}`} />
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <p className="text-xs font-black uppercase text-gray-400">{professional.industries.join(' / ')}</p>
                <span className="rounded-lg border border-gray-200 bg-[#f7f7f4] px-2.5 py-1 text-[11px] font-black uppercase text-gray-500">{verificationLabel(professional.verificationStatus)}</span>
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.92] text-gray-950 text-balance md:text-8xl">{professional.name}</h1>
              <p className="mt-6 text-lg font-black text-gray-700">{professional.title} · {professional.company}</p>
              {professional.linkedinUrl ? (
                <a href={professional.linkedinUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-black uppercase text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">
                  Verificér på LinkedIn
                </a>
              ) : (
                <p className="mt-3 text-xs font-semibold uppercase text-gray-400">LinkedIn tilføjes ved verifikation</p>
              )}
              <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{professional.bio}</p>
            </div>

            <aside className="border-t border-gray-200 pt-6 lg:border-t-0 lg:pt-0">
              {professional.photoUrl ? (
                <img src={professional.photoUrl} alt={`Foto af ${professional.name}`} className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-950 text-sm font-black text-white">{initials(professional.name)}</div>
              )}
              <div className="mt-6 border-y border-gray-200 py-5">
                <p className="text-xs font-black uppercase text-gray-400">60 min 1:1 session</p>
                <p className="mt-2 text-3xl font-black text-gray-950">{formatDkk(professional.price)}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{economicsSummary(professional.price)}</p>
              </div>
              <button onClick={() => setDrawerOpen(true)} className="mt-5 w-full rounded-lg bg-gray-950 px-5 py-3.5 text-sm font-black text-white transition-colors hover:bg-gray-800">
                Book 60 min
              </button>
            </aside>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-14">
            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Profil-signal</p>
              <h2 className="max-w-2xl text-3xl font-black text-gray-950 md:text-5xl">Brug profilen hvis</h2>
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
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Hvad du sidder med bagefter</p>
              <h2 className="text-3xl font-black text-gray-950 md:text-5xl">{primaryOutput}</h2>
              <div className="mt-8 grid gap-px border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {outcomes.map((outcome) => (
                  <div key={outcome} className="bg-[#f7f7f4] p-5">
                    <p className="text-sm font-black text-gray-950">{outcome}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="mb-5 text-xs font-black uppercase text-gray-400">Fokusområder</p>
              {focusAreas.length > 0 ? (
                <div className="border-t border-gray-200">
                  {focusAreas.map((area) => (
                    <div key={area} className="grid gap-3 border-b border-gray-200 py-5 md:grid-cols-[220px_1fr]">
                      <p className="text-sm font-black text-gray-950">{FOCUS_LABELS[area] ?? area}</p>
                      <p className="text-sm leading-relaxed text-gray-500">Brug sessionen på konkrete spørgsmål, feedback og næste skridt.</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Fokus aftales ved booking.</p>
              )}
            </section>

            <section className="border-y border-gray-200 py-8">
              <p className="mb-4 text-xs font-black uppercase text-gray-400">Session brief</p>
              <p className="max-w-2xl text-base leading-relaxed text-gray-600">Før du sender bookinganmodningen, vælger du pres, procesfase, mål og eventuelt materiale. Det giver den professionelle bedre kontekst. Betaling håndteres separat efter bekræftelse.</p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
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
              Book 60 min
            </button>
          </aside>
        </div>
      </main>

      {!drawerOpen && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-2xl shadow-gray-950/10 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-gray-400">60 min 1:1 session</p>
              <p className="text-sm font-black text-gray-950">{formatDkk(professional.price)} · {formatDkk(split.charity)} til {ECONOMICS.charityName}</p>
            </div>
            <button onClick={() => setDrawerOpen(true)} className="rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              Book
            </button>
          </div>
        </div>
      )}

      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale="da" />
    </div>
  )
}
