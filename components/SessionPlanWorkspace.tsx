'use client'

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FileText,
  LockKeyhole,
  RotateCw,
  Save,
  Target,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MemberNav } from '@/components/MemberNav'
import { StatusBadge } from '@/components/StatusBadge'
import {
  SESSION_PLAN_LIMITS,
  preparationProgress,
  type NextMoveResponsible,
  type SessionPlanOutcomeDraft,
  type SessionPlanPreparationDraft,
  type SessionPlanResponse,
} from '@/lib/sessionPlan'
import { isSessionTypeId, sessionType } from '@/lib/sessionTypes'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type BookingAction = 'confirm' | 'cancel' | 'complete'

const ACTIVE_BOOKING_STATUSES = ['requested', 'pending', 'confirmed', 'rescheduled']

const EMPTY_PREPARATION: SessionPlanPreparationDraft = {
  problem: '',
  context: '',
  desiredOutcome: '',
  definitionOfDone: '',
  keyQuestions: [''],
  anythingElse: '',
}

const EMPTY_OUTCOME: SessionPlanOutcomeDraft = {
  keyInsights: '',
  recommendation: '',
  decisions: [''],
  definitionOfDoneStatus: '',
  openQuestions: [''],
  nextMoves: [{ action: '', responsible: 'candidate', dueAt: '' }],
}

function preparationFromResponse(data: SessionPlanResponse): SessionPlanPreparationDraft {
  return {
    problem: data.preparation.problem ?? '',
    context: data.preparation.context ?? '',
    desiredOutcome: data.preparation.desired_outcome ?? '',
    definitionOfDone: data.preparation.definition_of_done ?? '',
    keyQuestions: data.preparation.key_questions?.length ? data.preparation.key_questions : [''],
    anythingElse: data.preparation.anything_else ?? '',
  }
}

function outcomeFromResponse(data: SessionPlanResponse): SessionPlanOutcomeDraft {
  if (!data.outcome) return EMPTY_OUTCOME
  return {
    keyInsights: data.outcome.summary ?? '',
    recommendation: data.outcome.recommendation ?? '',
    decisions: data.outcome.decisions?.length ? data.outcome.decisions : [''],
    definitionOfDoneStatus: data.outcome.definition_of_done_status ?? '',
    openQuestions: data.outcome.open_questions?.length ? data.outcome.open_questions : [''],
    nextMoves: data.outcome.next_moves?.length
      ? data.outcome.next_moves.map((move) => ({
          id: move.id,
          action: move.action,
          responsible: move.responsible,
          dueAt: move.due_at ?? '',
        }))
      : EMPTY_OUTCOME.nextMoves,
  }
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString('da-DK', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen',
  })
}

function formatShortDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('da-DK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function saveLabel(state: SaveState) {
  if (state === 'saving') return 'Gemmer…'
  if (state === 'saved') return 'Gemt'
  if (state === 'error') return 'Kunne ikke gemme'
  return 'Alle ændringer gemmes automatisk'
}

