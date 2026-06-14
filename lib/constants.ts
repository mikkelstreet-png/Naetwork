export const AI_CATEGORIES = [
  'AI kundeservice',
  'AI salgsassistent',
  'Indholdsmotor',
  'Rapportautomatisering',
  'Intern AI-assistent',
  'Hjemmeside/MVP med AI',
  'AI til tilbud og forslag',
  'AI workflows til administration',
  'Marked- og konkurrentanalyse',
  'AI-opsætning for teamet',
] as const;

export type AiCategory = typeof AI_CATEGORIES[number];

export const BUDGET_OPTIONS = [
  'Under 15.000 kr',
  '15.000–50.000 kr',
  'Over 50.000 kr',
] as const;

export const TIMELINE_OPTIONS = [
  'Hurtigst muligt',
  '1–2 måneder',
  '2–4 måneder',
  'Fleksibelt',
] as const;

export const PROJECT_SIZE_OPTIONS = [
  'Under 15.000 kr',
  '15.000–50.000 kr',
  'Over 50.000 kr',
  'Varierer',
] as const;

export const AVAILABILITY_OPTIONS = [
  'Tilgængelig nu',
  'Tilgængelig inden for 2 uger',
  'Tilgængelig inden for en måned',
  'Ikke tilgængelig pt.',
] as const;
