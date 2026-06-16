'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import BookingDrawer from '@/components/BookingDrawer'

interface Professional {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  price: number
  bio: string
  focus_areas?: string[]
}

const DEMO_PROFESSIONALS: Record<string, Professional> = {
  'demo-1': {
    id: 'demo-1',
    name: 'Mads Christensen',
    title: 'Associate Director',
    company: 'Goldman Sachs',
    industries: ['Banking', 'Private Equity'],
    price: 500,
    bio: 'Tidligere Associate Director med 8 aars erfaring i M&A og kapitalmarkeder. Jeg hjaelper dig med at forberede dig til interviews og forstaae, hvad der kraeves for at komme ind i investment banking.',
    focus_areas: ['Interview forberedelse', 'CV review', 'Karriereraagivning', 'Case-traening']
  },
  'demo-2': {
    id: 'demo-2',
    name: 'Sofie Larsen',
    title: 'Senior Consultant',
    company: 'McKinsey & Company',
    industries: ['Management Consulting'],
    price: 450,
    bio: 'Senior Consultant med fokus paa strategi og organisationsudvikling. Har hjulpet over 30 kandidater med case-forberedelse og karriereplan.',
    focus_areas: ['Case-forberedelse', 'Karriereplan', 'Networking tips', 'Loenforhandling']
  },
  'demo-3': {
    id: 'demo-3',
    name: 'Emil Andersen',
    title: 'AI Product Lead',
    company: 'Google DeepMind',
    industries: ['AI'],
    price: 400,
    bio: 'Produktleder med baggrund i maskinlaering og AI-strategi. Tidligere engineer, nu fokuseret paa at guide folk ind i AI-industrien.',
    focus_areas: ['AI karrierevej', 'Portfolio review', 'Teknisk forberedelse', 'Produktstrategi']
  }
}

export default function ProfessionalDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [professional, setProfessional] = useState<Professional | null>(null)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [locale, setLocale] = useState<'da' | 'en'>('da')

  const supabase = createClient()

  useEffect(() => {
    if (!id) return
    if (id.startsWith('demo-')) {
      setProfessional(DEMO_PROFESSIONALS[id] ?? null)
      setLoading(false)
      return
    }
    async function fetchProfessional() {
      const { data } = await supabase
        .from('professional_profiles')
        .select(`id, title, company, bio, price_per_session, industries, focus_areas, profiles!inner(full_name)`)
        .eq('id', id)
        .single()
      if (data) {
        const row = data as {
          id: string; title: string; company: string; bio: string
          price_per_session: number; industries: string[]; focus_areas: string[]
          profiles: { full_name?: string } | null
        }
        setProfessional({
          id: row.id, name: row.profiles?.full_name ?? '',
          title: row.title ?? '', company: row.company ?? '',
          industries: row.industries ?? [], price: row.price_per_session ?? 0,
          bio: row.bio ?? '', focus_areas: row.focus_areas ?? [],
        })
      }
      setLoading(false)
    }
    fetchProfessional()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const t = {
    back: locale === 'da' ? 'Tilbage til oversigt' : 'Back to overview',
    sessionTypes: locale === 'da' ? 'Sessionstyper' : 'Session types',
    availability: locale === 'da' ? 'Se ledige tider' : 'View availability',
    bookCta: 'Book 60 min session',
    loading: locale === 'da' ? 'Indlaaser...' : 'Loading...',
    notFound: locale === 'da' ? 'Profil ikke fundet' : 'Profile not found',
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-400">{t.loading}</p></div>

  if (!professional) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">{t.notFound}</p>
        <Link href="/professionals" className="text-indigo-600 hover:underline text-sm">{t.back}</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/professionals" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <span>&larr;</span><span>{t.back}</span>
          </Link>
          <div className="flex gap-2">
            <button onClick={() => setLocale('da')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'da' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>DA</button>
            <button onClick={() => setLocale('en')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>EN</button>
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-8 mb-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{professional.name}</h1>
              <p className="text-gray-500 mt-0.5">{professional.title} &middot; {professional.company}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">DKK {professional.price}</p>
              <p className="text-sm text-gray-400">/ session</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {professional.industries.map((ind) => (
              <span key={ind} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">{ind}</span>
            ))}
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">{professional.bio}</p>
          {professional.focus_areas && professional.focus_areas.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">{t.sessionTypes}</h3>
              <div className="flex flex-wrap gap-2">
                {professional.focus_areas.map((area) => (
                  <span key={area} className="bg-gray-50 text-gray-700 text-sm px-3 py-1 rounded-lg border border-gray-100">{area}</span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 text-center">{t.availability}</p>
          </div>
          <button onClick={() => setDrawerOpen(true)} className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-base">
            {t.bookCta}
          </button>
        </div>
      </div>
      <BookingDrawer professional={professional} open={drawerOpen} onClose={() => setDrawerOpen(false)} locale={locale} />
    </div>
  )
}
