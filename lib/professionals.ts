import { normalizePrice } from './platform'
import { normalizeCategoryAreas } from './categories'
import { normalizePayoutPreference, type PayoutPreference } from './payoutPreference'

export interface PublicProfessionalRow {
  id: string
  name: string | null
  title: string | null
  company: string | null
  bio: string | null
  price_dkk: number | null
  industries: string[] | null
  focus_areas: string[] | null
  languages?: string[] | null
  seniority?: string | null
  years_experience?: number | null
  response_time_hours?: number | null
  next_available_at?: string | null
  review_count?: number | null
  average_rating?: number | string | null
  payout_preference?: string | null
}

export interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  focus_areas: string[]
  price: number
  bio: string
  languages: string[]
  seniority: string | null
  yearsExperience: number | null
  responseTimeHours: number | null
  nextAvailableAt: string | null
  reviewCount: number
  averageRating: number | null
  payoutPreference: PayoutPreference
}

export function mapPublicProfessionals(data: unknown): ProfessionalCard[] {
  if (!Array.isArray(data)) return []

  return (data as PublicProfessionalRow[]).map((profile) => ({
    id: profile.id,
    name: profile.name?.trim() ?? '',
    title: profile.title?.trim() ?? '',
    company: profile.company?.trim() ?? '',
    industries: normalizeCategoryAreas(profile.industries ?? []),
    focus_areas: profile.focus_areas ?? [],
    price: normalizePrice(profile.price_dkk),
    bio: profile.bio?.trim() ?? '',
    languages: Array.isArray(profile.languages) ? profile.languages.filter(Boolean) : [],
    seniority: profile.seniority?.trim() || null,
    yearsExperience: typeof profile.years_experience === 'number' ? profile.years_experience : null,
    responseTimeHours: typeof profile.response_time_hours === 'number' ? profile.response_time_hours : null,
    nextAvailableAt: profile.next_available_at ?? null,
    reviewCount: typeof profile.review_count === 'number' ? profile.review_count : Number(profile.review_count ?? 0),
    averageRating: profile.average_rating == null || Number.isNaN(Number(profile.average_rating))
      ? null
      : Number(profile.average_rating),
    payoutPreference: normalizePayoutPreference(profile.payout_preference),
  })).filter((profile) => profile.id && profile.name)
}
