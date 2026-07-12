import type { Metadata } from 'next'
import { HomeContent } from '@/components/HomeContent'
import { PRICE_OPTIONS, SESSION_MINUTES } from '@/lib/platform'

export const metadata: Metadata = {
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book 60 minutters fokuseret karrieresparring med gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity. Fire priser inklusive moms fra DKK 600.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Naetwork - Karrieresparring med mening',
    description: '60 minutters fokuseret karrieresparring med tydelige priser, gennemgåede profiler og et konkret bidrag til kræftsagen.',
    siteName: 'Naetwork',
    type: 'website',
    locale: 'da_DK',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naetwork - Karrieresparring med mening',
    description: 'Fokuseret karrieresparring med professionelle fra AI, Banking, Management Consulting og Private Equity.',
  },
}

export default function Home() {
  const siteUrl = (process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk').replace(/\/$/, '')
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Naetwork karrieresparring',
    url: siteUrl,
    description: 'Fokuseret karrieresparring med gennemgåede professionelle fra AI, Banking, Management Consulting og Private Equity.',
    areaServed: 'DK',
    serviceType: `${SESSION_MINUTES} minutters karrieresparring`,
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
        url: `${siteUrl}/professionals`,
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
