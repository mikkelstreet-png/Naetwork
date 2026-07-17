'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Eye,
  EyeOff,
  Linkedin,
  LoaderCircle,
  RotateCcw,
  X,
} from 'lucide-react'
import { AdminEmptyState, AdminPageHeader } from '@/components/AdminShell'
import { categoryForAreas } from '@/lib/categories'
import { focusLabel } from '@/lib/platform'
import { createClient } from '@/lib/supabase/client'

type Visibility = 'hidden' | 'published'
type ReviewStatus = 'pending' | 'approved' | 'rejected'
type StatusFilter = ReviewStatus | 'all'
type ConfirmAction = { id: string; type: 'reject' | 'hide' } | null

interface Professional {
  id: string
  profile_id: string | null
  name: string
  title: string | null
  company: string | null
  bio: string | null
  industries: string[] | null
  focus_areas: string[] | null
  price_dkk: number
  linkedin_url: string | null
  visibility: Visibility
  review_status: ReviewStatus
  created_at: string
  future_slots: number | null
}

interface Notice {
  tone: 'success' | 'error'
  title: string
  body: string
}

const STATUS_TABS: Array<{ label: string; value: StatusFilter }> = [
  { label: 'Til gennemgang', value: 'pending' },
  { label: 'Godkendte', value: 'approved' },
  { label: 'Afviste', value: 'rejected' },
  { label: 'Alle', value: 'all' },
]

