export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  return (
    <span aria-label="Naetwork" className="inline-block">
      <span
        aria-hidden="true"
        className="text-[15px] font-semibold uppercase tracking-[0.28em] text-white sm:text-base"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        N&#x39B;ETWORK
      </span>
    </span>
  );
}
