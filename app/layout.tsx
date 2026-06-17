import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';

export const metadata: Metadata = {
  title: 'Naetwork - 1:1 karrieresparring med branchefolk',
  description:
    'Book 1:1 karrieresparring med professionelle fra AI, Banking, Management Consulting og Private Equity.',
  openGraph: {
    title: 'Naetwork - 1:1 karrieresparring med branchefolk',
    description:
      'Konkret feedback på CV, interviews, cases og karrierevalg fra professionelle, der kender vejen indefra.',
    siteName: 'Naetwork',
  },
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
          <Navbar />
          {children}
          <Footer />
          <CookieBanner />
        </LanguageProvider>
      </body>
    </html>
  );
}
