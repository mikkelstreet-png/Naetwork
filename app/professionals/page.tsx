import type { Metadata } from 'next'
import ProfessionalsDirectory, { type DirectoryFilterValues } from '@/components/ProfessionalsDirectory'
import { mapPublicProfessionals } from '@/lib/professionals'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Find den erfaring, du mangler | Naetwork',
  description: 'Find en professionel, der kender rollen, branchen eller processen indefra.',
  alternates: { canonical: '/professionals' },
}

interface ProfessionalsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function firstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function ProfessionalsPage({ searchParams }: ProfessionalsPageProps) {
  const query = await searchParams
  const initialFilterValues: DirectoryFilterValues = {
    field: firstQueryValue(query.field),
    session: firstQueryValue(query.session),
    need: firstQueryValue(query.need),
    language: firstQueryValue(query.language),
    availability: firstQueryValue(query.availability),
    price: firstQueryValue(query.price),
    q: firstQueryValue(query.q),
  }
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  if (!configured) return <ProfessionalsDirectory initialProfessionals={[]} initialLoadError initialFilterValues={initialFilterValues} />

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_professionals')
    return <ProfessionalsDirectory initialProfessionals={mapPublicProfessionals(data)} initialLoadError={Boolean(error)} initialFilterValues={initialFilterValues} />
  } catch {
    return <ProfessionalsDirectory initialProfessionals={[]} initialLoadError initialFilterValues={initialFilterValues} />
  }
}
