import type { Metadata } from "next";

import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "./globals.css";

import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://naetwork.vercel.app"),
  title: "Naetwork — Find den rette AI-kompetence. Direkte.",
  description:
    "Naetwork forbinder virksomheder og startups med AI-specialister — uden mellemled, uden kommission. Gratis og ikke-kommercielt.",
  keywords: ["Naetwork", "AI specialister", "AI projekter", "AI matching", "freelance AI", "dansk AI platform"],
  openGraph: {
    title: "Naetwork — Find den rette AI-kompetence. Direkte.",
    description:
      "Et gratis, uafhængigt initiativ der forbinder virksomheder med AI-specialister uden mellemled eller kommission.",
    type: "website",
    locale: "da_DK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naetwork — Find den rette AI-kompetence. Direkte.",
    description: "Gratis AI-matching uden mellemled eller kommission.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="font-sans antialiased bg-white text-gray-900">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
