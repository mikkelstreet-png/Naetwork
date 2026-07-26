export const SESSION_FEEDBACK_SCALE_MIN = 1
export const SESSION_FEEDBACK_SCALE_MAX = 5
export const SESSION_FEEDBACK_COMMENT_MAX_LENGTH = 1000

export const GOAL_ACHIEVEMENT_VALUES = [
  'achieved',
  'partially_achieved',
  'not_achieved',
] as const

export type GoalAchievement = (typeof GOAL_ACHIEVEMENT_VALUES)[number]

export interface SessionFeedbackPayload {
  bookingId: string
  goalAchieved: GoalAchievement
  professionalRelevance: number
  professionalPreparedness: number
  greaterClarity: number
  concreteNextSteps: number
  overallExperience: number
  comment: string | null
}

type ParseResult =
  | { data: SessionFeedbackPayload; error?: never }
  | { data?: never; error: string }

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function isFeedbackScore(value: unknown): value is number {
  return Number.isInteger(value)
    && Number(value) >= SESSION_FEEDBACK_SCALE_MIN
    && Number(value) <= SESSION_FEEDBACK_SCALE_MAX
}

export function parseSessionFeedback(input: unknown): ParseResult {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'Feedbacken er ugyldig.' }
  }

  const value = input as Record<string, unknown>
  const bookingId = typeof value.bookingId === 'string' ? value.bookingId.trim() : ''
  if (!UUID_PATTERN.test(bookingId)) {
    return { error: 'Bookingen er ugyldig.' }
  }

  if (
    typeof value.goalAchieved !== 'string'
    || !GOAL_ACHIEVEMENT_VALUES.includes(value.goalAchieved as GoalAchievement)
  ) {
    return { error: 'Vælg om sessionens mål blev opnået.' }
  }

  const scoreFields: Array<[keyof SessionFeedbackPayload, unknown]> = [
    ['professionalRelevance', value.professionalRelevance],
    ['professionalPreparedness', value.professionalPreparedness],
    ['greaterClarity', value.greaterClarity],
    ['concreteNextSteps', value.concreteNextSteps],
    ['overallExperience', value.overallExperience],
  ]
  if (scoreFields.some(([, score]) => !isFeedbackScore(score))) {
    return { error: 'Besvar alle feedbackspørgsmål på skalaen fra 1 til 5.' }
  }

  if (
    value.comment !== undefined
    && value.comment !== null
    && typeof value.comment !== 'string'
  ) {
    return { error: 'Kommentaren er ugyldig.' }
  }

  const comment = typeof value.comment === 'string' ? value.comment.trim() : ''
  if (comment.length > SESSION_FEEDBACK_COMMENT_MAX_LENGTH) {
    return {
      error: `Kommentaren må højst være ${SESSION_FEEDBACK_COMMENT_MAX_LENGTH} tegn.`,
    }
  }

  return {
    data: {
      bookingId,
      goalAchieved: value.goalAchieved as GoalAchievement,
      professionalRelevance: Number(value.professionalRelevance),
      professionalPreparedness: Number(value.professionalPreparedness),
      greaterClarity: Number(value.greaterClarity),
      concreteNextSteps: Number(value.concreteNextSteps),
      overallExperience: Number(value.overallExperience),
      comment: comment || null,
    },
  }
}
