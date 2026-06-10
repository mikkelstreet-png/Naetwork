import type { Metadata } from "next";

// Self-hosted fonts
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/jetbrains-mono/latin-400.css";
import "@fontsource/jetbrains-mono/latin-500.css";

import "./globals.css";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: `${site.name} — ${site.tagline}`,
  description:
    "Book a session with an experienced professional. They donate their time. You donate 300 DKK — and 100% goes directly to Kraeftens Bekaempelse.",
  keywords: ["career mentoring", "case interview practice", "charity", "Kraeftens Bekaempelse", "Copenhagen", "CBS"],
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: "Career guidance with a purpose beyond your own. 300 DKK per session, donated directly to Kraeftens Bekaempelse.",
    type: "website",
    locale: "en_DK",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: "One hour of expert career help. 300 DKK, donated directly to Kraeftens Bekaempelse.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans antialiased bg-[#050810] text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-blue-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
