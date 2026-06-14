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
  title: 'Naetwork — Karrieresessioner med erfarne professionelle',
  description: 'Book en session med en erfaren professionel. Mock interviews, CV-gennemgang og karriereraadgivning. DKK 300–2.000 per session.',
  openGraph: {
    title: 'Naetwork',
    description: 'Karrieresessioner med mennesker der ved det.',
    siteName: 'Naetwork',
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
