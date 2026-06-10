import type { Metadata } from "next";
import { Landing } from "@/components/Landing";
import { dictionaries, site } from "@/lib/content";

export const metadata: Metadata = {
  title: `${site.name} — Løs cases. Byg kompetencer. Bekæmp kræft.`,
  description:
    "Book en session med en erfaren professionel. De donerer deres tid. Du donerer 300 kr. — og 100 % går direkte til Kræftens Bekæmpelse.",
  alternates: { canonical: "/da", languages: { en: "/", da: "/da" } },
  openGraph: {
    title: `${site.name} — Løs cases. Byg kompetencer. Bekæmp kræft.`,
    description:
      "Karrierehjælp med et formål ud over dit eget. 300 kr. per session, doneret direkte til Kræftens Bekæmpelse.",
    locale: "da_DK",
  },
};

export default function HomeDa() {
  return <Landing dict={dictionaries.da} lang="da" />;
}
