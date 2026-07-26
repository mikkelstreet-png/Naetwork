'use client'

import { ArrowRight, CalendarDays, Check, Pencil, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CATEGORIES } from '@/lib/categories'
import type { ProfessionalCard } from '@/lib/professionals'
import { SESSION_TYPES, isSessionTypeId, sessionType, type SessionTypeId } from '@/lib/sessionTypes'

const SITUATION_STORAGE_KEY = 'naetwork_active_situation'

type SituationStage = 'exploring' | 'preparing' | 'applying' | 'interviewing' | 'deciding'

interface Situation {
  id: string
  title: string
  category: string
  session_type: SessionTypeId
  stage: SituationStage
  deadline: string | null
  next_action: string | null
  updated_at: string
}

interface SavedProfessional {
  professional_profile_id: string
  professional: ProfessionalCard
}

interface Outcome {
  id: string
  booking_id: string
  professional_profile_id: string
  summary: string
  priorities: string[]
  next_action: string
  next_action_due_at: string | null
  candidate_completed_at: string | null
  definition_of_done_status: 'achieved' | 'partially_achieved' | 'not_achieved_yet' | null
  open_questions: string[]
  result_schema_version: 1 | 2
  next_moves: WorkspaceNextMove[]
  professional: ProfessionalCard | null
}

interface WorkspaceNextMove {
  id: string
  position: number
  action: string
  responsible: 'candidate' | 'professional' | 'shared'
  due_at: string | null
  status: 'pending' | 'completed'
  completed_at: string | null
}

interface WorkspaceData {
  situation: Situation | null
  savedProfessionals: SavedProfessional[]
  outcomes: Outcome[]
}

interface SituationDraft {
  title: string
  category: string
  sessionType: SessionTypeId
  stage: SituationStage
  deadline: string
  nextAction: string
}

const STAGES: Array<{ id: SituationStage; label: string }> = [
  { id: 'exploring', label: 'Undersøger muligheder' },
  { id: 'preparing', label: 'Forbereder mig' },
  { id: 'applying', label: 'Søger aktivt' },
  { id: 'interviewing', label: 'Er i interviewproces' },
  { id: 'deciding', label: 'Skal træffe et valg' },
]

function draftFromSituation(situation: Situation): SituationDraft {
  return {
    title: situation.title,
    category: situation.category,
    sessionType: situation.session_type,
    stage: situation.stage,
    deadline: situation.deadline ?? '',
    nextAction: situation.next_action ?? '',
  }
}

function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })
}

function firstCandidateNextMove(outcome: Outcome) {
  return outcome.next_moves.find((move) => (
    move.status === 'pending'
    && (move.responsible === 'candidate' || move.responsible === 'shared')
  )) ?? null
}

function contextualFollowUpReason(outcome: Outcome) {
  if (
    outcome.next_moves.length === 0
    || outcome.next_moves.some((move) => move.status !== 'completed')
  ) {
    return null
  }
  const openQuestion = outcome.open_questions.find((question) => question.trim())
  if (openQuestion) return `Afklar det åbne spørgsmål: ${openQuestion}`
  if (outcome.definition_of_done_status === 'partially_achieved') {
    return 'Vurdér, om dine gennemførte ændringer har bragt dig helt i mål.'
  }
  if (outcome.definition_of_done_status === 'not_achieved_yet') {
    return 'Følg op på det oprindelige mål efter de første gennemførte handlinger.'
  }
  return null
}

