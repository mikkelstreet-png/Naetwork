'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import BookingDrawer from '@/components/BookingDrawer'

type Industry = 'Alle brancher' | 'AI' | 'Banking' | 'Management Consulting' | 'Private Equity'

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
    price: 1200,
    bio: 'Tidligere Associate Director med 8 års erfaring i M&A og kapitalmarkeder. Jeg hjælper dig med interviewforberedelse, CV-feedback og at forstå, hvad der faktisk kræves i investment banking.'
  },
  {
    id: 'demo-2',
    name: 'Sofie Larsen',
    title: 'Senior Consultant',
    company: 'McKinsey & Company',
    industries: ['Management Consulting'],
    price: 1100,
    bio: 'Senior Consultant med fokus på strategi og organisationsudvikling. Har hjulpet kandidater med case-forberedelse, interviewtræning og karrierevalg.'
  },
  {
    id: 'demo-3',
    name: 'Emil Andersen',
    title: 'AI Product Lead',
    company: 'Google DeepMind',
    industries: ['AI'],
    price: 900,
    bio: 'Produktleder med baggrund i machine learning og AI-strategi. Hjælper kandidater med at forstå roller, portfolio og veje ind i AI-industrien.'
  },
]

const INDUSTRIES: Industry[] = ['Alle brancher', 'AI', 'Banking', 'Management Consulting', 'Private Equity']

export default function ProfessionalsPage() {
  const [locale, setLocale] = useState<'da' | 'en'>('da')
  const [industryFilter, setIndustryFilter] = useState<Industry>('Alle brancher')
  const [search, setSearch] = useState('')
  const [dbProfessionals, setDbProfessionals] = useState<ProfessionalCard[]>([])
  const [bookTarget, setBookTarget] = useState<ProfessionalCard | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchProfessionals() {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select('id, title, company, bio, price_dkk, industries, profiles!inner(name)')
        .eq('visibility', 'published')

      if (error || !data) return

      const mapped: ProfessionalCard[] = (data as Array<{
        id: string
        title: string | null
        company: string | null
        bio: string | null
        price_dkk: number | null
        industries: string[] | null
        profiles: { name?: string | null } | null
      }>).map((p) => ({
        id: p.id,
        name: p.profiles?.name ?? '',
        title: p.title ?? '',
        company: p.company ?? '',
        industries: p.industries ?? [],
        price: p.price_dkk ?? 1200,
        bio: p.bio ?? '',
      }))
      setDbProfessionals(mapped)
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
    subheading: locale === 'da' ? 'Book en 60-minutters 1:1 session med erfarne professionelle' : 'Book a 60-minute 1:1 session with experienced professionals',
    searchPlaceholder: locale === 'da' ? 'Søg på navn eller titel...' : 'Search by name or title...',
    bookCta: 'Book 60 min',
    perSession: '/ 60 min',
    noResults: locale === 'da' ? 'Ingen resultater' : 'No results',
    readMore: locale === 'da' ? 'Læs mere →' : 'Read more →',
    showLess: locale === 'da' ? 'Vis mindre ↑' : 'Show less ↑',
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
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
            {filtered.map((pro) => {
              const isExpanded = expandedId === pro.id
              return (
                <div key={pro.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow flex flex-col relative">
                  <Link
                    href={`/professionals/${pro.id}`}
                    className="absolute inset-0 rounded-2xl"
                    aria-label={`Se profil for ${pro.name}`}
                  />
                  <div className="mb-3 relative z-10">
                    <h2 className="text-base font-semibold text-gray-900">{pro.name}</h2>
                    <p className="text-sm text-gray-500">{pro.title} &middot; {pro.company}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3 relative z-10">
                    {pro.industries.map((ind) => (
                      <span key={ind} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">{ind}</span>
                    ))}
                  </div>
                  <div className="mb-4 flex-1 relative z-10">
                    <p className={`text-sm text-gray-600 ${isExpanded ? '' : 'line-clamp-3'}`}>{pro.bio}</p>
                    <button
                      onClick={(e) => { e.preventDefault(); setExpandedId(isExpanded ? null : pro.id) }}
                      className="mt-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                      {isExpanded ? t.showLess : t.readMore}
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 relative z-10">
                    <span className="text-sm font-semibold text-gray-900">DKK {pro.price} <span className="text-gray-400 font-normal">{t.perSession}</span></span>
                    <button
                      onClick={(e) => { e.preventDefault(); setBookTarget(pro) }}
                      className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors relative z-20"
                    >
                      {t.bookCta}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {bookTarget && (
        <BookingDrawer professional={bookTarget} open={!!bookTarget} onClose={() => setBookTarget(null)} locale={locale} />
      )}
    </div>
  )
}
