import type { Metadata } from 'next'
import ProfessionalsDirectory from '@/components/ProfessionalsDirectory'
import { mapPublicProfessionals } from '@/lib/professionals'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Find en professionel | Naetwork',
  description: 'Sammenlign gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity efter erfaring, fokus, pris og bidrag.',
  alternates: { canonical: '/professionals' },
}

export default async function ProfessionalsPage() {
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  if (!configured) return <ProfessionalsDirectory initialProfessionals={[]} initialLoadError />

  try {
    const supabase = await createClient()
    const { data, error } = await supabase.rpc('get_public_professionals')
    return <ProfessionalsDirectory initialProfessionals={mapPublicProfessionals(data)} initialLoadError={Boolean(error)} />
  } catch {
    return <ProfessionalsDirectory initialProfessionals={[]} initialLoadError />
  }
}
