// ─── PHASE SWITCH ────────────────────────────────────────────────────────────
// Flip PHASE to 'commercial' when the founding period ends.
// Every phase-conditional element in the UI reads this single value.
// Target switch date: 10. december 2026
// ─────────────────────────────────────────────────────────────────────────────

export type Phase = 'charity' | 'commercial'
export const PHASE: Phase = 'charity'

// End date of the charity / early-access period
export const CHARITY_END_DATE = new Date('2026-12-10')

// Early-access discount (shown in commercial phase)
export const FOUNDING_DISCOUNT = 40 // percent
