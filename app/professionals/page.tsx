'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import BookingDrawer from '@/components/BookingDrawer'

type Industry = 'Alle brancher' | 'Banking' | 'Private Equity' | 'AI' | 'Management Consulting'

interface ProfessionalCard {
  id: string
  name: string
  title: string
  company: string
  industries: string[]
  price: number
  bio: string
}

const DEMO_PROFESSIONALS: ProfessionalCard[] = [
  {
    id: 'demo-1',
    name: 'Mads Christensen',
    title: 'Associate Director',
    company: 'Goldman Sachs',
    industries: ['Banking', 'Private Equity'],
    price: 500,
    bio: 'Tidligere Associate Director med 8 års erfaring i M&A og kapitalmarkeder. Jeg hjaelper dig med at forberede dig til interviews og forstaae, hvad der kraeves for at komme ind i investment banking.'
  },
  {
    id: 'demo-2',
    name: 'Sofie Larsen',
    title: 'Senior Consultant',
    company: 'McKinsey & Company',
    industries: ['Management Consulting'],
    price: 450,
    bio: 'Senior Consultant med fokus på strategi og organisationsudvikling. Har hjulpet over 30 kandidater med case-forberedelse og karriereplan.'
  },
  {
    id: 'demo-3',
    name: 'Emil Andersen',
    title: 'AI Product Lead',
    company: 'Google DeepMind',
    industries: ['AI'],
    price: 400,
    bio: 'Produktleder med baggrund i maskinlæring og AI-strategi. Tidligere engineer, nu fokuseret paa at guide folk ind i AI-industrien.'
  },
]

const INDUSTRIES: Industry[] = ['Alle brancher', 'Banking', 'Private Equity', 'AI', 'Management Consulting']

export default function ProfessionalsPage() {
  const [locale, setLocale] = useState<'da' | 'en'>('da')
  const [industryFilter, setIndustryFilter] = useState<Industry>('Alle brancher')
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchProfessionals() {
      const { data } = await supabase
        .from('professional_profiles')
        .select(`id, title, company, bio, price_per_session, industries, profiles!inner(full_name)`)
        .eq('visibility', 'published')
        .eq('approval_status', 'approved')

      if (data && data.length > 0) {
        const mapped: ProfessionalCard[] = (data as Array<{
          id: string
          title: string
          company: string
          bio: string
          price_per_session: number
          industries: string[]
          profiles: { full_name?: string } | null
        }>).map((p) => ({
          id: p.id,
          name: p.profiles?.full_name ?? '',
          title: p.title ?? '',
          company: p.company ?? '',
          industries: p.industries ?? [],
          price: p.price_per_session ?? 0,
          bio: p.bio ?? '',
        }))
        setDbProfessionals(mapped)
      }
    }
    fetchProfessionals()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const allProfessionals = dbProfessionals.length > 0 ? dbProfessionals : DEMO_PROFESSIONALS

  const filtered = allProfessionals.filter((p) => {
    const matchesIndustry = industryFilter === 'Alle brancher' || p.industries.includes(industryFilter)
    const searchLower = search.toLowerCase()
    const matchesSearch = !search || p.name.toLowerCase().includes(searchLower) || p.title.toLowerCase().includes(searchLower) || p.company.toLowerCase().includes(searchLower)
    return matchesIndustry && matchesSearch
  })

  const t = {
    heading: locale === 'da' ? 'Find en professionel' : 'Find a professional',
    subheading: locale === 'da' ? 'Book en 60-minutters session med erfarne professionelle' : 'Book a 60-minute session with experienced professionals',
    searchPlaceholder: locale === 'da' ? 'Søg på navn eller titel...' : 'Search by name or title...',
    bookCta: 'Book 60 min',
    perSession: '/ session',
    noResults: locale === 'da' ? 'Ingen resultater' : 'No results',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t.heading}</h1>
              <p className="text-gray-500 mt-1">{t.subheading}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setLocale('da')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'da' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>DA</button>
              <button onClick={() => setLocale('en')} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${locale === 'en' ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-gray-900'}`}>EN</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div className="flex gap-2 flex-wrap">
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustryFilter(ind)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${industryFilter === ind ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-16">{t.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((pro) => (
              <div key={pro.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-gray-900">{pro.name}</h2>
                  <p className="text-sm text-gray-500">{pro.title} &middot; {pro.company}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {pro.industries.map((ind) => (
                    <span key={ind} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{ind}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 flex-1 overflow-hidden" style={{display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{pro.bio}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  <span className="text-sm font-semibold text-gray-900">DKK {pro.price} <span className="text-gray-400 font-normal">{t.perSession}</span></span>
                  <button onClick={() => setBookTarget(pro)} className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                    {t.bookCta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale={locale} />
      )}
    </div>
  )
}
