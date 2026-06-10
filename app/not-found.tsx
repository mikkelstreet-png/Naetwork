import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { dictionaries } from "@/lib/content";

const d = dictionaries.en;

export default function NotFound() {
  return (
    <div lang="en">
      <Nav t={d.nav} lang="en" />
      <main id="main" className="bg-paper">
        <section className="wrap flex min-h-[60vh] flex-col items-start justify-center py-24">
          <p className="eyebrow">Error 404</p>
          <h1 className="h1 mt-5 max-w-2xl">This page took the hour off.</h1>
          <p className="lead mt-6 max-w-prose">
            The page you’re looking for isn’t here — but the model still holds:
            one hour, 300 DKK, donated directly to Kræftens Bekæmpelse.
          </p>
          <Link href="/" className="btn-pine mt-9">Back to the start</Link>
        </section>
      </main>
      <Footer t={d.footer} tagline={d.tagline} />
    </div>
  );
}
