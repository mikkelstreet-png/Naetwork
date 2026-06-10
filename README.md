# Naetwork

**Solve cases. Build skills. Fight cancer.**

A purpose-driven marketplace where candidates book 60-minute sessions with
experienced professionals for career guidance. Each session costs **300 DKK**,
the professional **donates their time**, and the full amount is **donated
directly to Kræftens Bekæmpelse**.

> Naetwork is a voluntary, non-profit initiative. Donations are
> directed to Kræftens Bekæmpelse. We do not claim a formal partnership unless
> one has been confirmed.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS 3.4**
- **Self-hosted fonts** via @fontsource — Space Grotesk (display), Inter (body),
  JetBrains Mono (data), Lora italic (accent). No external font fetch.
- **lucide-react** icons
- Static-first, no backend, zero running cost on Vercel's free tier

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (what Vercel runs)
```

## Editing

**All copy lives in `lib/content.ts`** — and it is bilingual. The file exports
`dictionaries.en` and `dictionaries.da`, which share the exact same shape
(TypeScript enforces that every English string has a Danish counterpart). Edit
text there; never touch components for wording.

### Languages

- English at `/` and Danish at `/da` (with `/privacy` and `/da/privatliv`).
- A language switch (EN / DA) sits in the navigation.
- `hreflang` and `canonical` tags cross-link the two versions for SEO.

Each section is its own file in `components/`, and a shared `Landing` component
renders both language versions. Design tokens (the paper / pine-green / amber
palette, type scale) live in `tailwind.config.ts` and `app/globals.css`.

### Before going live — two settings in `lib/content.ts`

```ts
export const site = {
  donateUrl: "https://...",   // real MobilePay / donation destination
  formEndpoint: "",           // paste a Formspree (or similar) URL to receive
                              // booking/interest submissions by email
};
```

If `formEndpoint` is empty, the booking modal still works and shows a
confirmation, but submissions are not stored. Add an endpoint to collect leads.

## What's on the page

Hero → How it works → **The honest ledger** (signature) → Two ways to
participate → Marketplace preview → For companies & partners → 6-month launch
journey (Feb–Jul 2027) → Quiet credibility → Founder note → FAQ → Final CTA →
Footer. A booking/interest modal (candidate / professional / company) is wired
to every call-to-action.

## Deploy

### 1 — Push to GitHub

With git on your machine:

```bash
git init
git add .
git commit -m "Naetwork — first version"
git branch -M main
git remote add origin https://github.com/<you>/cases-fighting-cancer.git
git push -u origin main
```

On iPad / no git: create an empty repo on github.com → **Add file → Upload
files** → drag the unzipped project contents in → **Commit**.

### 2 — Deploy on Vercel

1. https://vercel.com → sign in with GitHub.
2. **Add New… → Project** → import the repo.
3. Vercel auto-detects Next.js. Keep all defaults → **Deploy**.
4. Live URL in ~1 minute; every `git push` redeploys automatically.
5. Custom domain later under **Project → Settings → Domains**.
