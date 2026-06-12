import { LegalPage, LegalSection } from "@/components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Privatliv" title="Privatlivspolitik">
      <p className="rounded-2xl bg-slate-50 p-4 text-slate-600">
        Denne privatlivspolitik forklarer, hvordan Naetwork i MVP-versionen håndterer oplysninger fra kunder og specialister. Politikken bør gennemgås juridisk, før der behandles større datamængder eller indføres betaling, login eller tracking.
      </p>

      <LegalSection title="1. Hvilke oplysninger indsamles">
        <p>Naetwork kan indsamle navn, email, opgavebeskrivelse, kategori, budget, deadline, specialistkompetencer, links og andre oplysninger, som brugeren selv indsender via hjemmesiden.</p>
        <p>Naetwork bør ikke bruges til at indsende følsomme personoplysninger, medmindre dette er nødvendigt og særskilt aftalt.</p>
      </LegalSection>

      <LegalSection title="2. Formål med behandlingen">
        <p>Oplysninger bruges til at modtage opgaver, udarbejde eller strukturere en foreløbig brief, kontakte brugeren, vurdere specialistretning og håndtere specialistansøgninger.</p>
        <p>Oplysninger kan også bruges til at forbedre Naetworks service, flows og kvalitet, men bør kun anvendes på en relevant og proportional måde.</p>
      </LegalSection>

      <LegalSection title="3. Deling af oplysninger">
        <p>Oplysninger kan deles med relevante specialister, hvis brugeren ønsker at gå videre med opgaven eller hvis det er nødvendigt for at vurdere specialistmatch.</p>
        <p>Naetwork sælger ikke brugerens oplysninger til annoncører.</p>
      </LegalSection>

      <LegalSection title="4. Opbevaring">
        <p>Oplysninger opbevares så længe det er nødvendigt for at håndtere opgaven, specialistansøgningen, dialogen eller Naetworks legitime behov for dokumentation.</p>
        <p>Brugere kan anmode om sletning, medmindre Naetwork har et sagligt behov eller en retlig forpligtelse til fortsat opbevaring.</p>
      </LegalSection>

      <LegalSection title="5. Tredjepartsleverandører">
        <p>Naetwork kan bruge leverandører til hosting, database, emailudsendelse og teknisk drift. Det kan for eksempel være hostingplatform, databaseleverandør og emailtjeneste.</p>
        <p>Disse leverandører bør kun behandle oplysninger på vegne af Naetwork og til de nødvendige formål.</p>
      </LegalSection>

      <LegalSection title="6. Dine rettigheder">
        <p>Du kan anmode om indsigt, rettelse eller sletning af oplysninger, som Naetwork behandler om dig.</p>
        <p>Du kan også gøre indsigelse mod behandling, hvis du mener, at oplysninger behandles forkert eller unødvendigt.</p>
      </LegalSection>

      <LegalSection title="7. Kontakt">
        <p>Spørgsmål om privatliv og data kan sendes til Naetwork via de kontaktoplysninger, der fremgår af hjemmesiden.</p>
      </LegalSection>
    </LegalPage>
  );
}
