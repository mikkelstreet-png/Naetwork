import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { dictionaries } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/", languages: { en: "/", da: "/da" } },
};

export default function Home() {
  return <Landing dict={dictionaries.en} lang="en" />;
}
