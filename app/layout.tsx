import type { Metadata } from "next";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://naetwork.vercel.app"),
  title: "Naetwork — Gratis AI-projektboard for virksomheder og specialister",
  description:
    "Post dit AI-projekt gratis. Relevante AI-specialister melder interesse direkte. Ingen platformsgebyrer — aftaler indgås direkte mellem brugere.",
  keywords: ["AI specialist", "AI projekt", "AI implementering", "automatisering", "AI Danmark"],
  openGraph: {
    title: "Naetwork — Gratis AI-projektboard",
    description: "Post dit AI-projekt gratis. Specialister melder interesse. Aftaler sker direkte.",
    type: "website",
    locale: "da_DK",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="antialiased bg-white text-[#0a0a0a]">{children}</body>
    </html>
  );
}
