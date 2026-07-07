import { CONTRIBUTION_MIN, PRICE_MIN } from './platform'

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
    price: profile.price_dkk ?? PRICE_MIN,
    contributionPercent: profile.contribution_percent ?? CONTRIBUTION_MIN,
    bio: profile.bio?.trim() ?? '',
  })).filter((profile) => profile.id && profile.name)
}
