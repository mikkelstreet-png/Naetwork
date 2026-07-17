import 'server-only'

import { cache } from 'react'
import { mapPublicProfessionals, type ProfessionalCard } from '@/lib/professionals'
import { createClient } from '@/lib/supabase/server'

export interface PublicProfessionalResult {
  professional: ProfessionalCard | null
  error: boolean
}

export interface PublicProfessionalsResult {
  professionals: ProfessionalCard[]
  error: boolean
}

export const loadPublicProfessionals = cache(async (): Promise<PublicProfessionalsResult> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { professionals: [], error: true }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_professionals')
    if (error) return { professionals: [], error: true }
    return { professionals: mapPublicProfessionals(data), error: false }
  } catch {
    return { professionals: [], error: true }
  }
})

export const loadPublicProfessional = cache(async (id: string): Promise<PublicProfessionalResult> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { professional: null, error: true }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_professionals', { requested_id: id }).maybeSingle()
    if (error) return { professional: null, error: true }
    return { professional: mapPublicProfessionals(data ? [data] : [])[0] ?? null, error: false }
  } catch {
    return { professional: null, error: true }
  }
})
