import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProfessionalDetail from '@/components/ProfessionalDetail'
import { loadPublicProfessional } from '@/lib/server/publicProfessionals'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const { professional } = await loadPublicProfessional(id)
  if (!professional) return { title: 'Fagpersonprofil - Naetwork', robots: { index: false, follow: true } }

  const role = [professional.title, professional.company].filter(Boolean).join(' hos ')
  return {
    title: `${professional.name} - Naetwork`,
    description: `${role || 'Erfaren fagperson'}. Se hvornår fagpersonen er relevant, hvad du kan få hjælp til, pris og bidraget til Kræftens Bekæmpelse.`,
    alternates: { canonical: `/professionals/${professional.id}` },
  }
}

export default async function ProfessionalPage({ params }: PageProps) {
  const { id } = await params
  const result = await loadPublicProfessional(id)
  if (!result.error && !result.professional) notFound()
  return <ProfessionalDetail id={id} initialProfessional={result.professional} initialLoadError={result.error} />
}
