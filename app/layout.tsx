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
  title: 'Naetwork - 60 min career sessions with insiders',
  description:
    'Book 60-minute 1:1 career sessions with professionals from AI, Banking, Management Consulting and Private Equity.',
  openGraph: {
    title: 'Naetwork - 60 min career sessions with insiders',
    description:
      'Concrete feedback on CVs, interviews, cases, technicals and career choices from professionals who know the path from inside.',
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
