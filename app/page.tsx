import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'
import { PRICE_OPTIONS, SESSION_MINUTES } from '@/lib/platform'
import { BRAND_COPY } from '@/lib/brand'

const brand = BRAND_COPY.da

export const metadata: Metadata = {
  title: 'Naetwork - 60 minutters karrieresparring med erfarne fagpersoner',
  description: brand.oneSentence,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Naetwork - Erfaring, du kan handle på',
    description: brand.oneSentence,
    siteName: 'Naetwork',
    type: 'website',
    locale: 'da_DK',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naetwork - Erfaring, du kan handle på',
    description: brand.oneSentence,
  },
}

export default function Home() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk').replace(/\/$/, '')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Naetwork karrieresessioner',
    url: siteUrl,
    description: brand.oneSentence,
    areaServed: 'DK',
    serviceType: `Karrieresession med en erfaren fagperson på ${SESSION_MINUTES} minutter`,
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
      <HomeContent />
    </>
  )
}
