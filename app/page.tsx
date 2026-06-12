import { NaetworkExperience } from "@/components/NaetworkExperience";

export default function Home() {
  return (
    <div className="naetwork-copy-polish">
      <style>{`
        .naetwork-copy-polish main > section:first-of-type > div:first-child > div:first-child {
          font-size: 0 !important;
        }
        .naetwork-copy-polish main > section:first-of-type > div:first-child > div:first-child::before {
          content: "Specialister uden tungt bureau set-up";
          font-size: 0.875rem;
          line-height: 1.25rem;
        }
      `}</style>
      <NaetworkExperience />
    </div>
  );
}
