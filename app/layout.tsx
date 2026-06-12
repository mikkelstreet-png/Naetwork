import type { Metadata } from "next";

import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://naetwork.vercel.app"),
  title: "Naetwork — Beskriv dit behov. Bliv matchet med den rette specialist.",
  description:
    "Naetwork hjælper private og virksomheder med at få bygget simple digitale løsninger via AI-intake, professionel brief og kurateret provider-matching.",
  keywords: ["Naetwork", "AI intake", "digitale løsninger", "freelance matching", "webapps", "automations", "dashboards"],
  openGraph: {
    title: "Naetwork — Beskriv dit behov. Bliv matchet med den rette specialist.",
    description:
      "En dansk, kurateret platform for simple digitale løsninger — fra behov til brief, match, tilbud og levering.",
    type: "website",
    locale: "da_DK",
  },
  twitter: {
    card: "summary_large_image",
    title: "Naetwork — Beskriv dit behov. Bliv matchet med den rette specialist.",
    description: "AI-intake og kurateret matching med relevante digitale pro’s.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="da">
      <body className="font-sans antialiased bg-[#f7f8fb] text-slate-950">{children}</body>
    </html>
  );
}
