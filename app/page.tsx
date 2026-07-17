import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'
import { PRICE_OPTIONS, SESSION_MINUTES } from '@/lib/platform'
import { BRAND_COPY } from '@/lib/brand'
import { loadPublicProfessionals } from '@/lib/server/publicProfessionals'

const brand = BRAND_COPY.da

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Naetwork - Den professionelle adgangsplatform',
  description: brand.oneSentence,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Naetwork - Få adgang til det, andre får gennem deres netværk',
    description: brand.oneSentence,
    siteName: 'Naetwork',
    type: 'website',
    locale: 'da_DK',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naetwork - Den professionelle adgangsplatform',
    description: brand.oneSentence,
  },
}

export default async function Home() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk').replace(/\/$/, '')
  const { professionals } = await loadPublicProfessionals()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Naetwork - den professionelle adgangsplatform',
    url: siteUrl,
    description: brand.oneSentence,
    areaServed: 'DK',
    serviceType: `${SESSION_MINUTES} minutters adgang til direkte relevant professionel erfaring`,
    provider: {
      '@type': 'Organization',
      name: 'Naetwork',
      url: siteUrl,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Sessionspriser inklusive moms',
      itemListElement: PRICE_OPTIONS.map((price) => ({
        '@type': 'Offer',
        price,
        priceCurrency: 'DKK',
        url: `${siteUrl}/start`,
        availability: 'https://schema.org/OnlineOnly',
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <HomeContent featuredProfessionals={professionals.slice(0, 3)} />
    </>
  )
}