export function CareerWorkspace() {
  const [workspace, setWorkspace] = useState<WorkspaceData | null>(null)
  const [draft, setDraft] = useState<SituationDraft | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [updatingMoveId, setUpdatingMoveId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function load() {
      const response = await fetch('/api/workspace')
      const result = await response.json().catch(() => ({}))
      if (!active) return
      if (!response.ok) {
        setError(result.error || 'Dit arbejdsrum kunne ikke indlæses.')
        setLoading(false)
        return
      }

      let nextWorkspace = result as WorkspaceData
      const stored = window.localStorage.getItem(SITUATION_STORAGE_KEY)
      if (!nextWorkspace.situation && stored) {
        try {
          const pending = JSON.parse(stored) as Partial<SituationDraft>
          const syncResponse = await fetch('/api/workspace', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pending),
          })
          const synced = await syncResponse.json().catch(() => ({}))
          if (syncResponse.ok && active) {
            nextWorkspace = { ...nextWorkspace, situation: synced.situation }
            window.localStorage.removeItem(SITUATION_STORAGE_KEY)
          }
        } catch {
          window.localStorage.removeItem(SITUATION_STORAGE_KEY)
        }
      }

      if (!active) return
      setWorkspace(nextWorkspace)
      if (nextWorkspace.situation) setDraft(draftFromSituation(nextWorkspace.situation))
      setLoading(false)
    }

    void load()
    return () => { active = false }
  }, [])

  async function saveSituation() {
    if (!draft) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch('/api/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error)
      setWorkspace((current) => current ? { ...current, situation: result.situation } : current)
      setDraft(draftFromSituation(result.situation))
      setEditing(false)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Situationen kunne ikke gemmes.')
    } finally {
      setSaving(false)
    }
  }

  async function removeSavedProfessional(professionalId: string) {
    setError('')
    const response = await fetch(`/api/workspace?action=save_professional&professionalId=${encodeURIComponent(professionalId)}`, { method: 'DELETE' })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      setError(result.error || 'Profilen kunne ikke fjernes.')
      return
    }
    setWorkspace((current) => current ? {
      ...current,
      savedProfessionals: current.savedProfessionals.filter((item) => item.professional_profile_id !== professionalId),
    } : current)
  }

  async function completeNextMove(bookingId: string, moveId: string) {
    setUpdatingMoveId(moveId)
    setError('')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/session-plan/next-moves/${moveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Handlingen kunne ikke opdateres.')
      setWorkspace((current) => current ? {
        ...current,
        outcomes: current.outcomes.map((outcome) => outcome.booking_id === bookingId ? {
          ...outcome,
          next_moves: outcome.next_moves.map((move) => move.id === moveId ? result.nextMove : move),
        } : outcome),
      } : current)
    } catch (moveError) {
      setError(moveError instanceof Error ? moveError.message : 'Handlingen kunne ikke opdateres.')
    } finally {
      setUpdatingMoveId(null)
    }
  }

  if (loading) {
    return <section className="mb-12 border-y border-gray-300 bg-white px-5 py-8 text-sm text-gray-400">Indlæser din aktive situation...</section>
  }

  if (!workspace) {
    return error ? <p role="alert" className="mb-8 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p> : null
  }

  const situation = workspace.situation
  const primaryOutcome = workspace.outcomes.find((outcome) => firstCandidateNextMove(outcome)) ?? null
  const primaryNextMove = primaryOutcome ? firstCandidateNextMove(primaryOutcome) : null
  const awaitingProfessionalOutcome = primaryOutcome
    ? null
    : workspace.outcomes.find((outcome) => (
        outcome.next_moves.some((move) => move.status === 'pending' && move.responsible === 'professional')
      )) ?? null
  const awaitingProfessionalMove = awaitingProfessionalOutcome
    ? awaitingProfessionalOutcome.next_moves.find((move) => (
        move.status === 'pending' && move.responsible === 'professional'
      )) ?? null
    : null
  const followUpOutcome = primaryOutcome || awaitingProfessionalOutcome
    ? null
    : workspace.outcomes.find((outcome) => contextualFollowUpReason(outcome) && outcome.professional) ?? null
  const followUpReason = followUpOutcome ? contextualFollowUpReason(followUpOutcome) : null

  return (
    <div className="mb-14 space-y-12">
      {error && <p role="alert" className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}

      {primaryOutcome && primaryNextMove && (
        <section className="overflow-hidden border-y border-gray-300 bg-gray-950 text-white" aria-labelledby="workspace-primary-action">
          <div className="grid gap-6 px-5 py-7 md:grid-cols-[1fr_auto] md:items-end md:px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">Dit vigtigste næste træk</p>
              <h2 id="workspace-primary-action" className="mt-3 max-w-3xl text-2xl font-black leading-tight md:text-3xl">{primaryNextMove.action}</h2>
              <p className="mt-3 text-sm text-white/55">
                Fra sessionen med {primaryOutcome.professional?.name || 'din professionelle'}
                {primaryNextMove.due_at ? ` · senest ${formatDate(primaryNextMove.due_at)}` : ''}
              </p>
            </div>
            <button
              type="button"
              disabled={updatingMoveId !== null}
              onClick={() => void completeNextMove(primaryOutcome.booking_id, primaryNextMove.id)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <Check size={16} aria-hidden="true" />
              {updatingMoveId === primaryNextMove.id ? 'Gemmer…' : 'Markér som udført'}
            </button>
          </div>
          <div className="border-t border-white/15 px-5 py-4 md:px-8">
            <Link href={`/profil/bookings/${primaryOutcome.booking_id}`} className="inline-flex items-center gap-2 text-sm font-black text-white/70 transition-colors hover:text-white">
              Se konteksten i Session Plan <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {!primaryOutcome && awaitingProfessionalOutcome && awaitingProfessionalMove && (
        <section className="grid gap-5 border-y border-gray-300 bg-white px-5 py-6 md:grid-cols-[1fr_auto] md:items-center md:px-8" aria-labelledby="workspace-professional-follow-up">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">Næste i forløbet</p>
            <h2 id="workspace-professional-follow-up" className="mt-2 text-xl font-black text-gray-950">Den professionelle følger op.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{awaitingProfessionalMove.action}</p>
          </div>
          <Link href={`/profil/bookings/${awaitingProfessionalOutcome.booking_id}`} className="button-secondary inline-flex min-h-12 items-center gap-2">
            Se status i Session Plan <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      )}

      {!primaryOutcome && !awaitingProfessionalOutcome && followUpOutcome?.professional && followUpReason && (
        <section className="grid gap-5 border-y border-gray-300 bg-white px-5 py-6 md:grid-cols-[1fr_auto] md:items-center md:px-8" aria-labelledby="workspace-contextual-follow-up">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">Når dine handlinger er gennemført</p>
            <h2 id="workspace-contextual-follow-up" className="mt-2 text-xl font-black text-gray-950">En opfølgning har kun værdi med et nyt konkret mål.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">{followUpReason}</p>
          </div>
          <Link href={`/professionals/${followUpOutcome.professional.id}`} className="button-secondary inline-flex min-h-12 items-center gap-2">
            Åbn profilen hos {followUpOutcome.professional.name} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </section>
      )}

      <section aria-labelledby="career-situation-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-gray-400">Din aktive situation</p>
            <h2 id="career-situation-title" className="mt-2 text-2xl font-black text-gray-950">Fortsæt der, hvor du slap.</h2>
          </div>
          {situation && !editing && (
            <button type="button" onClick={() => setEditing(true)} className="inline-flex items-center gap-2 text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">
              <Pencil size={14} aria-hidden="true" /> Opdater situation
            </button>
          )}
        </div>

        {!situation ? (
          <div className="grid gap-5 border-y border-gray-300 bg-gray-950 px-5 py-7 text-white md:grid-cols-[1fr_auto] md:items-center md:px-8">
            <div>
              <h3 className="text-2xl font-black">Hvad skal være bedre om 60 minutter?</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">Vælg dit mål og din kategori. Naetwork gemmer situationen, så shortlist, session og næste handling hænger sammen.</p>
            </div>
            <Link href="/start" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3 text-sm font-black text-gray-950">Start med situationen <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        ) : editing && draft ? (
          <div className="border-y border-gray-300 bg-white px-5 py-6 md:px-8">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-xs font-black text-gray-700 md:col-span-2">
                Dit konkrete mål
                <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value.slice(0, 160) })} className="field-control mt-2 text-sm" />
              </label>
              <label className="text-xs font-black text-gray-700">
                Sessionstype
                <select value={draft.sessionType} onChange={(event) => isSessionTypeId(event.target.value) && setDraft({ ...draft, sessionType: event.target.value })} className="field-control mt-2 text-sm">
                  {SESSION_TYPES.map((item) => <option key={item.id} value={item.id}>{item.title.da}</option>)}
                </select>
              </label>
              <label className="text-xs font-black text-gray-700">
                Kategori
                <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="field-control mt-2 text-sm">
                  {CATEGORIES.map((item) => <option key={item.id} value={item.id}>{item.id}</option>)}
                </select>
              </label>
              <label className="text-xs font-black text-gray-700">
                Hvor er du i processen?
                <select value={draft.stage} onChange={(event) => setDraft({ ...draft, stage: event.target.value as SituationStage })} className="field-control mt-2 text-sm">
                  {STAGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <label className="text-xs font-black text-gray-700">
                Deadline (valgfri)
                <input type="date" value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} className="field-control mt-2 text-sm" />
              </label>
              <label className="text-xs font-black text-gray-700 md:col-span-2">
                Din næste handling (valgfri)
                <input value={draft.nextAction} onChange={(event) => setDraft({ ...draft, nextAction: event.target.value.slice(0, 300) })} className="field-control mt-2 text-sm" placeholder="Fx færdiggør CV og vælg to profiler" />
              </label>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={() => void saveSituation()} disabled={saving} className="button-primary min-h-10 py-2">{saving ? 'Gemmer...' : 'Gem situation'}</button>
              <button type="button" onClick={() => { setEditing(false); setDraft(draftFromSituation(situation)) }} disabled={saving} className="button-secondary min-h-10 py-2">Annuller</button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden border-y border-gray-300 bg-gray-950 text-white">
            <div className="grid gap-6 px-5 py-7 md:grid-cols-[1fr_220px] md:px-8">
              <div>
                <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/50">
                  <span>{situation.category}</span><span aria-hidden="true">·</span><span>{STAGES.find((stage) => stage.id === situation.stage)?.label}</span>
                </div>
                <h3 className="mt-3 max-w-2xl text-2xl font-black md:text-3xl">{situation.title}</h3>
                <p className="mt-3 text-sm text-white/60">{sessionType(situation.session_type).title.da} · 60 minutter</p>
              </div>
              <div className="border-t border-white/15 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/40">Næste handling</p>
                <p className="mt-2 text-sm font-black leading-relaxed">{situation.next_action || 'Vælg op til tre relevante profiler.'}</p>
                {situation.deadline && <p className="mt-2 text-xs text-white/50">Deadline {formatDate(situation.deadline)}</p>}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 border-t border-white/15 px-5 py-4 md:px-8">
              <Link href={`/professionals?field=${encodeURIComponent(situation.category)}&session=${situation.session_type}`} className="inline-flex items-center gap-2 text-sm font-black">Find relevant erfaring <ArrowRight size={15} aria-hidden="true" /></Link>
              <Link href="/profil/bookings" className="text-sm font-bold text-white/60 hover:text-white">Se sessioner</Link>
            </div>
          </div>
        )}
      </section>

      {workspace.savedProfessionals.length > 0 && (
        <section aria-labelledby="shortlist-title">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-gray-400">Din shortlist · maks. 3</p>
              <h2 id="shortlist-title" className="mt-2 text-2xl font-black text-gray-950">Erfaring, du vil sammenligne.</h2>
            </div>
            <Link href="/professionals" className="text-sm font-black text-gray-950 underline decoration-gray-300 underline-offset-4">Find flere</Link>
          </div>
          <div className="grid border-l border-t border-gray-300 bg-white md:grid-cols-3">
            {workspace.savedProfessionals.map(({ professional }) => (
              <article key={professional.id} className="flex min-h-64 flex-col border-b border-r border-gray-300 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{professional.industries[0] || 'Professionel erfaring'}</p>
                <h3 className="mt-4 text-xl font-black text-gray-950">{professional.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{[professional.title, professional.company].filter(Boolean).join(' · ')}</p>
                <p className="mt-5 text-sm font-black text-gray-950">DKK {professional.price.toLocaleString('da-DK')} · 60 min.</p>
                <p className="mt-1 text-xs text-gray-500">{professional.nextAvailableAt ? `Næste tid ${new Date(professional.nextAvailableAt).toLocaleDateString('da-DK', { day: 'numeric', month: 'short' })}` : 'Ingen ledige tider lige nu'}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <Link href={`/professionals/${professional.id}`} className="inline-flex items-center gap-2 text-sm font-black text-gray-950">Se profil og tider <ArrowRight size={14} aria-hidden="true" /></Link>
                  <button type="button" onClick={() => void removeSavedProfessional(professional.id)} className="inline-flex h-9 w-9 items-center justify-center text-gray-400 hover:text-gray-950" aria-label={`Fjern ${professional.name} fra shortlist`}><Trash2 size={15} aria-hidden="true" /></button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {workspace.outcomes.length > 0 && (
        <section aria-labelledby="plans-title">
          <div className="mb-5">
            <p className="text-xs font-black uppercase text-gray-400">Efter sessionen</p>
            <h2 id="plans-title" className="mt-2 text-2xl font-black text-gray-950">Dine dokumenterede resultater.</h2>
          </div>
          <div className="border-t border-gray-300 bg-white">
            {workspace.outcomes.slice(0, 3).map((outcome) => {
              const completedMoves = outcome.next_moves.filter((move) => move.status === 'completed').length
              const allMovesCompleted = outcome.next_moves.length > 0 && completedMoves === outcome.next_moves.length
              return (
                <article key={outcome.id} className="grid gap-4 border-b border-gray-300 px-5 py-5 md:grid-cols-[1fr_220px_auto] md:items-center">
                  <div>
                    <p className="text-sm font-black text-gray-950">{outcome.professional?.name || 'Din session'}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">{outcome.summary}</p>
                  </div>
                  <div className={allMovesCompleted ? 'text-emerald-700' : 'text-gray-950'}>
                    <p className="text-[10px] font-black uppercase text-gray-400">Fremdrift</p>
                    <p className="mt-1 text-sm font-black">
                      {outcome.next_moves.length > 0
                        ? `${completedMoves} af ${outcome.next_moves.length} næste træk udført`
                        : outcome.candidate_completed_at
                          ? 'Næste handling udført'
                          : 'Resultatet er klar'}
                    </p>
                  </div>
                  <Link href={`/profil/bookings/${outcome.booking_id}`} className="inline-flex items-center gap-2 text-sm font-black text-gray-950">
                    {allMovesCompleted ? <Check size={15} aria-hidden="true" /> : <CalendarDays size={15} aria-hidden="true" />} Åbn Session Plan
                  </Link>
                </article>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