export function SessionPlanWorkspace({ bookingId }: { bookingId: string }) {
  const [data, setData] = useState<SessionPlanResponse | null>(null)
  const [preparation, setPreparation] = useState<SessionPlanPreparationDraft>(EMPTY_PREPARATION)
  const [outcome, setOutcome] = useState<SessionPlanOutcomeDraft>(EMPTY_OUTCOME)
  const [privateNote, setPrivateNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [preparationSaveState, setPreparationSaveState] = useState<SaveState>('idle')
  const [noteSaveState, setNoteSaveState] = useState<SaveState>('idle')
  const [outcomeSaveState, setOutcomeSaveState] = useState<SaveState>('idle')
  const [preparationDirty, setPreparationDirty] = useState(false)
  const [noteDirty, setNoteDirty] = useState(false)
  const [outcomeDirty, setOutcomeDirty] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [updatingMoveId, setUpdatingMoveId] = useState<string | null>(null)
  const [bookingActionLoading, setBookingActionLoading] = useState<BookingAction | null>(null)
  const [confirmDecline, setConfirmDecline] = useState(false)
  const [actionSuccess, setActionSuccess] = useState('')
  const requestSequence = useRef(0)
  const preparationAutosaveTimer = useRef<number | null>(null)
  const outcomeAutosaveTimer = useRef<number | null>(null)
  const preparationRef = useRef<SessionPlanPreparationDraft>(EMPTY_PREPARATION)
  const privateNoteRef = useRef('')
  const outcomeRef = useRef<SessionPlanOutcomeDraft>(EMPTY_OUTCOME)
  const preparationUpdatedAtRef = useRef<string | null>(null)
  const privateNoteUpdatedAtRef = useRef<string | null>(null)
  const outcomeUpdatedAtRef = useRef<string | null>(null)
  const preparationVersion = useRef(0)
  const privateNoteVersion = useRef(0)
  const outcomeVersion = useRef(0)
  const preparationDirtyRef = useRef(false)
  const privateNoteDirtyRef = useRef(false)
  const outcomeDirtyRef = useRef(false)
  const preparationSaveQueue = useRef<Promise<boolean>>(Promise.resolve(true))
  const privateNoteSaveQueue = useRef<Promise<boolean>>(Promise.resolve(true))
  const outcomeSaveQueue = useRef<Promise<boolean>>(Promise.resolve(true))
  const flushPendingSavesRef = useRef<() => void>(() => undefined)

  const load = useCallback(async () => {
    const sequence = ++requestSequence.current
    setLoading(true)
    setLoadError('')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/session-plan`, { cache: 'no-store' })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Session Plan kunne ikke indlæses.')
      if (sequence !== requestSequence.current) return
      const nextData = result as SessionPlanResponse
      const nextPreparation = preparationFromResponse(nextData)
      const nextOutcome = outcomeFromResponse(nextData)
      const nextPrivateNote = nextData.privateNote ?? ''
      setData(nextData)
      preparationRef.current = nextPreparation
      outcomeRef.current = nextOutcome
      privateNoteRef.current = nextPrivateNote
      preparationUpdatedAtRef.current = nextData.preparation.updated_at
      privateNoteUpdatedAtRef.current = nextData.privateNoteUpdatedAt ?? null
      outcomeUpdatedAtRef.current = nextData.outcome?.updated_at ?? null
      preparationVersion.current = 0
      outcomeVersion.current = 0
      privateNoteVersion.current = 0
      setPreparation(nextPreparation)
      setOutcome(nextOutcome)
      setPrivateNote(nextPrivateNote)
      preparationDirtyRef.current = false
      privateNoteDirtyRef.current = false
      outcomeDirtyRef.current = false
      setPreparationDirty(false)
      setNoteDirty(false)
      setOutcomeDirty(false)
    } catch (error) {
      if (sequence === requestSequence.current) {
        setLoadError(error instanceof Error ? error.message : 'Session Plan kunne ikke indlæses.')
      }
    } finally {
      if (sequence === requestSequence.current) setLoading(false)
    }
  }, [bookingId])

  useEffect(() => {
    void load()
  }, [load])

  const progress = useMemo(() => preparationProgress(preparation), [preparation])

  const savePreparation = useCallback((
    requestedStatus: 'draft' | 'ready' = 'draft',
    showError = false,
  ) => {
    if (!data?.permissions.canEditPreparation) return Promise.resolve(false)
    const task = preparationSaveQueue.current.then(async () => {
      const version = preparationVersion.current
      const snapshot = preparationRef.current
      setPreparationSaveState('saving')
      if (showError) setActionError('')
      try {
        const response = await fetch(`/api/bookings/${bookingId}/session-plan`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...snapshot,
            preparationStatus: requestedStatus,
            expectedUpdatedAt: preparationUpdatedAtRef.current,
          }),
          keepalive: true,
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Forberedelsen kunne ikke gemmes.')
        preparationUpdatedAtRef.current = result.preparation.updated_at
        setData((current) => current ? { ...current, preparation: result.preparation } : current)
        if (version === preparationVersion.current) {
          preparationDirtyRef.current = false
          setPreparationDirty(false)
          setPreparationSaveState('saved')
        }
        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Forberedelsen kunne ikke gemmes.'
        setPreparationSaveState('error')
        setActionError(message)
        return false
      }
    })
    preparationSaveQueue.current = task
    return task
  }, [bookingId, data?.permissions.canEditPreparation])

  useEffect(() => {
    if (!preparationDirty || !data?.permissions.canEditPreparation) return
    preparationAutosaveTimer.current = window.setTimeout(() => {
      preparationAutosaveTimer.current = null
      const requestedStatus = data.preparation.preparation_status === 'ready' && progress.ready
        ? 'ready'
        : 'draft'
      void savePreparation(requestedStatus)
    }, 900)
    return () => {
      if (preparationAutosaveTimer.current !== null) {
        window.clearTimeout(preparationAutosaveTimer.current)
        preparationAutosaveTimer.current = null
      }
    }
  }, [data?.permissions.canEditPreparation, data?.preparation.preparation_status, preparation, preparationDirty, progress.ready, savePreparation])

  const savePrivateNote = useCallback(() => {
    if (!data?.permissions.canEditPrivateNote) return Promise.resolve(false)
    const task = privateNoteSaveQueue.current.then(async () => {
      const version = privateNoteVersion.current
      const snapshot = privateNoteRef.current
      setNoteSaveState('saving')
      try {
        const response = await fetch(`/api/bookings/${bookingId}/session-plan/private-notes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note: snapshot,
            expectedUpdatedAt: privateNoteUpdatedAtRef.current,
          }),
          keepalive: true,
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Noten kunne ikke gemmes.')
        privateNoteUpdatedAtRef.current = result.privateNoteUpdatedAt
        if (version === privateNoteVersion.current) {
          const storedNote = result.privateNote ?? ''
          privateNoteRef.current = storedNote
          setPrivateNote(storedNote)
          privateNoteDirtyRef.current = false
          setNoteDirty(false)
          setNoteSaveState('saved')
        }
        return true
      } catch (error) {
        setNoteSaveState('error')
        setActionError(error instanceof Error ? error.message : 'Noten kunne ikke gemmes.')
        return false
      }
    })
    privateNoteSaveQueue.current = task
    return task
  }, [bookingId, data?.permissions.canEditPrivateNote])

  useEffect(() => {
    if (!noteDirty || !data?.permissions.canEditPrivateNote) return
    const timer = window.setTimeout(() => void savePrivateNote(), 900)
    return () => window.clearTimeout(timer)
  }, [data?.permissions.canEditPrivateNote, noteDirty, privateNote, savePrivateNote])

  const saveOutcome = useCallback((publish = false) => {
    if (!data?.permissions.canEditOutcome) return Promise.resolve(false)
    if (publish) {
      setPublishing(true)
      setActionError('')
    }
    const task = outcomeSaveQueue.current.then(async () => {
      const version = outcomeVersion.current
      const snapshot = outcomeRef.current
      setOutcomeSaveState('saving')
      try {
        const response = await fetch(`/api/bookings/${bookingId}/outcome`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...snapshot,
            publish,
            expectedUpdatedAt: outcomeUpdatedAtRef.current,
          }),
          keepalive: true,
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Resultatet kunne ikke gemmes.')
        outcomeUpdatedAtRef.current = result.outcome.updated_at
        setData((current) => current ? {
          ...current,
          outcome: result.outcome,
          permissions: {
            ...current.permissions,
            canEditOutcome: result.outcome.result_status !== 'published',
          },
        } : current)
        if (version === outcomeVersion.current) {
          const storedOutcome = outcomeFromResponse({ ...data, outcome: result.outcome })
          outcomeRef.current = storedOutcome
          setOutcome(storedOutcome)
          outcomeDirtyRef.current = false
          setOutcomeDirty(false)
          setOutcomeSaveState('saved')
        }
        return true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Resultatet kunne ikke gemmes.'
        setOutcomeSaveState('error')
        setActionError(message)
        return false
      } finally {
        if (publish) setPublishing(false)
      }
    })
    outcomeSaveQueue.current = task
    return task
  }, [bookingId, data])

  useEffect(() => {
    if (!outcomeDirty || !data?.permissions.canEditOutcome) return
    outcomeAutosaveTimer.current = window.setTimeout(() => {
      outcomeAutosaveTimer.current = null
      void saveOutcome(false)
    }, 1_100)
    return () => {
      if (outcomeAutosaveTimer.current !== null) {
        window.clearTimeout(outcomeAutosaveTimer.current)
        outcomeAutosaveTimer.current = null
      }
    }
  }, [data?.permissions.canEditOutcome, outcome, outcomeDirty, saveOutcome])

  useEffect(() => {
    flushPendingSavesRef.current = () => {
      if (preparationAutosaveTimer.current !== null) {
        window.clearTimeout(preparationAutosaveTimer.current)
        preparationAutosaveTimer.current = null
      }
      if (outcomeAutosaveTimer.current !== null) {
        window.clearTimeout(outcomeAutosaveTimer.current)
        outcomeAutosaveTimer.current = null
      }
      if (preparationDirtyRef.current && data?.permissions.canEditPreparation) {
        const requestedStatus = data.preparation.preparation_status === 'ready' && preparationProgress(preparationRef.current).ready
          ? 'ready'
          : 'draft'
        void savePreparation(requestedStatus)
      }
      if (privateNoteDirtyRef.current && data?.permissions.canEditPrivateNote) {
        void savePrivateNote()
      }
      if (outcomeDirtyRef.current && data?.permissions.canEditOutcome) {
        void saveOutcome(false)
      }
    }
  }, [
    data?.permissions.canEditOutcome,
    data?.permissions.canEditPreparation,
    data?.permissions.canEditPrivateNote,
    data?.preparation.preparation_status,
    saveOutcome,
    savePreparation,
    savePrivateNote,
  ])

  useEffect(() => {
    const flush = () => flushPendingSavesRef.current()
    window.addEventListener('pagehide', flush)
    return () => {
      window.removeEventListener('pagehide', flush)
      flush()
    }
  }, [])

  function changePreparation(updater: (current: SessionPlanPreparationDraft) => SessionPlanPreparationDraft) {
    preparationVersion.current += 1
    setPreparation((current) => {
      const next = updater(current)
      preparationRef.current = next
      return next
    })
    preparationDirtyRef.current = true
    setPreparationDirty(true)
  }

  function markPreparationReady() {
    if (preparationAutosaveTimer.current !== null) {
      window.clearTimeout(preparationAutosaveTimer.current)
      preparationAutosaveTimer.current = null
    }
    void savePreparation('ready', true)
  }

  function publishOutcome() {
    if (outcomeAutosaveTimer.current !== null) {
      window.clearTimeout(outcomeAutosaveTimer.current)
      outcomeAutosaveTimer.current = null
    }
    void saveOutcome(true)
  }

  async function updateNextMove(moveId: string, completed: boolean) {
    setUpdatingMoveId(moveId)
    setActionError('')
    try {
      const response = await fetch(`/api/bookings/${bookingId}/session-plan/next-moves/${moveId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Handlingen kunne ikke opdateres.')
      setData((current) => current?.outcome ? {
        ...current,
        outcome: {
          ...current.outcome,
          next_moves: current.outcome.next_moves.map((move) => move.id === moveId ? result.nextMove : move),
        },
      } : current)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Handlingen kunne ikke opdateres.')
    } finally {
      setUpdatingMoveId(null)
    }
  }

  async function updateBooking(action: BookingAction) {
    if (action === 'cancel' && !confirmDecline) {
      setConfirmDecline(true)
      setActionSuccess('')
      return
    }

    setBookingActionLoading(action)
    setActionError('')
    setActionSuccess('')
    try {
      if (privateNoteDirtyRef.current) {
        const noteSaved = await savePrivateNote()
        if (!noteSaved) return
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || 'Bookingen kunne ikke opdateres.')

      const status = result.status as string
      setData((current) => current ? {
        ...current,
        booking: { ...current.booking, status },
        permissions: {
          ...current.permissions,
          canEditPreparation: false,
          canEditPrivateNote: current.viewerRole === 'professional'
            && ACTIVE_BOOKING_STATUSES.includes(status)
            && new Date(current.booking.ends_at).getTime() > Date.now(),
          canEditOutcome: current.viewerRole === 'professional'
            && status === 'completed'
            && current.outcome?.result_status !== 'published',
        },
      } : current)
      setActionSuccess(
        action === 'confirm'
          ? 'Bookingen er bekræftet.'
          : action === 'complete'
            ? 'Sessionen er markeret som gennemført. Du kan nu dokumentere resultatet nedenfor.'
            : 'Bookinganmodningen er afvist.',
      )
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Bookingen kunne ikke opdateres.')
    } finally {
      setBookingActionLoading(null)
      setConfirmDecline(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8" aria-busy="true">
        <div className="animate-pulse space-y-5">
          <div className="h-4 w-36 rounded bg-gray-200" />
          <div className="h-12 w-3/4 rounded bg-gray-200" />
          <div className="h-56 rounded bg-white" />
        </div>
        <p className="sr-only">Indlæser Session Plan…</p>
      </div>
    )
  }

  if (loadError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:px-8">
        <h1 className="text-3xl font-black text-gray-950">Session Plan kunne ikke åbnes.</h1>
        <p role="alert" className="mt-4 text-sm text-gray-600">{loadError || 'Bookingen blev ikke fundet.'}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={() => void load()} className="button-primary inline-flex items-center gap-2">
            <RotateCw size={15} aria-hidden="true" /> Prøv igen
          </button>
          <Link href="/profil/bookings" className="button-secondary">Tilbage til bookinger</Link>
        </div>
      </div>
    )
  }

  const isCandidate = data.viewerRole === 'candidate'
  const sessionLabel = data.booking.session_type && isSessionTypeId(data.booking.session_type)
    ? sessionType(data.booking.session_type).title.da
    : 'Karrieresession'
  const preparationReadOnly = !data.permissions.canEditPreparation
  const outcomePublished = data.outcome?.result_status === 'published'

  return (
    <>
      <MemberNav isProfessional={!isCandidate} />
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 md:py-12">
      <Link href="/profil/bookings" className="inline-flex items-center gap-2 text-sm font-black text-gray-600 hover:text-gray-950">
        <ArrowLeft size={15} aria-hidden="true" /> Alle bookinger
      </Link>

      <header className="mt-7 border-y border-gray-300 bg-white px-5 py-6 md:px-8 md:py-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-400">Naetwork Session Plan</p>
            <h1 className="mt-3 text-3xl font-black leading-tight text-gray-950 md:text-5xl">{sessionLabel}</h1>
            <p className="mt-3 text-sm font-bold text-gray-700">{data.booking.counterpart_name} · {data.booking.counterpart_title}</p>
            <p className="mt-2 text-sm text-gray-500">{formatDateTime(data.booking.starts_at)} · 60 minutter</p>
          </div>
          <StatusBadge status={data.booking.status} />
        </div>
        <div className="mt-6 grid gap-px overflow-hidden rounded-[4px] bg-gray-200 sm:grid-cols-3">
          {[
            ['01 · Reflektér', 'Definér problemet og det ønskede resultat.'],
            ['02 · Gennemgå', 'Brug planen som fælles struktur i sessionen.'],
            ['03 · Handl', 'Få anbefaling og næste træk dokumenteret.'],
          ].map(([title, copy]) => (
            <div key={title} className="bg-[#f7f7f4] px-4 py-4">
              <p className="text-xs font-black text-gray-950">{title}</p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">{copy}</p>
            </div>
          ))}
        </div>
      </header>

      {actionError && <p role="alert" className="notice-error mt-6">{actionError}</p>}
      {actionSuccess && <p role="status" className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">{actionSuccess}</p>}

      <BookingPracticalInfo booking={data.booking} />

      {!isCandidate && (
        <ProfessionalBookingActions
          booking={data.booking}
          loadingAction={bookingActionLoading}
          confirmDecline={confirmDecline}
          onAction={(action) => void updateBooking(action)}
          onCancelDecline={() => setConfirmDecline(false)}
        />
      )}

      <section className="mt-10" aria-labelledby="preparation-title">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-400">Før sessionen</p>
            <h2 id="preparation-title" className="mt-2 text-2xl font-black text-gray-950 md:text-3xl">
              {isCandidate ? 'Gør de 60 minutter konkrete.' : 'Forstå situationen før mødet.'}
            </h2>
          </div>
          {isCandidate && (
            <div className="min-w-44">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                <span>{progress.complete} af {progress.total} kernefelter</span>
                <span>{progress.percent}%</span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200"
                role="progressbar"
                aria-label="Forberedelse gennemført"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress.percent}
              >
                <div className="h-full bg-gray-950 transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
          )}
        </div>

        {isCandidate ? (
          <>
        {preparationReadOnly && (
          <p className="mt-5 flex items-center gap-2 border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <Clock3 size={16} aria-hidden="true" /> Forberedelsen er låst, fordi sessionen er startet eller bookingen ikke længere er aktiv.
          </p>
        )}

        <div className="mt-6 grid gap-5 border-y border-gray-300 bg-white px-5 py-6 md:grid-cols-2 md:px-8">
          <PlanField
            label="Hvad vil du have hjælp til?"
            help="Beskriv den konkrete udfordring, beslutning eller situation."
            value={preparation.problem}
            maxLength={SESSION_PLAN_LIMITS.problem}
            required
            readOnly={preparationReadOnly || !isCandidate}
            onChange={(value) => {
              changePreparation((current) => ({ ...current, problem: value }))
            }}
          />
          <PlanField
            label="Hvad er vigtigt at kende?"
            help="Relevant baggrund, erfaring, begrænsninger eller det, du allerede har prøvet."
            value={preparation.context}
            maxLength={SESSION_PLAN_LIMITS.context}
            readOnly={preparationReadOnly || !isCandidate}
            onChange={(value) => {
              changePreparation((current) => ({ ...current, context: value }))
            }}
          />
          <PlanField
            label="Hvad vil du stå med bagefter?"
            help="Hvad vil du forstå, beslutte, forbedre eller kunne gøre?"
            value={preparation.desiredOutcome}
            maxLength={SESSION_PLAN_LIMITS.desiredOutcome}
            required
            readOnly={preparationReadOnly || !isCandidate}
            onChange={(value) => {
              changePreparation((current) => ({ ...current, desiredOutcome: value }))
            }}
          />
          <PlanField
            label="Hvornår har sessionen været værdifuld?"
            help="Skriv det konkrete tegn på, at målet er nået."
            value={preparation.definitionOfDone}
            maxLength={SESSION_PLAN_LIMITS.definitionOfDone}
            required
            readOnly={preparationReadOnly || !isCandidate}
            onChange={(value) => {
              changePreparation((current) => ({ ...current, definitionOfDone: value }))
            }}
          />

          <div className="md:col-span-2">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="form-label">Dine vigtigste spørgsmål</p>
                <p className="form-help mt-1">Tilføj kun de spørgsmål, der skal prioriteres i sessionen.</p>
              </div>
              {isCandidate && !preparationReadOnly && preparation.keyQuestions.length < SESSION_PLAN_LIMITS.keyQuestions && (
                <button
                  type="button"
                  onClick={() => {
                    changePreparation((current) => ({ ...current, keyQuestions: [...current.keyQuestions, ''] }))
                  }}
                  className="inline-flex min-h-11 items-center text-xs font-black text-gray-950 underline decoration-gray-300 underline-offset-4"
                >
                  Tilføj spørgsmål
                </button>
              )}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {preparation.keyQuestions.map((question, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-3 text-xs font-black text-gray-400">{index + 1}</span>
                  <input
                    aria-label={`Vigtigt spørgsmål ${index + 1}`}
                    value={question}
                    readOnly={preparationReadOnly || !isCandidate}
                    maxLength={SESSION_PLAN_LIMITS.keyQuestion}
                    onChange={(event) => {
                      changePreparation((current) => {
                        const questions = [...current.keyQuestions]
                        questions[index] = event.target.value
                        return { ...current, keyQuestions: questions }
                      })
                    }}
                    className="field-control text-sm read-only:bg-gray-50 read-only:text-gray-600"
                    placeholder={isCandidate ? 'Fx Hvilke dele af min profil svækker mit match?' : 'Intet spørgsmål tilføjet'}
                  />
                  {isCandidate && !preparationReadOnly && preparation.keyQuestions.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Fjern spørgsmål ${index + 1}`}
                      onClick={() => {
                        changePreparation((current) => ({
                          ...current,
                          keyQuestions: current.keyQuestions.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }}
                      className="inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-gray-950"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <PlanField
            label="Er der andet, den professionelle bør vide?"
            help="Valgfrit. Brug feltet til særlige hensyn eller materiale, der kræver kontekst."
            value={preparation.anythingElse}
            maxLength={SESSION_PLAN_LIMITS.anythingElse}
            readOnly={preparationReadOnly || !isCandidate}
            className="md:col-span-2"
            onChange={(value) => {
              changePreparation((current) => ({ ...current, anythingElse: value }))
            }}
          />

          {data.booking.material_url && (
            <p className="md:col-span-2 text-sm text-gray-600">
              Delt materiale:{' '}
              <a href={data.booking.material_url} target="_blank" rel="noreferrer" className="font-black text-gray-950 underline decoration-gray-300 underline-offset-4">
                Åbn link
              </a>
            </p>
          )}
        </div>

        {data.permissions.canEditPreparation && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className={`inline-flex items-center gap-2 text-xs font-bold ${preparationSaveState === 'error' ? 'text-red-700' : 'text-gray-500'}`} aria-live="polite">
              {preparationSaveState === 'saved' ? <Check size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
              {saveLabel(preparationSaveState)}
            </p>
            <button
              type="button"
              disabled={!progress.ready || preparationSaveState === 'saving'}
              onClick={markPreparationReady}
              className="button-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              {data.preparation.preparation_status === 'ready' ? 'Gem opdateret forberedelse' : 'Markér forberedelsen som klar'}
            </button>
          </div>
        )}
          </>
        ) : (
          <ProfessionalPreparationBrief
            preparation={preparation}
            status={data.preparation.preparation_status}
          />
        )}
      </section>

      {!isCandidate && (
        <section className="mt-10" aria-labelledby="private-note-title">
          <div className="flex items-center gap-2">
            <LockKeyhole size={16} className="text-gray-500" aria-hidden="true" />
            <h2 id="private-note-title" className="text-lg font-black text-gray-950">Din private forberedelsesnote</h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">Kun du kan se noten. Brug den til få stikord før sessionen; den deles aldrig med kandidaten.</p>
          <textarea
            aria-label="Privat forberedelsesnote"
            value={privateNote}
            maxLength={SESSION_PLAN_LIMITS.privateNote}
            readOnly={!data.permissions.canEditPrivateNote}
            onChange={(event) => {
              const next = event.target.value
              privateNoteVersion.current += 1
              privateNoteRef.current = next
              setPrivateNote(next)
              privateNoteDirtyRef.current = true
              setNoteDirty(true)
            }}
            rows={4}
            className="field-control mt-4 resize-y bg-white text-sm read-only:bg-gray-50 read-only:text-gray-600"
            placeholder="Fx spørgsmål, der bør afklares først…"
          />
          <p className={`mt-2 text-xs font-bold ${noteSaveState === 'error' ? 'text-red-700' : 'text-gray-500'}`} aria-live="polite">
            {data.permissions.canEditPrivateNote
              ? saveLabel(noteSaveState)
              : 'Noten er låst, fordi sessionen er afsluttet eller bookingen ikke længere er aktiv.'}
          </p>
        </section>
      )}

      <section className="mt-12 border-t border-gray-300 pt-10" aria-labelledby="result-title">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-gray-400">Efter sessionen</p>
          <h2 id="result-title" className="mt-2 text-2xl font-black text-gray-950 md:text-3xl">
            {outcomePublished
              ? 'Det dokumenterede resultat.'
              : isCandidate
                ? 'Din dokumenterede vej videre.'
                : 'Dokumentér det, kandidaten skal handle på.'}
          </h2>
        </div>

        {outcomePublished && data.outcome ? (
          <CandidateResult
            data={data}
            viewerRole={data.viewerRole}
            updatingMoveId={updatingMoveId}
            onUpdateMove={(moveId, completed) => void updateNextMove(moveId, completed)}
          />
        ) : isCandidate ? (
            <div className="mt-6 border-y border-gray-300 bg-white px-5 py-8 md:px-8">
              <FileText size={22} className="text-gray-300" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-black text-gray-950">Resultatet er ikke publiceret endnu.</h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">Efter den gennemførte session samler den professionelle de vigtigste indsigter, anbefalingen og højst tre næste træk her.</p>
            </div>
        ) : data.permissions.canEditOutcome ? (
          <ProfessionalOutcomeEditor
            value={outcome}
            saveState={outcomeSaveState}
            publishing={publishing}
            onChange={(next) => {
              if (publishing) return
              outcomeVersion.current += 1
              outcomeRef.current = next
              setOutcome(next)
              outcomeDirtyRef.current = true
              setOutcomeDirty(true)
            }}
            onPublish={publishOutcome}
          />
        ) : (
          <div className="mt-6 border-y border-gray-300 bg-white px-5 py-8 md:px-8">
            <Clock3 size={22} className="text-gray-300" aria-hidden="true" />
            <h3 className="mt-4 text-xl font-black text-gray-950">
              {data.booking.status === 'completed' ? 'Resultatet er låst.' : 'Resultatet åbner efter sessionen.'}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-500">
              Markér først sessionen som gennemført i bookinghandlingen ovenfor. Derefter kan du færdiggøre planen.
            </p>
          </div>
        )}
      </section>
      </main>
    </>
  )
}

function BookingPracticalInfo({ booking }: { booking: SessionPlanResponse['booking'] }) {
  const meetingModeLabel = booking.meeting_mode === 'phone'
    ? 'Telefon'
    : booking.meeting_mode === 'in_person'
      ? 'Fysisk møde'
      : 'Video'
  const canOpenMeeting = Boolean(
    booking.meeting_url
    && ['confirmed', 'rescheduled'].includes(booking.status),
  )

  return (
    <section className="mt-6 border-y border-gray-300 bg-white px-5 py-5 md:px-8" aria-labelledby="practical-title">
      <div className="flex items-center gap-2">
        <CalendarDays size={17} className="text-gray-500" aria-hidden="true" />
        <h2 id="practical-title" className="text-sm font-black text-gray-950">Praktisk om sessionen</h2>
      </div>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-[4px] bg-gray-200 sm:grid-cols-3">
        <div className="bg-[#f7f7f4] px-4 py-4">
          <dt className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">Tidspunkt</dt>
          <dd className="mt-2 text-sm font-semibold leading-relaxed text-gray-800">{formatDateTime(booking.starts_at)}</dd>
        </div>
        <div className="bg-[#f7f7f4] px-4 py-4">
          <dt className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">Format</dt>
          <dd className="mt-2 text-sm font-semibold text-gray-800">{meetingModeLabel} · 60 minutter</dd>
        </div>
        <div className="bg-[#f7f7f4] px-4 py-4">
          <dt className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">Tidszone</dt>
          <dd className="mt-2 text-sm font-semibold text-gray-800">{booking.time_zone}</dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {canOpenMeeting ? (
          <a
            href={booking.meeting_url ?? undefined}
            target="_blank"
            rel="noreferrer"
            className="button-primary inline-flex min-h-11 items-center gap-2"
          >
            Åbn mødelink <ExternalLink size={14} aria-hidden="true" />
          </a>
        ) : (
          <p className="inline-flex min-h-11 items-center rounded-[4px] border border-gray-200 bg-gray-50 px-4 text-xs font-semibold text-gray-500">
            {booking.meeting_mode === 'video' && ['confirmed', 'rescheduled'].includes(booking.status)
              ? 'Mødelinket er ikke tilføjet endnu.'
              : `Sessionen gennemføres som ${meetingModeLabel.toLowerCase()}.`}
          </p>
        )}
        {booking.material_url && (
          <a
            href={booking.material_url}
            target="_blank"
            rel="noreferrer"
            className="button-secondary inline-flex min-h-11 items-center gap-2"
          >
            Åbn delt materiale <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
      {booking.goal && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.08em] text-gray-400">Mål angivet ved booking</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">{booking.goal}</p>
        </div>
      )}
    </section>
  )
}

function ProfessionalBookingActions({
  booking,
  loadingAction,
  confirmDecline,
  onAction,
  onCancelDecline,
}: {
  booking: SessionPlanResponse['booking']
  loadingAction: BookingAction | null
  confirmDecline: boolean
  onAction: (action: BookingAction) => void
  onCancelDecline: () => void
}) {
  const canRespond = ['requested', 'pending'].includes(booking.status)
  const canComplete = ['confirmed', 'rescheduled'].includes(booking.status)
    && new Date(booking.ends_at).getTime() <= Date.now()
  if (!canRespond && !canComplete) return null

  return (
    <section className="mt-6 border border-gray-300 bg-gray-950 px-5 py-5 text-white md:px-8" aria-labelledby="booking-action-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Bookinghandling</p>
          <h2 id="booking-action-title" className="mt-2 text-lg font-black">
            {canRespond ? 'Svar på kandidatens anmodning.' : 'Afslut sessionen, når mødet er gennemført.'}
          </h2>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-gray-300">
            {canRespond
              ? 'Tidspunktet er først bekræftet, når du accepterer det.'
              : 'Når du markerer sessionen som gennemført, åbner resultatdelen med det samme.'}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {canRespond && !confirmDecline && (
            <>
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => onAction('confirm')}
                className="inline-flex min-h-11 items-center rounded-[4px] bg-white px-4 text-sm font-black text-gray-950 disabled:opacity-50"
              >
                {loadingAction === 'confirm' ? 'Bekræfter…' : 'Bekræft tidspunkt'}
              </button>
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => onAction('cancel')}
                className="inline-flex min-h-11 items-center rounded-[4px] border border-gray-600 px-4 text-sm font-black text-white transition-colors hover:border-gray-300 disabled:opacity-50"
              >
                Afvis
              </button>
            </>
          )}
          {canRespond && confirmDecline && (
            <>
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={() => onAction('cancel')}
                className="inline-flex min-h-11 items-center rounded-[4px] bg-red-600 px-4 text-sm font-black text-white disabled:opacity-50"
              >
                {loadingAction === 'cancel' ? 'Afviser…' : 'Ja, afvis anmodningen'}
              </button>
              <button
                type="button"
                disabled={loadingAction !== null}
                onClick={onCancelDecline}
                className="inline-flex min-h-11 items-center rounded-[4px] border border-gray-600 px-4 text-sm font-black text-white disabled:opacity-50"
              >
                Behold anmodningen
              </button>
            </>
          )}
          {canComplete && (
            <button
              type="button"
              disabled={loadingAction !== null}
              onClick={() => onAction('complete')}
              className="inline-flex min-h-11 items-center gap-2 rounded-[4px] bg-white px-4 text-sm font-black text-gray-950 disabled:opacity-50"
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              {loadingAction === 'complete' ? 'Gemmer…' : 'Markér sessionen gennemført'}
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function ProfessionalPreparationBrief({
  preparation,
  status,
}: {
  preparation: SessionPlanPreparationDraft
  status: 'draft' | 'ready'
}) {
  const questions = preparation.keyQuestions.filter((question) => question.trim())
  const hasCandidateInput = Boolean(
    preparation.problem.trim()
    || preparation.context.trim()
    || preparation.desiredOutcome.trim()
    || preparation.definitionOfDone.trim()
    || questions.length
    || preparation.anythingElse.trim(),
  )

  return (
    <div className="mt-6 overflow-hidden border-y border-gray-300 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 md:px-8">
        <div>
          <p className="text-xs font-black text-gray-950">Kandidatens Session Plan</p>
          <p className="mt-1 text-xs text-gray-500">Læs problemet, succeskriteriet og spørgsmålene som ét kort brief.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${status === 'ready' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
          {status === 'ready' ? 'Klar til sessionen' : 'Forberedelse i gang'}
        </span>
      </div>

      {!hasCandidateInput ? (
        <div className="px-5 py-8 md:px-8">
          <FileText size={20} className="text-gray-300" aria-hidden="true" />
          <p className="mt-3 text-sm font-black text-gray-950">Kandidaten har ikke udfyldt forberedelsen endnu.</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">Bookingen og det oprindelige mål er stadig tilgængeligt i de praktiske oplysninger ovenfor.</p>
        </div>
      ) : (
        <>
          <dl className="grid gap-px bg-gray-200 md:grid-cols-2">
            <BriefItem label="Problem" value={preparation.problem} prominent />
            <BriefItem label="Ønsket resultat" value={preparation.desiredOutcome} prominent />
            <BriefItem label="Definition of Done" value={preparation.definitionOfDone} />
            <BriefItem label="Relevant kontekst" value={preparation.context} />
          </dl>
          {(questions.length > 0 || preparation.anythingElse) && (
            <div className="grid gap-6 border-t border-gray-200 px-5 py-6 md:grid-cols-2 md:px-8">
              {questions.length > 0 && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Vigtigste spørgsmål</p>
                  <ol className="mt-3 space-y-2">
                    {questions.map((question, index) => (
                      <li key={`${index}-${question}`} className="flex gap-3 text-sm leading-relaxed text-gray-700">
                        <span className="font-black text-gray-400">{index + 1}</span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {preparation.anythingElse && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Særlige forhold</p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-700">{preparation.anythingElse}</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function BriefItem({
  label,
  value,
  prominent = false,
}: {
  label: string
  value: string
  prominent?: boolean
}) {
  return (
    <div className="bg-white px-5 py-5 md:px-8">
      <dt className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{label}</dt>
      <dd className={`mt-2 leading-relaxed ${value ? 'text-gray-800' : 'text-gray-400'} ${prominent ? 'text-base font-semibold' : 'text-sm'}`}>
        {value || 'Ikke udfyldt endnu.'}
      </dd>
    </div>
  )
}

function PlanField({
  label,
  help,
  value,
  maxLength,
  required = false,
  readOnly,
  className = '',
  onChange,
}: {
  label: string
  help: string
  value: string
  maxLength: number
  required?: boolean
  readOnly: boolean
  className?: string
  onChange: (value: string) => void
}) {
  return (
    <label className={`block ${className}`}>
      <span className="form-label">{label}{required && <span className="text-gray-400"> *</span>}</span>
      <span className="form-help mt-1 block">{help}</span>
      <textarea
        value={value}
        readOnly={readOnly}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="field-control mt-3 resize-y text-sm read-only:bg-gray-50 read-only:text-gray-600"
      />
      {!readOnly && <span className="mt-1 block text-right text-[10px] text-gray-400">{value.length}/{maxLength}</span>}
    </label>
  )
}

function CandidateResult({
  data,
  viewerRole,
  updatingMoveId,
  onUpdateMove,
}: {
  data: SessionPlanResponse
  viewerRole: SessionPlanResponse['viewerRole']
  updatingMoveId: string | null
  onUpdateMove: (moveId: string, completed: boolean) => void
}) {
  const outcome = data.outcome
  if (!outcome) return null
  const statusLabel = outcome.definition_of_done_status === 'achieved'
    ? 'Opnået'
    : outcome.definition_of_done_status === 'partially_achieved'
      ? 'Delvist opnået'
      : outcome.definition_of_done_status === 'not_achieved_yet'
        ? 'Ikke opnået endnu'
        : outcome.result_schema_version === 1
          ? 'Ikke vurderet i den oprindelige leverance'
          : 'Ikke vurderet'
  const primaryCandidateMove = viewerRole === 'candidate'
    ? outcome.next_moves.find((move) => (
        move.status === 'pending'
        && (move.responsible === 'candidate' || move.responsible === 'shared')
      )) ?? null
    : null
  const pendingProfessionalMove = viewerRole === 'candidate'
    ? outcome.next_moves.find((move) => move.status === 'pending' && move.responsible === 'professional') ?? null
    : null
  const allMovesCompleted = outcome.next_moves.length > 0
    && outcome.next_moves.every((move) => move.status === 'completed')
  const openQuestion = outcome.open_questions.find((question) => question.trim()) ?? null
  const followUpReason = allMovesCompleted
    ? openQuestion
      ? `Afklar det åbne spørgsmål: ${openQuestion}`
      : outcome.definition_of_done_status === 'partially_achieved'
        ? 'Vurdér, om de gennemførte ændringer har bragt dig helt i mål.'
        : outcome.definition_of_done_status === 'not_achieved_yet'
          ? 'Følg op på det oprindelige mål efter de første gennemførte handlinger.'
          : null
    : null
  const highlightedMove = primaryCandidateMove ?? pendingProfessionalMove
  const displayedMoves = highlightedMove
    ? outcome.next_moves.filter((move) => move.id !== highlightedMove.id)
    : outcome.next_moves

  return (
    <div className="mt-6 overflow-hidden border-y border-gray-300 bg-white">
      {viewerRole === 'candidate' && primaryCandidateMove && (
        <section className="bg-gray-950 px-5 py-7 text-white md:px-8" aria-labelledby="primary-next-move-title">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">Dit vigtigste næste træk</p>
              <h3 id="primary-next-move-title" className="mt-3 max-w-3xl text-xl font-black leading-tight md:text-2xl">{primaryCandidateMove.action}</h3>
              <p className="mt-3 text-xs text-white/55">
                {primaryCandidateMove.responsible === 'shared' ? 'Fælles ansvar' : 'Dit ansvar'}
                {primaryCandidateMove.due_at ? ` · senest ${formatShortDate(primaryCandidateMove.due_at)}` : ''}
              </p>
            </div>
            <button
              type="button"
              disabled={updatingMoveId !== null}
              onClick={() => onUpdateMove(primaryCandidateMove.id, true)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100 disabled:opacity-50"
            >
              <CheckCircle2 size={16} aria-hidden="true" />
              {updatingMoveId === primaryCandidateMove.id ? 'Gemmer…' : 'Markér som udført'}
            </button>
          </div>
        </section>
      )}

      {viewerRole === 'candidate' && !primaryCandidateMove && pendingProfessionalMove && (
        <section className="border-b border-gray-300 bg-[#f7f7f4] px-5 py-5 md:px-8" aria-labelledby="professional-next-move-title">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-gray-400">Næste i forløbet</p>
          <h3 id="professional-next-move-title" className="mt-2 text-lg font-black text-gray-950">Den professionelle følger op.</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{pendingProfessionalMove.action}</p>
        </section>
      )}

      {viewerRole === 'candidate'
        && !primaryCandidateMove
        && !pendingProfessionalMove
        && followUpReason
        && data.booking.rebook_professional_profile_id && (
          <section className="border-b border-gray-300 bg-gray-950 px-5 py-6 text-white md:px-8" aria-labelledby="contextual-rebooking-title">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.12em] text-white/45">Når næste fase kræver et nyt mål</p>
                <h3 id="contextual-rebooking-title" className="mt-2 text-xl font-black">En opfølgning skal løse noget konkret.</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/65">{followUpReason}</p>
              </div>
              <Link
                href={`/professionals/${data.booking.rebook_professional_profile_id}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3 text-sm font-black text-gray-950 transition-colors hover:bg-gray-100"
              >
                Åbn profilen for en målrettet opfølgning <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </section>
      )}

      <div className="grid gap-8 px-5 py-7 md:grid-cols-[1fr_240px] md:px-8">
        <div>
          <ResultBlock title="Dit oprindelige problem" content={data.preparation.problem} />
          <ResultBlock title="Det ønskede resultat" content={data.preparation.desired_outcome} />
          <ResultBlock title="De vigtigste indsigter" content={outcome.summary} emphasized />
          <ResultBlock title="Den professionelles anbefaling" content={outcome.recommendation} emphasized />
          {outcome.decisions.length > 0 && (
            <div className="mt-7">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Beslutninger</p>
              <ul className="mt-3 space-y-2">
                {outcome.decisions.map((decision, index) => <li key={index} className="flex gap-2 text-sm text-gray-700"><Check size={15} className="mt-0.5 shrink-0" aria-hidden="true" /> {decision}</li>)}
              </ul>
            </div>
          )}
        </div>
        <aside className="border-t border-gray-200 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Definition of Done</p>
          <p className="mt-2 inline-flex items-center gap-2 text-sm font-black text-gray-950">
            <Target size={16} aria-hidden="true" /> {statusLabel}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-gray-500">{data.preparation.definition_of_done}</p>
        </aside>
      </div>

      {displayedMoves.length > 0 && (
        <div className="border-t border-gray-300 bg-[#f7f7f4] px-5 py-7 md:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
            {viewerRole === 'candidate'
              ? highlightedMove
                ? 'Resten af din handlingsplan'
                : 'Dine prioriterede næste træk'
              : 'Prioriterede næste træk'}
          </p>
          <div className="mt-4 grid gap-3">
            {displayedMoves.map((move) => {
              const completed = move.status === 'completed'
              const canUpdate = move.responsible === 'shared'
                || move.responsible === viewerRole
              const otherOwnerLabel = viewerRole === 'candidate'
                ? 'Den professionelle følger op'
                : 'Kandidaten følger op'
              return (
                <div key={move.id} className={`grid gap-3 border px-4 py-4 sm:grid-cols-[32px_1fr_auto] sm:items-center ${completed ? 'border-emerald-200 bg-emerald-50' : 'border-gray-300 bg-white'}`}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-xs font-black text-white">{move.position}</span>
                  <div>
                    <p className={`text-sm font-black text-gray-950 ${completed ? 'line-through opacity-60' : ''}`}>{move.action}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {move.responsible === 'candidate'
                        ? viewerRole === 'candidate' ? 'Dit ansvar' : 'Kandidatens ansvar'
                        : move.responsible === 'shared'
                          ? 'Fælles ansvar'
                          : viewerRole === 'professional' ? 'Dit ansvar' : 'Den professionelles ansvar'}
                      {move.due_at ? ` · senest ${formatShortDate(move.due_at)}` : ''}
                    </p>
                  </div>
                  {!canUpdate ? (
                    <span className="inline-flex min-h-10 items-center justify-center rounded-[4px] border border-gray-300 bg-gray-50 px-3 text-center text-xs font-black text-gray-500">
                      {otherOwnerLabel}
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingMoveId !== null}
                      onClick={() => onUpdateMove(move.id, !completed)}
                      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-[4px] px-3 text-xs font-black disabled:opacity-50 ${completed ? 'border border-emerald-300 bg-white text-emerald-800' : 'bg-gray-950 text-white'}`}
                    >
                      {completed ? <CheckCircle2 size={15} aria-hidden="true" /> : <Circle size={15} aria-hidden="true" />}
                      {updatingMoveId === move.id ? 'Gemmer…' : completed ? 'Udført' : 'Markér udført'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {outcome.open_questions.length > 0 && (
        <div className="border-t border-gray-300 px-5 py-6 md:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">Fortsat åbne spørgsmål</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {outcome.open_questions.map((question, index) => <li key={index} className="text-sm leading-relaxed text-gray-600">— {question}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

function ResultBlock({ title, content, emphasized = false }: { title: string; content: string; emphasized?: boolean }) {
  if (!content) return null
  return (
    <div className="mb-7 last:mb-0">
      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">{title}</p>
      <p className={`mt-2 leading-relaxed text-gray-700 ${emphasized ? 'text-base font-semibold' : 'text-sm'}`}>{content}</p>
    </div>
  )
}

function ProfessionalOutcomeEditor({
  value,
  saveState,
  publishing,
  onChange,
  onPublish,
}: {
  value: SessionPlanOutcomeDraft
  saveState: SaveState
  publishing: boolean
  onChange: (value: SessionPlanOutcomeDraft) => void
  onPublish: () => void
}) {
  function updateList(field: 'decisions' | 'openQuestions', index: number, nextValue: string) {
    const values = [...value[field]]
    values[index] = nextValue
    onChange({ ...value, [field]: values })
  }

  function addListItem(field: 'decisions' | 'openQuestions', limit: number) {
    if (value[field].length >= limit) return
    onChange({ ...value, [field]: [...value[field], ''] })
  }

  return (
    <div className="mt-6 border-y border-gray-300 bg-white px-5 py-7 md:px-8">
      <fieldset disabled={publishing} className="contents">
      <div className="grid gap-5 md:grid-cols-2">
        <PlanField
          label="Vigtigste indsigter"
          help="De centrale perspektiver, læringer eller observationer."
          value={value.keyInsights}
          maxLength={SESSION_PLAN_LIMITS.keyInsights}
          required
          readOnly={false}
          onChange={(keyInsights) => onChange({ ...value, keyInsights })}
        />
        <PlanField
          label="Din klare anbefaling"
          help="Hvad bør kandidaten prioritere nu — og hvorfor?"
          value={value.recommendation}
          maxLength={SESSION_PLAN_LIMITS.recommendation}
          required
          readOnly={false}
          onChange={(recommendation) => onChange({ ...value, recommendation })}
        />
      </div>

      <label className="mt-5 block">
        <span className="form-label">Status på Definition of Done *</span>
        <span className="form-help mt-1 block">Vurdér det konkrete succeskriterium, som kandidaten formulerede før sessionen.</span>
        <select
          value={value.definitionOfDoneStatus}
          onChange={(event) => onChange({ ...value, definitionOfDoneStatus: event.target.value as SessionPlanOutcomeDraft['definitionOfDoneStatus'] })}
          className="field-control mt-3 max-w-md text-sm"
        >
          <option value="">Vælg status</option>
          <option value="achieved">Opnået</option>
          <option value="partially_achieved">Delvist opnået</option>
          <option value="not_achieved_yet">Ikke opnået endnu</option>
        </select>
      </label>

      <ListEditor
        title="Beslutninger"
        help="Valgfrit. Notér kun beslutninger, der faktisk blev truffet."
        values={value.decisions}
        limit={SESSION_PLAN_LIMITS.decisions}
        maxLength={SESSION_PLAN_LIMITS.decision}
        placeholder="Fx Jeg prioriterer analyst-roller før graduate-programmer"
        onChange={(index, nextValue) => updateList('decisions', index, nextValue)}
        onAdd={() => addListItem('decisions', SESSION_PLAN_LIMITS.decisions)}
        onRemove={(index) => onChange({ ...value, decisions: value.decisions.filter((_, itemIndex) => itemIndex !== index) })}
      />

      <div className="mt-7">
        <div>
          <p className="form-label">Højst tre næste træk *</p>
          <p className="form-help mt-1">Sæt dem i den rækkefølge, de bør gennemføres. Første handling bliver kandidatens primære næste skridt.</p>
        </div>
        <div className="mt-4 grid gap-4">
          {value.nextMoves.map((move, index) => (
            <div key={move.id ?? index} className="grid gap-3 border border-gray-300 bg-[#f7f7f4] px-4 py-4 md:grid-cols-[32px_1fr_180px_160px_auto] md:items-end">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-950 text-xs font-black text-white">{index + 1}</span>
              <label className="block">
                <span className="form-label">Handling</span>
                <input
                  value={move.action}
                  maxLength={SESSION_PLAN_LIMITS.nextMove}
                  onChange={(event) => {
                    const nextMoves = [...value.nextMoves]
                    nextMoves[index] = { ...move, action: event.target.value }
                    onChange({ ...value, nextMoves })
                  }}
                  className="field-control mt-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="form-label">Ansvarlig</span>
                <select
                  value={move.responsible}
                  onChange={(event) => {
                    const nextMoves = [...value.nextMoves]
                    nextMoves[index] = { ...move, responsible: event.target.value as NextMoveResponsible }
                    onChange({ ...value, nextMoves })
                  }}
                  className="field-control mt-2 text-sm"
                >
                  <option value="candidate">Kandidaten</option>
                  <option value="shared">Fælles</option>
                  <option value="professional">Professionel</option>
                </select>
              </label>
              <label className="block">
                <span className="form-label">Deadline</span>
                <input
                  type="date"
                  value={move.dueAt}
                  onChange={(event) => {
                    const nextMoves = [...value.nextMoves]
                    nextMoves[index] = { ...move, dueAt: event.target.value }
                    onChange({ ...value, nextMoves })
                  }}
                  className="field-control mt-2 text-sm"
                />
              </label>
              {value.nextMoves.length > 1 && (
                <button
                  type="button"
                  aria-label={`Fjern næste træk ${index + 1}`}
                  onClick={() => onChange({ ...value, nextMoves: value.nextMoves.filter((_, itemIndex) => itemIndex !== index) })}
                  className="min-h-11 min-w-11 px-2 text-xs font-black text-gray-500 hover:text-gray-950"
                >
                  Fjern
                </button>
              )}
            </div>
          ))}
        </div>
        {value.nextMoves.length < SESSION_PLAN_LIMITS.nextMoves && (
          <button
            type="button"
            onClick={() => onChange({ ...value, nextMoves: [...value.nextMoves, { action: '', responsible: 'candidate', dueAt: '' }] })}
            className="mt-3 inline-flex min-h-11 items-center text-xs font-black text-gray-950 underline decoration-gray-300 underline-offset-4"
          >
            Tilføj næste træk
          </button>
        )}
      </div>

      <ListEditor
        title="Åbne spørgsmål"
        help="Valgfrit. Gem kun det, der fortsat kræver afklaring."
        values={value.openQuestions}
        limit={SESSION_PLAN_LIMITS.openQuestions}
        maxLength={SESSION_PLAN_LIMITS.openQuestion}
        placeholder="Fx Skal rollen målrettes København eller London?"
        onChange={(index, nextValue) => updateList('openQuestions', index, nextValue)}
        onAdd={() => addListItem('openQuestions', SESSION_PLAN_LIMITS.openQuestions)}
        onRemove={(index) => onChange({ ...value, openQuestions: value.openQuestions.filter((_, itemIndex) => itemIndex !== index) })}
      />

      <div className="mt-7 flex flex-col gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className={`inline-flex items-center gap-2 text-xs font-bold ${saveState === 'error' ? 'text-red-700' : 'text-gray-500'}`} aria-live="polite">
          {saveState === 'saved' ? <Check size={14} aria-hidden="true" /> : <Save size={14} aria-hidden="true" />}
          {saveLabel(saveState)}
        </p>
        <button type="button" onClick={onPublish} disabled={publishing || saveState === 'saving'} className="button-primary disabled:opacity-50">
          {publishing ? 'Publicerer…' : 'Publicér resultat til kandidaten'}
        </button>
      </div>
      </fieldset>
    </div>
  )
}

function ListEditor({
  title,
  help,
  values,
  limit,
  maxLength,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string
  help: string
  values: string[]
  limit: number
  maxLength: number
  placeholder: string
  onChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}) {
  return (
    <div className="mt-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="form-label">{title}</p>
          <p className="form-help mt-1">{help}</p>
        </div>
        {values.length < limit && (
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex min-h-11 items-center text-xs font-black text-gray-950 underline decoration-gray-300 underline-offset-4"
          >
            Tilføj
          </button>
        )}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {values.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <input
              aria-label={`${title} ${index + 1}`}
              value={item}
              maxLength={maxLength}
              onChange={(event) => onChange(index, event.target.value)}
              className="field-control text-sm"
              placeholder={placeholder}
            />
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                aria-label={`Fjern ${title.toLowerCase()} ${index + 1}`}
                className="inline-flex min-h-11 min-w-11 items-center justify-center text-gray-400 hover:text-gray-950"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
