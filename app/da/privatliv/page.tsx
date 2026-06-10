import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { dictionaries } from "@/lib/content";

const d = dictionaries.da;

export const metadata: Metadata = {
  title: "Privatliv — Naetwork",
  description: "Sådan håndterer Naetwork de oplysninger, du deler.",
  alternates: { canonical: "/da/privatliv" },
};

const sections = [
  { h: "Hvad vi indsamler", p: "Hvis du kontakter os via sitet — for at anmode om en session, tilbyde din tid eller spørge til partnerskab — indsamler vi det, du sender: dit navn, din email og den valgfrie kontekst, du giver. Vi bruger ikke tracking- eller reklamecookies." },
  { h: "Hvorfor vi bruger det", p: "Udelukkende til at svare dig og koordinere sessioner før og efter launch. Vi sælger, udlejer eller deler ikke dine oplysninger med tredjeparter til markedsføring." },
  { h: "Betalinger og donationer", p: "Naetwork behandler ikke betalinger. Donationen på 300 kr. foretages af dig, direkte til Kræftens Bekæmpelse via MobilePay. Vi modtager, holder eller har aldrig adgang til dine betalingsoplysninger." },
  { h: "Opbevaring og sletning", p: "Vi gemmer kun det, du sender, så længe det er nødvendigt for at hjælpe dig, og sletter det derefter. Du kan til enhver tid bede os om indsigt i eller sletning af dine oplysninger." },
  { h: "Dine rettigheder", p: "Efter GDPR kan du anmode om indsigt i, rettelse af eller sletning af de personoplysninger, du har delt med os. Kontakt os via oplysningerne nedenfor." },
  { h: "Kontakt", p: "Spørgsmål om privatliv kan sendes til teamet bag Naetwork. En overvåget kontaktadresse offentliggøres her inden launch." },
];

export default function PrivatlivDa() {
  return (
    <div lang="da">
      <Nav t={d.nav} lang="da" />
      <main id="main" className="bg-paper">
        <section className="wrap py-20 sm:py-28">
          <p className="eyebrow">Privatliv</p>
          <h1 className="h2 mt-4 max-w-3xl">Sådan håndterer vi dine oplysninger.</h1>
          <p className="lead mt-5 max-w-prose">Naetwork er et frivilligt, non-profit initiativ. Vi holder dataindsamling på et minimum og forklarer det ligefremt.</p>
          <div className="mt-14 max-w-prose space-y-10">
            {sections.map((s) => (
              <div key={s.h}><h2 className="h3">{s.h}</h2><p className="mt-3 leading-relaxed text-muted">{s.p}</p></div>
            ))}
          </div>
          <p className="mt-16 max-w-prose border-t border-line pt-6 text-sm leading-relaxed text-muted">
            Vi sender donationer til Kræftens Bekæmpelse. Vi beskriver det ikke som et formelt partnerskab, medmindre et er bekræftet. Denne side er et ærligt resumé, ikke juridisk rådgivning, og gennemgås inden offentlig launch.
          </p>
          <Link href="/da" className="btn-ghost mt-10">← Tilbage til start</Link>
        </section>
      </main>
      <Footer t={d.footer} tagline={d.tagline} />
      <BookingModal t={d.modal} />
    </div>
  );
}
