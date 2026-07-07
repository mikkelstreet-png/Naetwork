import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`),
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book 60 minutters karrieresparring med professionelle fra AI, Banking, Management Consulting og Private Equity. Minimum 40% af en gennemført, betalt session afsættes til støtte for Kræftens Bekæmpelse.',
  openGraph: {
    title: 'Naetwork - Karrieresparring med mening',
    description:
      '60 minutters fokuseret karrieresparring med tydelige priser, gennemgåede profiler og 40-90% i bidrag fra hver betalt session.',
    siteName: 'Naetwork',
    type: 'website',
    locale: 'da_DK',
    url: '/',
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'Naetwork - Karrieresparring med mening',
    description: '60 minutters fokuseret karrieresparring med professionelle fra AI, Banking, Management Consulting og Private Equity.',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/naetwork-logo.svg',
    apple: '/naetwork-logo.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="bg-white text-gray-900 antialiased">
        <LanguageProvider>
          <a href="#main-content" className="sr-only z-[100] bg-white px-4 py-3 font-bold text-gray-950 focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
            Spring til indhold
          </a>
          <Navbar />
          <div id="main-content" tabIndex={-1}>{children}</div>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
