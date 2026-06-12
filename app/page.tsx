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

        /* Hero task box: make it unmistakably larger and more premium */
        .naetwork-copy-polish main > section:first-of-type > div:first-child > div:nth-of-type(2) {
          padding: 1.75rem !important;
          border-radius: 2rem !important;
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.08) !important;
        }

        .naetwork-copy-polish main > section:first-of-type textarea {
          min-height: 320px !important;
          height: 320px !important;
          padding: 1.25rem !important;
          font-size: 1rem !important;
          line-height: 1.75 !important;
          border-radius: 1.5rem !important;
        }

        .naetwork-copy-polish main > section:first-of-type textarea::placeholder {
          color: rgba(100, 116, 139, 0.72) !important;
        }

        @media (max-width: 768px) {
          .naetwork-copy-polish main > section:first-of-type textarea {
            min-height: 260px !important;
            height: 260px !important;
          }
        }
      `}</style>
      <NaetworkExperience />
    </div>
  );
}
