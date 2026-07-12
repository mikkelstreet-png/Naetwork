import type { Metadata, Viewport } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import '@fontsource/inter/900.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import { LanguageProvider } from '@/context/LanguageContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`),
  title: 'Naetwork - Vid mere, før dit næste træk',
  description: 'Naetwork giver dig adgang til relevant erfaring bag de roller, virksomheder og karriereveje, du overvejer.',
  robots: { index: true, follow: true },
  icons: {
    icon: '/naetwork-logo.svg',
    apple: '/naetwork-logo.svg',
  },
  applicationName: 'Naetwork',
  category: 'career development',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Naetwork',
    statusBarStyle: 'default',
  },
};

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#ffffff',
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
