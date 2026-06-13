# Sprint 6 — Responsive QA og premium polish

Formålet er at sikre, at Naetwork føles professionel på mobil, tablet og desktop.

## Sider der skal testes

- `/`
- `/access`
- `/login`
- `/opgave`
- `/opgave/[id]`
- `/specialist/login`
- `/specialist`
- `/admin/login`
- `/admin`
- `/vilkaar`
- `/privatliv`
- `/cookies`

## Skærmstørrelser

Test minimum:

- iPhone SE / lille mobil
- normal iPhone
- stor iPhone
- iPad portrait
- iPad landscape
- 13 inch laptop
- desktop

## Global layout QA

Tjek:

- Ingen horisontal scroll
- Ingen afklippede ord
- Ingen knapper der går ud over skærmen
- Ingen kort der bliver for smalle
- Ingen overlappende sticky/floating elementer
- Alle CTA’er er minimum 44 px høje
- Lange emails og UUID’er bryder pænt
- Lange danske ord bryder pænt
- Modaler/floating boxes kan lukkes eller ignoreres

## Forside

Tjek:

- Hero headline står flot på lille mobil
- Primær CTA er synlig uden at scrolle for langt
- Eksempelboksen giver mening
- Kategori-cards har ens rytme
- Stepper viser ikke mærkelig wrapping
- `Start kort` er ikke for lille på mobil
- Menuen er nem at bruge på mobil

## Opgaveflow

Tjek:

- Hvert step er forståeligt uden forklaring
- Tekstfelter er store nok på mobil
- Fejlbeskeder er tydelige
- Send-knap er tydelig
- Success-flow viser `Se min opgave`
- Kunden forstår at opgaven ikke er bindende

## Kundeområde

Tjek:

- `/login` føles som `Se din opgave`, ikke generisk login
- `/opgave` har gode tomme states
- `/opgave/[id]` viser status tydeligt
- Scope, spørgsmål og næste skridt er lette at scanne
- Tilføj mere info fungerer på mobil
- Lange kundeopdateringer bryder layoutet korrekt

## Specialistområde

Tjek:

- Login-siden forklarer at kun godkendte specialister får adgang
- Dashboard har god tom state uden invitationer
- Opgaveinvitationer er lette at forstå
- Knapperne `Interesseret`, `Ønsker mere info`, `Ikke relevant` virker på mobil
- Note-feltet er let at bruge

## Admin

Tjek:

- `/admin/login` er enkel og ikke for marketingagtig
- Dashboard er brugbart på laptop
- Dashboard er acceptabelt på mobil, selv hvis det primært bruges på desktop
- Opgavelisten er scannable
- Status, specialistretning, næste skridt og intern note kan gemmes
- Specialistansøgninger kan godkendes/afvises
- Invitationer kan sendes
- Specialistens svar kan ses bagefter

## Email og link QA

Tjek:

- Kunde-email åbner korrekt opgaveside
- Specialist-email åbner korrekt specialistområde
- Links udløber som forventet
- `APP_BASE_URL` peger på production
- Email-tekster føles menneskelige og ikke tekniske

## Done-kriterie

Sprint 6 er done, når alle hovedsider er visuelt stabile på mobil og desktop, og ingen primær handling føles skjult, klippet eller for teknisk.
