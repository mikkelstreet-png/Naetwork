import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { dictionaries } from "@/lib/content";

const d = dictionaries.en;

export const metadata: Metadata = {
  title: "Privacy — Naetwork",
  description: "How Naetwork handles the information you share.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  { h: "What we collect", p: "If you contact us through the site — to request a session, offer your time or ask about partnering — we collect the details you submit: your name, email and the optional context you provide. We do not use tracking or advertising cookies." },
  { h: "Why we use it", p: "Solely to respond to you and to coordinate sessions ahead of and after launch. We do not sell, rent or share your information with third parties for marketing." },
  { h: "Payments and donations", p: "Naetwork does not process payments. The 300 DKK donation is made by you, directly to Kræftens Bekæmpelse via MobilePay. We never receive, hold or have access to your payment details." },
  { h: "Storage and retention", p: "We keep what you send only as long as needed to help you, then delete it. You can ask us to access or remove your information at any time." },
  { h: "Your rights", p: "Under the GDPR you can request access to, correction of, or deletion of the personal data you have shared with us. To do so, contact us using the details below." },
  { h: "Contact", p: "Questions about privacy can be sent to the team behind Naetwork. A monitored contact address will be published here ahead of launch." },
];

export default function Privacy() {
  return (
    <div lang="en">
      <Nav t={d.nav} lang="en" />
      <main id="main" className="bg-paper">
        <section className="wrap py-20 sm:py-28">
          <p className="eyebrow">Privacy</p>
          <h1 className="h2 mt-4 max-w-3xl">How we handle your information.</h1>
          <p className="lead mt-5 max-w-prose">Naetwork is a voluntary, non-profit initiative. We keep data collection to a minimum and explain it plainly.</p>
          <div className="mt-14 max-w-prose space-y-10">
            {sections.map((s) => (
              <div key={s.h}><h2 className="h3">{s.h}</h2><p className="mt-3 leading-relaxed text-muted">{s.p}</p></div>
            ))}
          </div>
          <p className="mt-16 max-w-prose border-t border-line pt-6 text-sm leading-relaxed text-muted">
            We direct donations to Kræftens Bekæmpelse. We do not describe this as a formal partnership unless one has been confirmed. This page is an honest summary, not legal advice, and will be reviewed before public launch.
          </p>
          <Link href="/" className="btn-ghost mt-10">← Back to start</Link>
        </section>
      </main>
      <Footer t={d.footer} tagline={d.tagline} />
      <BookingModal t={d.modal} />
    </div>
  );
}