function ReviewBadge({ status, visibility }: { status: ReviewStatus; visibility: Visibility }) {
  const label = status === 'pending'
    ? 'Afventer gennemgang'
    : status === 'rejected'
      ? 'Kræver ændringer'
      : visibility === 'published'
        ? 'Godkendt og synlig'
        : 'Godkendt, men skjult'
  const tone = status === 'pending'
    ? 'border-amber-200 bg-amber-50 text-amber-900'
    : status === 'rejected'
      ? 'border-red-200 bg-red-50 text-red-800'
      : visibility === 'published'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-gray-200 bg-gray-100 text-gray-700'
  const Icon = status === 'pending' ? Clock3 : status === 'rejected' ? AlertCircle : visibility === 'published' ? CheckCircle2 : EyeOff

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-black ${tone}`}>
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  )
}

function verifiedLinkedInUrl(value: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'https:' && /(^|\.)linkedin\.com$/i.test(url.hostname) ? url.toString() : null
  } catch {
    return null
  }
}

function profileQuality(profile: Professional) {
  const checks = [
    { label: 'navn', complete: profile.name !== 'Navn mangler' },
    { label: 'titel', complete: Boolean(profile.title?.trim()) },
    { label: 'virksomhed', complete: Boolean(profile.company?.trim()) },
    { label: 'bio', complete: Boolean(profile.bio?.trim()) },
    { label: 'fagområde', complete: Boolean(profile.industries?.length) },
    { label: 'sessionstyper', complete: Boolean(profile.focus_areas?.length) },
    { label: 'pris', complete: Number.isFinite(profile.price_dkk) && profile.price_dkk > 0 },
    { label: 'gyldigt LinkedIn-link', complete: Boolean(verifiedLinkedInUrl(profile.linkedin_url)) },
  ]
  const completed = checks.filter((check) => check.complete).length
  return {
    percentage: Math.round((completed / checks.length) * 100),
    missing: checks.filter((check) => !check.complete).map((check) => check.label),
  }
}

function formatDkk(value: number) {
  return new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(value)
}

function actionError(status: number, serverMessage?: string) {
  if (status === 401) return { title: 'Din session er udløbet', body: 'Log ind igen, og gentag derefter handlingen.' }
  if (status === 403) return { title: 'Adminadgang mangler', body: 'Din bruger har ikke rettighed til at ændre professionelle profiler.' }
  if (status >= 500) return { title: 'Godkendelsen kunne ikke gemmes', body: 'Der er en serverfejl. Åbn Systemstatus, og prøv igen, når forbindelsen er grøn.' }
  return { title: 'Profilen blev ikke opdateret', body: serverMessage || 'Kontrollér oplysningerne, og prøv igen.' }
}

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [filter, setFilter] = useState<StatusFilter>('pending')
  const [loading, setLoading] = useState(true)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  const loadProfessionals = useCallback(async ({ keepNotice = false }: { keepNotice?: boolean } = {}) => {
    setLoading(true)
    if (!keepNotice) setNotice(null)
    const supabase = createClient()
    const { data, error: loadError } = await supabase
      .from('professional_profiles')
      .select('id, profile_id, title, company, bio, industries, focus_areas, price_dkk, linkedin_url, visibility, review_status, created_at')
      .order('created_at', { ascending: false })

    if (loadError) {
      setNotice({
        tone: 'error',
        title: 'Profilerne kunne ikke indlæses',
        body: 'Kontrollér Systemstatus og din forbindelse, og prøv derefter igen.',
      })
      setProfessionals([])
      setLoading(false)
      return
    }

    const rows = (data as Array<Omit<Professional, 'name' | 'future_slots'>> | null) ?? []
    const profileIds = Array.from(new Set(rows.map((row) => row.profile_id).filter(Boolean))) as string[]
    const professionalIds = rows.map((row) => row.id)
    const [profileResult, availabilityResult] = await Promise.all([
      profileIds.length
        ? supabase.from('profiles').select('id, name').in('id', profileIds)
        : Promise.resolve({ data: [], error: null }),
      professionalIds.length
        ? supabase
          .from('availability_slots')
          .select('professional_profile_id')
          .in('professional_profile_id', professionalIds)
          .eq('is_available', true)
          .gte('starts_at', new Date().toISOString())
        : Promise.resolve({ data: [], error: null }),
    ])

    const { data: profiles, error: profileError } = profileResult

    if (profileError) {
      setNotice({
        tone: 'error',
        title: 'Nogle profilnavne mangler',
        body: 'Resten af reviewkøen er indlæst. Genindlæs siden for at forsøge igen.',
      })
    }
    const names = new Map(((profiles as Array<{ id: string; name: string | null }> | null) ?? []).map((profile) => [profile.id, profile.name || 'Navn mangler']))
    const slotCounts = new Map<string, number>()
    if (!availabilityResult.error) {
      ((availabilityResult.data as Array<{ professional_profile_id: string }> | null) ?? []).forEach((slot) => {
        slotCounts.set(slot.professional_profile_id, (slotCounts.get(slot.professional_profile_id) ?? 0) + 1)
      })
    }
    setProfessionals(rows.map((row) => ({
      ...row,
      name: row.profile_id ? names.get(row.profile_id) ?? 'Navn mangler' : 'Navn mangler',
      future_slots: availabilityResult.error ? null : slotCounts.get(row.id) ?? 0,
    })))
    setLoading(false)
  }, [])

  useEffect(() => { void loadProfessionals() }, [loadProfessionals])

  async function updateReview(profile: Professional, reviewStatus: ReviewStatus, visibility: Visibility) {
    const actionKey = `${profile.id}:${reviewStatus}:${visibility}`
    setActionLoading(actionKey)
    setNotice(null)

    try {
      const response = await fetch(`/api/admin/professionals/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewStatus, visibility }),
      })
      const result = await response.json().catch(() => ({})) as { error?: string; auditLogged?: boolean; notificationSent?: boolean | null }

      if (!response.ok) {
        const failure = actionError(response.status, result.error)
        setNotice({ tone: 'error', ...failure })
        return
      }

      const success = reviewStatus === 'rejected'
        ? { title: `${profile.name} kræver ændringer`, body: 'Profilen er afvist og skjult fra hjemmesiden.' }
        : visibility === 'hidden'
          ? { title: `${profile.name} er skjult`, body: 'Godkendelsen er bevaret, men profilen vises ikke offentligt.' }
          : profile.review_status === 'approved'
            ? { title: `${profile.name} er publiceret`, body: 'Profilen er nu synlig på hjemmesiden.' }
            : { title: `${profile.name} er godkendt`, body: 'Profilen er godkendt og publiceret på hjemmesiden.' }

      setConfirmAction(null)
      setNotice({
        tone: 'success',
        ...success,
        body: [
          success.body,
          result.notificationSent === false ? 'Statusmailen kunne ikke sendes; kontrollér E-mailhændelser.' : '',
          result.auditLogged === false ? 'Auditloggen kunne ikke opdateres; kontrollér Systemstatus.' : '',
        ].filter(Boolean).join(' '),
      })
      await loadProfessionals({ keepNotice: true })
    } catch {
      setNotice({
        tone: 'error',
        title: 'Forbindelsen blev afbrudt',
        body: 'Ingen bekræftelse blev modtaget. Kontrollér profilens status, før du prøver igen.',
      })
    } finally {
      setActionLoading(null)
    }
  }

  const counts = useMemo(() => ({
    all: professionals.length,
    pending: professionals.filter((profile) => profile.review_status === 'pending').length,
    approved: professionals.filter((profile) => profile.review_status === 'approved').length,
    published: professionals.filter((profile) => profile.review_status === 'approved' && profile.visibility === 'published').length,
    rejected: professionals.filter((profile) => profile.review_status === 'rejected').length,
  }), [professionals])

  const filtered = useMemo(() => {
    if (filter === 'all') return professionals
    return professionals.filter((profile) => profile.review_status === filter)
  }, [filter, professionals])

  const summaryCards: Array<{ label: string; value: number; note: string; filter: StatusFilter }> = [
    { label: 'Til gennemgang', value: counts.pending, note: 'Kræver din beslutning', filter: 'pending' },
    { label: 'Godkendte', value: counts.approved, note: `${counts.published} er synlige`, filter: 'approved' },
    { label: 'Kræver ændringer', value: counts.rejected, note: 'Afvist og skjult', filter: 'rejected' },
    { label: 'Alle profiler', value: counts.all, note: 'Samlet overblik', filter: 'all' },
  ]

  return (
    <>
      <AdminPageHeader
        eyebrow="Kvalitet og publicering"
        title="Professionelle"
        description="Gennemgå profilens relevans og kvalitet. En godkendelse publicerer profilen med det samme; en afvisning eller skjulning fjerner den fra hjemmesiden."
      />

      <section aria-label="Reviewstatus" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const active = filter === card.filter
          return (
            <button
              key={card.label}
              type="button"
              onClick={() => setFilter(card.filter)}
              aria-pressed={active}
              className={`rounded-xl border p-4 text-left transition-all sm:p-5 ${active ? 'border-gray-950 bg-gray-950 text-white shadow-sm' : 'border-gray-200 bg-white text-gray-950 hover:border-gray-400'}`}
            >
              <span className={`block text-[10px] font-black uppercase tracking-[0.08em] ${active ? 'text-white/55' : 'text-gray-400'}`}>{card.label}</span>
              <span className="mt-3 block text-2xl font-black tabular-nums sm:text-3xl">{loading ? '—' : card.value}</span>
              <span className={`mt-1 block text-[11px] font-semibold sm:text-xs ${active ? 'text-white/60' : 'text-gray-500'}`}>{card.note}</span>
            </button>
          )
        })}
      </section>

      <div className="mt-7 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.08em] text-gray-400">Reviewkø</p>
          <h2 className="mt-1 text-xl font-black text-gray-950">
            {filter === 'pending' ? 'Profiler, der venter på dig' : STATUS_TABS.find((tab) => tab.value === filter)?.label}
          </h2>
        </div>
        <div className="inline-flex w-full flex-wrap rounded-lg border border-gray-200 bg-white p-1 sm:w-auto" role="group" aria-label="Filtrér profiler">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setFilter(tab.value)}
              aria-pressed={filter === tab.value}
              className={`min-h-9 shrink-0 rounded-md px-3 text-xs font-black transition-colors ${filter === tab.value ? 'bg-gray-950 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div
          role={notice.tone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={`mt-4 flex items-start gap-3 rounded-xl border px-4 py-3.5 ${notice.tone === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-950' : 'border-red-200 bg-red-50 text-red-900'}`}
        >
          {notice.tone === 'success' ? <CheckCircle2 className="mt-0.5 shrink-0" size={18} aria-hidden="true" /> : <AlertCircle className="mt-0.5 shrink-0" size={18} aria-hidden="true" />}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black">{notice.title}</p>
            <p className="mt-0.5 text-xs leading-relaxed opacity-80 sm:text-sm">{notice.body}</p>
            {notice.tone === 'error' && (
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                <button type="button" onClick={() => void loadProfessionals()} className="inline-flex items-center gap-1.5 text-xs font-black underline underline-offset-4">
                  <RotateCcw size={12} aria-hidden="true" /> Prøv igen
                </button>
                <Link href="/admin/system" className="text-xs font-black underline underline-offset-4">Åbn Systemstatus</Link>
              </div>
            )}
          </div>
          <button type="button" onClick={() => setNotice(null)} className="rounded-md p-1 opacity-60 hover:opacity-100" aria-label="Luk besked"><X size={16} aria-hidden="true" /></button>
        </div>
      )}

      <section aria-label="Professionelle profiler" className="mt-4 space-y-3">
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white"><AdminEmptyState title="Indlæser profiler..." body="Reviewkøen hentes fra Supabase." /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white">
            <AdminEmptyState
              title={filter === 'pending' ? 'Reviewkøen er tom' : 'Ingen profiler i denne visning'}
              body={filter === 'pending' ? 'Der er ingen professionelle, der afventer godkendelse.' : 'Skift filter for at se profiler med en anden status.'}
            />
          </div>
        ) : filtered.map((profile) => {
          const category = categoryForAreas(profile.industries ?? [])
          const linkedInUrl = verifiedLinkedInUrl(profile.linkedin_url)
          const quality = profileQuality(profile)
          const isThisProfileLoading = actionLoading?.startsWith(`${profile.id}:`) ?? false
          const isApproving = actionLoading === `${profile.id}:approved:published`
          const isRejecting = actionLoading === `${profile.id}:rejected:hidden`
          const isHiding = actionLoading === `${profile.id}:approved:hidden`
          const contribution = profile.price_dkk * 0.1
          const confirmation = confirmAction?.id === profile.id ? confirmAction.type : null

          return (
            <article key={profile.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_0_rgba(17,24,39,0.02)]">
              <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-lg font-black text-gray-950">{profile.name}</h3>
                    <ReviewBadge status={profile.review_status} visibility={profile.visibility} />
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-600">{[profile.title, profile.company].filter(Boolean).join(' · ') || 'Titel og virksomhed mangler'}</p>
                  <p className="mt-2 text-[11px] font-bold text-gray-400">Ansøgt {new Date(profile.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  {linkedInUrl ? (
                    <a href={linkedInUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-black text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-950">
                      <Linkedin size={13} aria-hidden="true" /> Verificér <ExternalLink size={11} aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-black text-red-700"><AlertCircle size={13} aria-hidden="true" /> LinkedIn mangler</span>
                  )}
                  {profile.review_status === 'approved' && profile.visibility === 'published' ? (
                    <Link href={`/professionals/${profile.id}`} target="_blank" className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-black text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-950">
                      <Eye size={13} aria-hidden="true" /> Åbn profil <ExternalLink size={11} aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 text-xs font-bold text-gray-400" title="Profilen kan åbnes, når den er publiceret">
                      <EyeOff size={13} aria-hidden="true" /> Preview efter publicering
                    </span>
                  )}
                </div>
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.5fr)_minmax(240px,0.75fr)_minmax(220px,0.62fr)]">
                <div className="min-w-0 px-4 py-5 sm:px-5 lg:border-r lg:border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-[0.09em] text-gray-400">Profil og relevans</p>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">{profile.bio || 'Bio mangler. Bed den professionelle om at beskrive erfaringen og hvornår den er relevant.'}</p>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-black text-gray-950">{category?.id || 'Kategori mangler'}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(profile.industries?.length ? profile.industries : ['Fagområde mangler']).map((area) => <span key={area} className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-bold text-gray-600">{area}</span>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-950">Kan hjælpe med</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(profile.focus_areas?.length ? profile.focus_areas : ['Sessionstyper mangler']).map((area) => <span key={area} className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-bold text-gray-600">{focusLabel(area)}</span>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-5 sm:px-5 lg:border-r lg:border-t-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.09em] text-gray-400">Pris og bidrag</p>
                  <p className="mt-3 text-xl font-black text-gray-950">{formatDkk(profile.price_dkk)}</p>
                  <p className="mt-1 text-xs font-semibold text-gray-500">60 minutter</p>
                  <div className="mt-4 rounded-lg bg-[#f7f7f4] px-3 py-3">
                    <p className="text-xs font-black text-gray-950">{formatDkk(contribution)} til Kræftens Bekæmpelse</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-500">10 % ved en gennemført og betalt session.</p>
                  </div>
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">Bookingstatus</p>
                    {profile.future_slots === null ? (
                      <p className="mt-2 flex items-start gap-2 text-xs font-bold leading-relaxed text-gray-500"><AlertCircle size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> Tilgængelighed kunne ikke kontrolleres.</p>
                    ) : profile.future_slots > 0 ? (
                      <p className="mt-2 flex items-start gap-2 text-xs font-black leading-relaxed text-emerald-800"><CheckCircle2 size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> Bookbar · {profile.future_slots} {profile.future_slots === 1 ? 'ledig tid' : 'ledige tider'}</p>
                    ) : (
                      <p className="mt-2 flex items-start gap-2 text-xs font-black leading-relaxed text-amber-800"><Clock3 size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> Ikke bookbar · mangler ledige tider</p>
                    )}
                    <p className="mt-1 text-[11px] leading-relaxed text-gray-500">Reviewstatus og bookingstatus er uafhængige.</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 px-4 py-5 sm:px-5 lg:border-t-0">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.09em] text-gray-400">Profilkomplethed</p>
                    <span className={`text-sm font-black tabular-nums ${quality.percentage === 100 ? 'text-emerald-700' : 'text-amber-800'}`}>{quality.percentage}%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100" aria-label={`Profilen er ${quality.percentage} procent komplet`}>
                    <div className={`h-full rounded-full ${quality.percentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${quality.percentage}%` }} />
                  </div>
                  {quality.missing.length === 0 ? (
                    <p className="mt-3 flex items-start gap-2 text-xs font-bold leading-relaxed text-emerald-800"><Check size={13} className="mt-0.5 shrink-0" aria-hidden="true" /> Alle centrale profilfelter er udfyldt.</p>
                  ) : (
                    <p className="mt-3 text-xs leading-relaxed text-gray-500"><span className="font-black text-gray-700">Mangler:</span> {quality.missing.join(', ')}.</p>
                  )}
                </div>
              </div>

              {confirmation && (
                <div className="border-t border-red-100 bg-red-50 px-4 py-4 sm:px-5" role="alertdialog" aria-labelledby={`confirm-${profile.id}`}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p id={`confirm-${profile.id}`} className="text-sm font-black text-red-950">{confirmation === 'reject' ? `Afvis ${profile.name}?` : `Skjul ${profile.name}?`}</p>
                      <p className="mt-1 text-xs leading-relaxed text-red-800">{confirmation === 'reject' ? 'Profilen markeres som “kræver ændringer” og bliver skjult fra hjemmesiden.' : 'Profilen forbliver godkendt, men kan ikke ses eller bookes på hjemmesiden.'}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button type="button" onClick={() => setConfirmAction(null)} disabled={isThisProfileLoading} className="min-h-10 rounded-lg border border-red-200 bg-white px-3 text-xs font-black text-red-800 disabled:opacity-50">Annuller</button>
                      <button
                        type="button"
                        onClick={() => void updateReview(profile, confirmation === 'reject' ? 'rejected' : 'approved', 'hidden')}
                        disabled={isThisProfileLoading}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 text-xs font-black text-white disabled:opacity-50"
                      >
                        {(isRejecting || isHiding) && <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />}
                        {confirmation === 'reject' ? 'Ja, afvis og skjul' : 'Ja, skjul profil'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-gray-100 bg-[#fcfcfa] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="max-w-xl text-xs leading-relaxed text-gray-500">
                  {profile.review_status === 'pending'
                    ? 'Godkend kun, når erfaring, fokusområder og LinkedIn er verificeret. Profilen bliver synlig med det samme.'
                    : profile.review_status === 'rejected'
                      ? 'Godkend igen, når de nødvendige profilændringer er gennemført.'
                      : profile.visibility === 'published'
                        ? profile.future_slots === 0
                          ? 'Profilen er live, men kan først bookes, når den professionelle har åbnet ledige tider.'
                          : 'Profilen er live og kan findes af kandidater.'
                        : 'Profilen er godkendt, men ikke synlig for kandidater.'}
                </p>
                {!confirmation && <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
                  {profile.review_status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => setConfirmAction({ id: profile.id, type: 'reject' })}
                      disabled={isThisProfileLoading}
                      className="min-h-10 rounded-lg border border-gray-200 bg-white px-3.5 text-xs font-black text-gray-600 transition-colors hover:border-red-300 hover:text-red-700 disabled:opacity-50"
                    >
                      Afvis profil
                    </button>
                  )}
                  {profile.review_status === 'approved' && profile.visibility === 'published' && (
                    <button
                      type="button"
                      onClick={() => setConfirmAction({ id: profile.id, type: 'hide' })}
                      disabled={isThisProfileLoading}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-xs font-black text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-950 disabled:opacity-50"
                    >
                      <EyeOff size={13} aria-hidden="true" /> Skjul profil
                    </button>
                  )}
                  {(profile.review_status !== 'approved' || profile.visibility !== 'published') && (
                    <button
                      type="button"
                      onClick={() => void updateReview(profile, 'approved', 'published')}
                      disabled={isThisProfileLoading}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 text-xs font-black text-white transition-colors hover:bg-black disabled:cursor-wait disabled:opacity-60"
                    >
                      {isApproving ? <LoaderCircle size={15} className="animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <CheckCircle2 size={15} aria-hidden="true" />}
                      {isApproving ? 'Godkender og publicerer…' : profile.review_status === 'approved' ? 'Publicér profil' : 'Godkend og publicér'}
                    </button>
                  )}
                </div>}
              </div>
            </article>
          )
        })}
      </section>
    </>
  )
}
