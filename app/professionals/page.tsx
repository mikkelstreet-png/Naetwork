'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BookingDrawer from '@/components/BookingDrawer'
import { ECONOMICS, economicsSummary, formatDkk, splitPayment } from '@/lib/economics'

type Industry = 'all' | 'AI' | 'Banking' | 'Management Consulting' | 'Private Equity'
type VerificationStatus = 'pending' | 'verified' | 'placeholder'

interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  focus_areas?: string[]
  price: number
  bio: string
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
}

const DEMO_PROFESSIONALS: ProfessionalCard[] = [
  {
    id: 'demo-1',
    name: 'Pladsholder: Banking',
    title: 'Associate Director',
    company: 'TODO: Danske Bank',
    industries: ['Banking'],
    focus_areas: ['cv_linkedin', 'interview_prep', 'banking_technicals'],
    price: 1200,
    bio: 'Pladsholderprofil til at demonstrere strukturen. Skal erstattes af en rigtig, samtykket professional før lancering.',
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med technicals, fit-story og tre prioriterede næste skridt.',
  },
  {
    id: 'demo-2',
    name: 'Pladsholder: Consulting',
    title: 'Senior Consultant',
    company: 'TODO: McKinsey & Company',
    industries: ['Management Consulting'],
    focus_areas: ['case_prep', 'consulting_cases', 'interview_prep', 'career_direction'],
    price: 1100,
    bio: 'Pladsholderprofil til consulting-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med casestruktur, fit-svar og træningsprioriteter.',
  },
  {
    id: 'demo-3',
    name: 'Pladsholder: AI',
    title: 'AI Product Lead',
    company: 'TODO: Synthesia',
    industries: ['AI'],
    focus_areas: ['ai_career_strategy', 'industry_insight', 'career_direction', 'application_review'],
    price: 900,
    bio: 'Pladsholderprofil til AI-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med rolle-shortlist, portfolio-prioriteter og proof points.',
  },
  {
    id: 'demo-4',
    name: 'Pladsholder: Private Equity',
    title: 'Investment Professional',
    company: 'TODO: Nordic Capital',
    industries: ['Private Equity'],
    focus_areas: ['pe_investment_case', 'interview_prep', 'career_direction', 'industry_insight'],
    price: 1500,
    bio: 'Pladsholderprofil til PE-sporet. Skal erstattes af en rigtig, samtykket professional før lancering.',
    verificationStatus: 'placeholder',
    outputPromise: '1-sides action-plan med investment case, deal thinking og diligence-spørgsmål.',
  },
]

const INDUSTRIES: Industry[] = ['all', 'AI', 'Banking', 'Management Consulting', 'Private Equity']

const FIELD_SIGNALS = [
  ['AI', 'bg-cyan-300'],
  ['Banking', 'bg-emerald-300'],
  ['Management Consulting', 'bg-blue-300'],
  ['Private Equity', 'bg-lime-300'],
] as const

function industryLabel(industry: Industry) {
  if (industry === 'all') return 'Alle'
  return industry
}

function accentForIndustry(industry?: string) {
  if (industry === 'AI') return 'bg-cyan-300'
  if (industry === 'Banking') return 'bg-emerald-300'
  if (industry === 'Management Consulting') return 'bg-blue-300'
  if (industry === 'Private Equity') return 'bg-lime-300'
  return 'bg-gray-300'
}

