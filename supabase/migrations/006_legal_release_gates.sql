-- Explicit release gates for payments and contribution-through-sale compliance.

INSERT INTO public.legal_blockers (title, description, status, priority)
SELECT
  'Indsamling gennem salg og aftalegrundlag',
  'Afklar med kvalificeret dansk rådgiver og relevante myndigheder, om modellen kræver tilladelse eller registrering. Indgå nødvendige aftaler om navn, kommunikation, overførsel og dokumentation, før betaling aktiveres.',
  'open',
  'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM public.legal_blockers WHERE title = 'Indsamling gennem salg og aftalegrundlag'
);

INSERT INTO public.legal_blockers (title, description, status, priority)
SELECT
  'Handelsoplysninger og forbrugerflow',
  'Publicér korrekt juridisk operatør, fysisk adresse, CVR/registrering og kontaktoplysninger. Checkout skal vise samlet pris, levering, aflysning, fortrydelse og nødvendig anmodning om tidlig levering, før køb bliver bindende.',
  'open',
  'critical'
WHERE NOT EXISTS (
  SELECT 1 FROM public.legal_blockers WHERE title = 'Handelsoplysninger og forbrugerflow'
);

INSERT INTO public.legal_blockers (title, description, status, priority)
SELECT
  'Bidragsafstemning og offentlig dokumentation',
  'Fastlæg bogføring, afstemning, overførselsfrekvens, refunderinger og offentlig dokumentation, så viste procenter kan efterprøves fra betaling til faktisk overførsel.',
  'open',
  'high'
WHERE NOT EXISTS (
  SELECT 1 FROM public.legal_blockers WHERE title = 'Bidragsafstemning og offentlig dokumentation'
);

INSERT INTO public.legal_blockers (title, description, status, priority)
SELECT
  'Databehandleraftaler og internationale overførsler',
  'Dokumentér databehandleraftaler, behandlingslokationer, overførselsgrundlag og relevante risikovurderinger for Supabase, Vercel, Resend og den valgte betalingsudbyder.',
  'open',
  'high'
WHERE NOT EXISTS (
  SELECT 1 FROM public.legal_blockers WHERE title = 'Databehandleraftaler og internationale overførsler'
);
