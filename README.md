# Naetwork MVP

**Positionering:** Beskriv dit behov. Bliv matchet med den rette specialist.

Naetwork er en dansk, moderne MVP-webapp for en kurateret platform, hvor private og virksomheder beskriver et digitalt behov, får det omsat til en professionel AI-genereret projektbrief og matches med relevante digitale pro’s.

## Hvad er bygget

- Dansk forside med premium, nordisk B2B/SaaS-udtryk
- AI-intake for consumers
- AI-genereret projektbrief med kategori, scope, ikke inkluderet, acceptkriterier, budgetniveau og leveringstid
- Provider onboarding med kompetencer, cases, prisniveau og approval-status
- Consumer dashboard med opgaver, status, matches, tilbud, beskeder, leverance og rating-flow
- Provider dashboard med relevante opgaver, match-score, tilbud og aktive projekter
- Admin dashboard med provider approval, manuel matching, pipeline og potentiel kommission
- Mock matchinglogik baseret på opgavetags og provider-kompetencer
- Early access-framing uden falske brugertal, cases eller testimonials

## Hovedflow

1. Kunden beskriver sit behov i fri tekst.
2. AI stiller få opklarende spørgsmål.
3. AI laver en professionel projektbrief.
4. Kunden godkender eller justerer briefen.
5. Opgaven matches med relevante providers.
6. Kunden modtager 1-3 tilbud/interessetilkendegivelser.
7. Kunden vælger provider.
8. Projektet leveres, godkendes og rates.

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Mock data og frontend-state
- Klar til Vercel deployment

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
