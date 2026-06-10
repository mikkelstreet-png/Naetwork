import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { dictionaries } from "@/lib/content";
// Phase config lives in lib/phase.ts — set PHASE = 'commercial' to activate paid mode.

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", da: "/da" } },
};

export default function Home() {
  return <Landing dict={dictionaries.en} lang="en" />;
}
