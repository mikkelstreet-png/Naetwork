import { normalizeContributionPercent, normalizePrice } from './platform'

export interface PublicProfessionalRow {
  id: string
  name: string | null
  title: string | null
  company: string | null
  bio: string | null
  price_dkk: number | null
  contribution_percent: number | null
  industries: string[] | null
  focus_areas: string[] | null
  languages?: string[] | null
  seniority?: string | null
  years_experience?: number | null
  response_time_hours?: number | null
  next_available_at?: string | null
  review_count?: number | null
  average_rating?: number | string | null
}

export interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  focus_areas: string[]
  price: number
  contributionPercent: number
  bio: string
  languages: string[]
  seniority: string | null
  yearsExperience: number | null
  responseTimeHours: number
  nextAvailableAt: string | null
  reviewCount: number
  averageRating: number | null
}

export function mapPublicProfessionals(data: unknown): ProfessionalCard[] {
  if (!Array.isArray(data)) return []

  return (data as PublicProfessionalRow[]).map((profile) => ({
    id: profile.id,
    name: profile.name?.trim() ?? '',
    title: profile.title?.trim() ?? '',
    company: profile.company?.trim() ?? '',
    industries: profile.industries ?? [],
    focus_areas: profile.focus_areas ?? [],
    price: normalizePrice(profile.price_dkk),
    contributionPercent: normalizeContributionPercent(profile.contribution_percent),
    bio: profile.bio?.trim() ?? '',
    languages: profile.languages ?? ['da', 'en'],
    seniority: profile.seniority?.trim() || null,
    yearsExperience: typeof profile.years_experience === 'number' ? profile.years_experience : null,
    responseTimeHours: typeof profile.response_time_hours === 'number' ? profile.response_time_hours : 48,
    nextAvailableAt: profile.next_available_at ?? null,
    reviewCount: typeof profile.review_count === 'number' ? profile.review_count : Number(profile.review_count ?? 0),
    averageRating: profile.average_rating == null ? null : Number(profile.average_rating),
  })).filter((profile) => profile.id && profile.name)
}