function accentFor(pro: ProfessionalCard) {
  const primary = FIELD_SIGNALS.find(([industry]) => pro.industries.includes(industry))?.[0]
  return accentForIndustry(primary ?? pro.industries[0])
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

function verificationLabel(status?: VerificationStatus) {
  if (status === 'verified') return 'Verificeret profil'
  if (status === 'placeholder') return 'Pladsholder - ikke verificeret'
  return 'Afventer verifikation'
}

function bestFor(pro: ProfessionalCard) {
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return 'PE / investment case'
  if (focus.includes('banking_technicals')) return 'Banking technicals'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return 'Consulting cases'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return 'AI career strategy'
  if (focus.includes('cv_linkedin') || focus.includes('application_review')) return 'Ansøgninger'
  return 'Karriereretning'
}

function primaryOutputFor(pro: ProfessionalCard) {
  if (pro.outputPromise) return pro.outputPromise
  const focus = pro.focus_areas ?? []
  if (focus.includes('pe_investment_case')) return '1-sides action-plan med investment case og deal thinking.'
  if (focus.includes('banking_technicals')) return '1-sides action-plan med technicals, fit-story og interviewbar.'
  if (focus.includes('consulting_cases') || focus.includes('case_prep')) return '1-sides action-plan med casestruktur, hypoteser og fit-svar.'
  if (focus.includes('ai_career_strategy') || focus.includes('industry_insight')) return '1-sides action-plan med AI-positionering, rollevalg og portfolio-prioriteter.'
  return '1-sides action-plan med næste skridt, tre prioriteter og konkrete ressourcer.'
}

function isIndustry(value: string | null): value is Industry {
  return !!value && INDUSTRIES.includes(value as Industry) && value !== 'all'
}

export default function ProfessionalsPage() {
  const [industryFilter, setIndustryFilter] = useState<Industry>('all')
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const field = new URLSearchParams(window.location.search).get('field')
    if (isIndustry(field)) setIndustryFilter(field)
  }, [])

  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, focus_areas, photo_url, linkedin_url, verification_status, output_promise, sessions_completed, profiles!inner(name)')
        .eq('visibility', 'published')

      if (error || !data) return

      const mapped: ProfessionalCard[] = (data as Array<{
        id: string
        title: string | null
        company: string | null
        bio: string | null
        price_dkk: number | null
        industries: string[] | null
        focus_areas: string[] | null
        photo_url?: string | null
        linkedin_url?: string | null
        verification_status?: VerificationStatus | null
        output_promise?: string | null
        sessions_completed?: number | null
        profiles: { name?: string | null } | null
      }>).map((p) => ({
        id: p.id,
        name: p.profiles?.name ?? '',
        title: p.title ?? '',
        company: p.company ?? '',
        industries: p.industries ?? [],
        focus_areas: p.focus_areas ?? [],
        price: p.price_dkk ?? 1200,
        bio: p.bio ?? '',
        photoUrl: p.photo_url ?? undefined,
        linkedinUrl: p.linkedin_url ?? undefined,
        verificationStatus: p.verification_status ?? 'pending',
        outputPromise: p.output_promise ?? undefined,
        sessionsCompleted: p.sessions_completed ?? 0,
      }))
      setDbProfessionals(mapped)
    }
    fetchProfessionals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allProfessionals = dbProfessionals.length > 0 ? dbProfessionals : DEMO_PROFESSIONALS

  const filtered = allProfessionals.filter((p) => {
    const matchesIndustry = industryFilter === 'all' || p.industries.includes(industryFilter)
    const searchLower = search.toLowerCase()
    const focusText = (p.focus_areas ?? []).map((area) => FOCUS_LABELS[area] ?? area).join(' ')
    const matchesSearch = !search || [p.name, p.title, p.company, p.bio, p.industries.join(' '), focusText, primaryOutputFor(p)]
      .join(' ')
      .toLowerCase()
      .includes(searchLower)
    return matchesIndustry && matchesSearch
  })

  const qualitySignals = [
    [`${ECONOMICS.sessionMinutes} min`, 'Fast format'],
    [`${ECONOMICS.charityPercent}/${ECONOMICS.professionalPercent}/${ECONOMICS.platformPercent}`, 'Fast fordeling'],
    [ECONOMICS.sessionsCompletedLabel, 'Sessioner gennemført'],
  ] as const

  const standards = [
    ['Verificerbart signal', 'Profilen viser rolle, konkret firma, LinkedIn-flade og verificeringsstatus.'],
    ['Konkret output', 'Hver session lover en 1-sides action-plan med næste skridt, tre prioriteter og ressourcer.'],
    ['Synlig økonomi', 'Prisfordelingen vises direkte fra én fælles konfiguration.'],
  ] as const

  function resetFilters() {
    setSearch('')
    setIndustryFilter('all')
    window.history.replaceState(null, '', '/professionals')
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="border-b border-gray-200 bg-white px-5 pt-16 sm:px-8">
        <div className="mx-auto max-w-6xl py-16 md:py-24">
          <p className="mb-5 text-xs font-black uppercase text-gray-400">Naetwork</p>
          <h1 className="max-w-5xl text-5xl font-black leading-[0.92] text-gray-950 text-balance md:text-8xl">Profiler.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">Rolle, felt, output, pris og fordeling. Vælg den rigtige person uden støj.</p>

          <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
            {FIELD_SIGNALS.map(([field, accent]) => (
              <div key={field} className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${accent}`} />
                <span className="text-xs font-black uppercase text-gray-500">{field}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 grid max-w-2xl gap-px border border-gray-200 bg-gray-200 sm:grid-cols-3">
            {qualitySignals.map(([value, label]) => (
              <div key={label} className="bg-white p-4">
                <p className="text-xl font-black text-gray-950">{value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-400">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 grid gap-5 border-y border-gray-200 py-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Søg rolle, firma, fokus eller felt..."
              className="w-full border-0 bg-transparent py-3 text-base font-semibold text-gray-950 outline-none placeholder:text-gray-400"
            />
            <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg border px-3 py-2 text-xs font-black transition-colors ${industryFilter === ind ? 'border-gray-950 bg-gray-950 text-white' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-950 hover:text-gray-950'}`}
                >
                  <span className={`h-2 w-2 rounded-full ${ind === 'all' ? (industryFilter === ind ? 'bg-white/80' : 'bg-gray-300') : accentForIndustry(ind)}`} />
                  {industryLabel(ind)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main id="marketplace" className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <p className="text-sm font-black text-gray-950">{filtered.length} profiler</p>
          <p className="text-xs font-bold uppercase text-gray-400">{ECONOMICS.charityPercent}% til {ECONOMICS.charityName}</p>
        </div>

        <section className="mb-10 grid gap-px border border-gray-200 bg-gray-200 md:grid-cols-3">
          {standards.map(([title, body]) => (
            <div key={title} className="bg-[#f7f7f4] p-5">
              <p className="text-sm font-black text-gray-950">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
            </div>
          ))}
        </section>

        {filtered.length === 0 ? (
          <div className="border-y border-gray-200 py-16 text-center">
            <p className="text-xl font-black text-gray-950">Ingen match</p>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">Nulstil søgning eller vælg alle felter.</p>
            <button onClick={resetFilters} className="mt-6 rounded-lg bg-gray-950 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-gray-800">
              Nulstil
            </button>
          </div>
        ) : (
          <div className="border-t border-gray-200">
            {filtered.map((pro) => {
              const split = splitPayment(pro.price)
              return (
                <article key={pro.id} className="relative grid gap-5 border-b border-gray-200 py-7 transition-colors hover:bg-[#fafaf8] md:grid-cols-[86px_1.05fr_1.05fr_210px_150px] md:items-center md:px-3 md:pl-5">
                  <span className={`absolute left-0 top-7 hidden h-10 w-1 rounded-full md:block ${accentFor(pro)}`} />
                  <div className="flex items-center gap-3">
                    {pro.photoUrl ? (
                      <img src={pro.photoUrl} alt={`Foto af ${pro.name}`} className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-950 text-sm font-black text-white">{initials(pro.name)}</span>
                    )}
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`h-2 w-8 rounded-full ${accentFor(pro)}`} />
                      <span className="text-[11px] font-black uppercase text-gray-400">{verificationLabel(pro.verificationStatus)}</span>
                    </div>
                    <h2 className="text-2xl font-black leading-tight text-gray-950">{pro.name}</h2>
                    <p className="mt-1 text-sm font-semibold text-gray-600">{pro.title} · {pro.company}</p>
                    {pro.linkedinUrl ? (
                      <a href={pro.linkedinUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-xs font-black uppercase text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-950">
                        Verificér på LinkedIn
                      </a>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-gray-400">LinkedIn tilføjes ved verifikation</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-black text-gray-950">{bestFor(pro)}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{primaryOutputFor(pro)}</p>
                  </div>

                  <div>
                    <p className="text-lg font-black text-gray-950">{formatDkk(pro.price)}</p>
                    <div className="mt-2 space-y-1 text-xs font-semibold text-gray-500">
                      <p>{formatDkk(split.charity)} til {ECONOMICS.charityName}</p>
                      <p>{formatDkk(split.professional)} til eksperten</p>
                      <p>{formatDkk(split.platform)} til platformen</p>
                    </div>
                  </div>

                  <div className="flex gap-2 md:justify-end">
                    <Link href={`/professionals/${pro.id}`} className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-black text-gray-950 transition-colors hover:border-gray-950 hover:bg-white">
                      Profil
                    </Link>
                    <button
                      onClick={() => setBookTarget(pro)}
                      className="inline-flex items-center justify-center rounded-lg bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition-colors hover:bg-gray-800"
                      aria-label={`Book 60 minutter med ${pro.name}. ${economicsSummary(pro.price)}`}
                    >
                      Book
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale="da" />
      )}
    </div>
  )
}
