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
  title: 'Naetwork - Karrieresparring med mening',
  description:
    'Book 60-minute career sessions with professionals from AI, Banking, Management Consulting and Private Equity. Every paid session contributes to Kræftens Bekæmpelse.',
  openGraph: {
    title: 'Naetwork - Karrieresparring med mening',
    description:
      'Focused 60-minute career guidance with concrete pricing, sharp profiles and a 40-90% impact contribution from every paid session.',
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
