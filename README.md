# Naetwork Sprint 1

**Positionering:** Beskriv dit behov. Få en skarp brief. Bliv matchet med den rette pro.

Naetwork er nu sat op som en dansk, regelbaseret Sprint 1-platform uden AI-drift. Kunder beskriver et digitalt behov, vælger kategori, får en automatisk projektbrief via skabeloner/regler, og providers kan ansøge via et selvstændigt signup-flow.

## Beslutning for Sprint 1

Sprint 1 kører uden AI.

Det betyder:

- Ingen AI API-key
- Ingen AI-driftsomkostninger
- Brief bygges med kategorier, regler og faste skabeloner
- Matching kan senere bygges regelbaseret på tags, budget, kategori og kapacitet
- Platformen kan køre gratis i starten med Vercel, Supabase Free og Resend Free

## Hvad er bygget

- Guidet consumer intake
- Kategori-valg: Hjemmeside, Dashboard, Automation, Webapp, Pitch deck
- Automatisk brief uden AI
- Brief med kategori, tags, scope, ikke inkluderet, acceptkriterier og match-regler
- Consumer submit til `/api/consumer-intake`
- Provider signup til `/api/provider-signup`
- Supabase integration helper
- Resend email helper
- Supabase schema i `supabase/schema.sql`
- `.env.example` med nødvendige miljøvariabler
- Frontend virker også i demo-mode uden env vars

## Gratis stack

| Del | Tool | Startpris |
|---|---|---:|
| Hosting | Vercel Hobby | 0 kr. |
| Database | Supabase Free | 0 kr. |
| Email | Resend Free | 0 kr. |
| AI | Ingen i Sprint 1 | 0 kr. |

## Opsætning for rigtig lagring og emails

1. Opret et gratis Supabase-projekt.
2. Kør SQL fra `supabase/schema.sql` i Supabase SQL editor.
3. Opret en gratis Resend API-key.
4. Sæt miljøvariabler i Vercel:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL="Naetwork <onboarding@resend.dev>"
ADMIN_EMAIL=
```

5. Redeploy projektet i Vercel.
6. Test både consumer intake og provider signup.

## Hovedflow

1. Kunden vælger kategori.
2. Kunden beskriver behov, målgruppe, scope, budget og deadline.
3. Naetwork bygger en standardiseret brief uden AI.
4. Lead sendes til API-route.
5. Hvis Supabase env vars er sat, gemmes leadet i databasen.
6. Hvis Resend env vars er sat, sendes email-notifikation til admin.
7. Provider kan ansøge via separat signup-flow.

## Næste sprint

Sprint 2 bør være regelbaseret matching:

- Provider skills gemmes struktureret
- Brief-tags matches mod provider skills
- Budgetniveau matches mod provider prisniveau
- Kapacitet/deadline matches
- Top 3 providers vises
- Provider kan sige interesseret / ikke interesseret

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Supabase REST API
- Resend email API
- Vercel deployment

## Kør lokalt

```bash
npm install
npm run dev
```

Åbn derefter:

```text
http://localhost:3000
```

## Deploy

Repoet er klar til Vercel. Hvis GitHub-repoet er koblet til Vercel, deployes ændringer automatisk ved push til `main`.
