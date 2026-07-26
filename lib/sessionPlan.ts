export const SESSION_PLAN_LIMITS = {
  problem: 600,
  context: 1_000,
  desiredOutcome: 600,
  definitionOfDone: 500,
  keyQuestion: 300,
  keyQuestions: 5,
  anythingElse: 800,
  privateNote: 2_000,
  keyInsights: 1_000,
  recommendation: 1_000,
  decision: 300,
  decisions: 5,
  openQuestion: 300,
  openQuestions: 5,
  nextMove: 300,
  nextMoves: 3,
} as const

export const DEFINITION_OF_DONE_STATUSES = [
  'achieved',
  'partially_achieved',
  'not_achieved_yet',
] as const

export const NEXT_MOVE_RESPONSIBLES = ['candidate', 'professional', 'shared'] as const
export const NEXT_MOVE_STATUSES = ['pending', 'completed'] as const

export type DefinitionOfDoneStatus = typeof DEFINITION_OF_DONE_STATUSES[number]
export type NextMoveResponsible = typeof NEXT_MOVE_RESPONSIBLES[number]
export type NextMoveStatus = typeof NEXT_MOVE_STATUSES[number]
export type SessionPlanPreparationStatus = 'draft' | 'ready'
export type SessionPlanResultStatus = 'draft' | 'published'
export type SessionPlanViewerRole = 'candidate' | 'professional'

export interface SessionPlanPreparation {
  booking_id: string
  problem: string
  context: string
  desired_outcome: string
  definition_of_done: string
  key_questions: string[]
  anything_else: string
  preparation_status: SessionPlanPreparationStatus
  prepared_at: string | null
  updated_at: string
}

export interface SessionPlanNextMove {
  id: string
  position: number
  action: string
  responsible: NextMoveResponsible
  due_at: string | null
  status: NextMoveStatus
  completed_at: string | null
}

export interface SessionPlanOutcome {
  id: string
  summary: string
  recommendation: string
  decisions: string[]
  definition_of_done_status: DefinitionOfDoneStatus | null
  open_questions: string[]
  result_status: SessionPlanResultStatus
  result_schema_version: 1 | 2
  published_at: string | null
  updated_at: string
  next_moves: SessionPlanNextMove[]
}

export interface SessionPlanBookingContext {
  id: string
  rebook_professional_profile_id: string | null
  starts_at: string
  ends_at: string
  status: string
  session_type: string | null
  goal: string | null
  material_url: string | null
  time_zone: string
  meeting_mode: string
  meeting_url: string | null
  counterpart_name: string
  counterpart_title: string
}

export interface SessionPlanResponse {
  viewerRole: SessionPlanViewerRole
  booking: SessionPlanBookingContext
  preparation: SessionPlanPreparation
  privateNote?: string
  privateNoteUpdatedAt?: string | null
  outcome: SessionPlanOutcome | null
  permissions: {
    canEditPreparation: boolean
    canEditPrivateNote: boolean
    canEditOutcome: boolean
    canUpdateNextMoves: boolean
  }
}

export interface SessionPlanPreparationDraft {
  problem: string
  context: string
  desiredOutcome: string
  definitionOfDone: string
  keyQuestions: string[]
  anythingElse: string
}

export interface SessionPlanOutcomeDraft {
  keyInsights: string
  recommendation: string
  decisions: string[]
  definitionOfDoneStatus: DefinitionOfDoneStatus | ''
  openQuestions: string[]
  nextMoves: Array<{
    id?: string
    action: string
    responsible: NextMoveResponsible
    dueAt: string
  }>
}

export function isDefinitionOfDoneStatus(value: unknown): value is DefinitionOfDoneStatus {
  return typeof value === 'string' && DEFINITION_OF_DONE_STATUSES.includes(value as DefinitionOfDoneStatus)
}

export function isNextMoveResponsible(value: unknown): value is NextMoveResponsible {
  return typeof value === 'string' && NEXT_MOVE_RESPONSIBLES.includes(value as NextMoveResponsible)
}

export function preparationRequiredFields(draft: SessionPlanPreparationDraft) {
  return [
    { id: 'problem', complete: draft.problem.trim().length >= 10 },
    { id: 'desiredOutcome', complete: draft.desiredOutcome.trim().length >= 10 },
    { id: 'definitionOfDone', complete: draft.definitionOfDone.trim().length >= 10 },
  ] as const
}

export function preparationProgress(draft: SessionPlanPreparationDraft) {
  const fields = preparationRequiredFields(draft)
  const complete = fields.filter((field) => field.complete).length
  return {
    complete,
    total: fields.length,
    percent: Math.round((complete / fields.length) * 100),
    ready: complete === fields.length,
  }
}
