# Naetwork MVP

**Positionering:** Beskriv dit behov. Få en skarp brief. Bliv matchet med den rette pro.

Naetwork er en dansk early access MVP for en kurateret platform, hvor private, founders og små virksomheder beskriver et digitalt behov, får det omsat til en professionel projektbrief og kan matches med relevante digitale specialister.

## Kvalitetssikringslinje

Den nuværende version er ryddet op, så den er mere launch-parat:

- Ingen falske brugertal, ratings, testimonials eller cases
- Demo-eksempler er tydeligt markeret som demo
- Forsiden forklarer værdien mere klart og professionelt
- Det tidligere uklare “live demo flow” er fjernet som primær framing
- Consumer-flowet fokuserer på behov → brief → kvalitetssikring
- Provider-flowet er gjort til en ansøgning, ikke en åben profil-børs
- Admin-delen er positioneret som quality gate for manuel matching
- Begge routes (`/` og `/da`) peger på den kvalitetssikrede MVP-komponent

## Hvad er bygget

- Dansk forside med premium, nordisk B2B/SaaS-udtryk
- AI-intake for consumers
- AI-genereret projektbrief med kategori, scope, ikke inkluderet, acceptkriterier, budgetniveau og leveringstid
- Provider early access-ansøgning
- Admin quality gate med næste tekniske launch-skridt
- Mock matching-note baseret på opgavetags
- Early access-framing uden overdrevne claims

## Hovedflow

1. Kunden beskriver sit behov i fri tekst.
2. Naetwork omsætter behovet til en professionel brief.
3. Scope, fravalg og acceptkriterier bliver tydelige.
4. Opgaven sendes til kvalitetssikring.
5. Admin kan manuelt matche opgaven med 1-3 relevante pro’s.
6. Provider-ansøgninger godkendes manuelt.

## Mangler før reel launch

- Gem consumer-intakes i database
- Gem provider-ansøgninger i database
- Send email-notifikation til admin ved nye leads
- Skjul admin bag login
- Tilføj privatlivspolitik og vilkår
- Tilføj basal cookie-/datatekst
- Tilføj rigtig status på opgaver og provider-ansøgninger
- Tilføj betalingsstatus uden fuld betalingsintegration først

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
