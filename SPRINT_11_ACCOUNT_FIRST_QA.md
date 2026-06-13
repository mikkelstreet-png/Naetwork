# Sprint 11 — Account-first platform QA

Formål: gøre Naetwork til en moden konto-baseret platform og fjerne magic-link flowet fra den primære brugeroplevelse.

## Header

Header skal vise:

- Forside
- Sådan virker det
- Hvorfor Naetwork
- Opret opgave
- Min Naetwork konto
- Opret dig

Hvis bruger er logget ind, skal højre CTA være:

- Min profil

Må ikke vise:

- Start her
- Start kort
- Se min opgave
- Access

## Forside

Forsiden skal forklare:

- hvad Naetwork er
- hvem det er for
- hvorfor opgaven skal gøres klar før specialistmatch
- at konto er centrum for opgaver
- at AI scope engine kommer som næste produktlag

## Opret dig

Test:

- opret kunde med email som brugernavn
- opret specialist med email som brugernavn
- adgangskode mindst 8 tegn
- fejl ved eksisterende email
- redirect til profil efter oprettelse

## Min Naetwork konto

Test:

- login med email og adgangskode
- fejl ved forkert adgangskode
- redirect til profil efter login

## Opret opgave

Test:

- ikke-logget bruger sendes til login/opret dig
- logget bruger kan oprette opgave
- opgave knyttes til brugerens email
- opgaven vises på Min profil

## Min profil

Test:

- kunde ser egne opgaver
- specialist ser specialistprofil/invitationer
- log ud virker

## Supabase

Seneste database.sql skal køres før test:

- user_accounts skal eksistere
- tasks skal eksistere
- account dashboard skal kunne læse tasks på brugerens email

## Done-kriterie

Sprint 11 er done, når en bruger kan:

1. oprette konto
2. logge ind
3. oprette opgave
4. se opgaven på sin profil
5. logge ud og logge ind igen

Uden magic-link som primær brugerrejse.
