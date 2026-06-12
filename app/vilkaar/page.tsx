import { LegalPage, LegalSection } from "@/components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Juridisk" title="Vilkår for brug af Naetwork">
      <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">
        Dette er en MVP-version af vilkårene. Teksten er udarbejdet for at skabe tydelig forventningsafstemning, men bør gennemgås af en jurist, før Naetwork bruges kommercielt i større skala eller håndterer betalinger.
      </p>

      <LegalSection title="1. Hvad Naetwork gør">
        <p>Naetwork hjælper brugere med at beskrive, strukturere og gøre digitale opgaver klarere, før de eventuelt går videre med en relevant specialist.</p>
        <p>Naetwork kan hjælpe med at tydeliggøre opgavens behov, ønsket resultat, scope, spørgsmål og mulig specialistretning.</p>
      </LegalSection>

      <LegalSection title="2. Naetwork er ikke automatisk part i aftaler">
        <p>Naetwork er ikke part i aftaler mellem kunde og specialist, medmindre dette aftales særskilt skriftligt.</p>
        <p>Kunde og specialist er selv ansvarlige for pris, betaling, levering, kvalitet, rettigheder, tidsplan, fortrolighed og øvrige vilkår i deres indbyrdes aftale.</p>
      </LegalSection>

      <LegalSection title="3. Ingen garanti for resultat">
        <p>Naetwork kan hjælpe med at gøre en opgave mere tydelig, men garanterer ikke et bestemt kommercielt, teknisk, kreativt eller økonomisk resultat.</p>
        <p>Eventuelle specialistforslag eller specialistretninger skal ses som vejledende og ikke som en garanti for egnethed, kvalitet eller levering.</p>
      </LegalSection>

      <LegalSection title="4. Brugerens ansvar">
        <p>Brugeren er ansvarlig for, at oplysninger indsendt til Naetwork er korrekte, lovlige og ikke krænker tredjemands rettigheder.</p>
        <p>Brugeren bør ikke indsende følsomme oplysninger, hemmelige forretningsoplysninger eller personoplysninger, som ikke er nødvendige for at forstå opgaven.</p>
      </LegalSection>

      <LegalSection title="5. Specialisters ansvar">
        <p>Specialister er selv ansvarlige for deres kompetencer, cases, levering, priser, kommunikation, aftaler og overholdelse af gældende regler.</p>
        <p>Naetwork kan afvise eller fjerne specialistprofiler eller henvendelser, hvis de vurderes irrelevante, misvisende eller uegnede.</p>
      </LegalSection>

      <LegalSection title="6. Betaling og kommission">
        <p>Hvis Naetwork senere indfører betaling, kommission eller betalingsformidling, skal vilkårene opdateres, så pris, betalingsansvar, tilbagebetaling, reklamation og Naetworks rolle fremgår tydeligt.</p>
        <p>Indtil andet er aftalt, er første opgaveindsendelse uden betaling og uden binding.</p>
      </LegalSection>

      <LegalSection title="7. Ændringer">
        <p>Naetwork kan løbende ændre hjemmesiden, flows, tekster og vilkår. Den version, der er tilgængelig på hjemmesiden, er den gældende version.</p>
      </LegalSection>

      <LegalSection title="8. Kontakt">
        <p>Spørgsmål til vilkår kan sendes til Naetwork via de kontaktoplysninger, der fremgår af hjemmesiden.</p>
      </LegalSection>
    </LegalPage>
  );
}
