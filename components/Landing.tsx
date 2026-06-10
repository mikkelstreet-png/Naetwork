import type { Dict, Lang } from "@/lib/content";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { Ledger } from "./Ledger";
import { TwoWays } from "./TwoWays";
import { Marketplace } from "./Marketplace";
import { Companies } from "./Companies";
import { Journey } from "./Journey";
import { Trust } from "./Trust";
import { FounderNote } from "./FounderNote";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";
import { BookingModal } from "./BookingModal";

export function Landing({ dict, lang }: { dict: Dict; lang: Lang }) {
  return (
    <div lang={lang}>
      <Nav t={dict.nav} lang={lang} />
      <main id="main">
        <Hero t={dict.hero} how={dict.how} />
        <Ledger t={dict.ledger} lang={lang} />
        <TwoWays t={dict.twoWays} />
        <Marketplace t={dict.marketplace} />
        <Companies t={dict.companies} />
        <Journey t={dict.journey} />
        <Trust t={dict.trust} />
        <FounderNote t={dict.founder} />
        <FAQ t={dict.faq} />
        <FinalCTA t={dict.finalCta} />
      </main>
      <Footer t={dict.footer} tagline={dict.tagline} />
      <BookingModal t={dict.modal} />
    </div>
  );
}
