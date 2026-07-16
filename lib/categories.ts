export const CATEGORIES = [
  {
    id: 'Consulting',
    slug: 'consulting',
    accent: 'bg-blue-300',
    surface: 'bg-[#dfeafb]',
    description: {
      da: 'Strategi, transformation og eksekvering fra analyse til PMO.',
      en: 'Strategy, transformation and execution from analysis to PMO.',
    },
    areas: ['Management Consulting', 'Strategy', 'Transformation', 'Business Development', 'Operations', 'PMO'],
  },
  {
    id: 'Finance',
    slug: 'finance',
    accent: 'bg-emerald-300',
    surface: 'bg-[#dff4e7]',
    description: {
      da: 'Kapital, transaktioner, investeringer og finansielle virksomheder.',
      en: 'Capital, transactions, investments and financial institutions.',
    },
    areas: ['Investment Banking', 'Private Equity', 'Asset Management', 'Corporate Finance', 'Commercial Banking', 'Markets', 'Investments'],
  },
  {
    id: 'Legal',
    slug: 'legal',
    accent: 'bg-violet-300',
    surface: 'bg-[#eee6f8]',
    description: {
      da: 'Selskabsret, transaktioner, compliance, regulering og governance.',
      en: 'Corporate law, transactions, compliance, regulation and governance.',
    },
    areas: ['Corporate Law', 'M&A', 'Commercial Law', 'Compliance', 'Regulatory', 'Governance'],
  },
] as const

export type CategoryId = typeof CATEGORIES[number]['id']
export type CategorySlug = typeof CATEGORIES[number]['slug']
export type CategoryArea = typeof CATEGORIES[number]['areas'][number]

export const CATEGORY_IDS = CATEGORIES.map((category) => category.id) as readonly CategoryId[]
export const CATEGORY_AREAS = CATEGORIES.flatMap((category) => category.areas) as readonly CategoryArea[]

const LEGACY_AREA_MAP: Record<string, CategoryArea> = {
  AI: 'Transformation',
  Banking: 'Commercial Banking',
  Consulting: 'Management Consulting',
  Finance: 'Corporate Finance',
  Legal: 'Corporate Law',
  Law: 'Corporate Law',
  'Capital Markets': 'Markets',
  'Management Consulting': 'Management Consulting',
  'Private Equity': 'Private Equity',
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === 'string' && CATEGORY_IDS.includes(value as CategoryId)
}

export function isCategoryArea(value: unknown): value is CategoryArea {
  return typeof value === 'string' && CATEGORY_AREAS.includes(value as CategoryArea)
}

export function categoryById(id: CategoryId) {
  return CATEGORIES.find((category) => category.id === id)!
}

export function categoryForAreas(areas: readonly string[]) {
  return CATEGORIES.find((category) => areas.some((area) => (category.areas as readonly string[]).includes(area))) ?? null
}

export function categoryIdForValue(value: string | null | undefined): CategoryId | null {
  if (isCategoryId(value)) return value
  if (!value) return null
  const area = isCategoryArea(value) ? value : LEGACY_AREA_MAP[value]
  return area ? categoryForAreas([area])?.id ?? null : null
}

export function categoryAccent(value?: string) {
  const direct = CATEGORIES.find((category) => category.id === value)
  if (direct) return direct.accent
  return categoryForAreas(value ? [value] : [])?.accent ?? 'bg-gray-300'
}

export function areasBelongToCategory(categoryId: CategoryId, areas: readonly string[]) {
  const allowed = categoryById(categoryId).areas as readonly string[]
  return areas.length > 0 && areas.every((area) => allowed.includes(area))
}

export function normalizeCategoryAreas(values: readonly string[]) {
  const mapped = values
    .map((value) => isCategoryArea(value) ? value : LEGACY_AREA_MAP[value])
    .filter((value): value is CategoryArea => Boolean(value))
  const primary = categoryForAreas(mapped)
  if (!primary) return ['Business Development'] as CategoryArea[]

  return Array.from(new Set(mapped.filter((area) => (primary.areas as readonly string[]).includes(area))))
}
