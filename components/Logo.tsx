export function Logo({ tone = "ink" }: { tone?: "ink" | "paper" }) {
  const color = tone === "paper" ? "text-paper" : "text-ink";
  return (
    <span className={color} aria-label="Naetwork">
      <span
        aria-hidden="true"
        className="text-[15px] font-normal uppercase sm:text-base"
        style={{ fontFamily: '"GFS Didot", Georgia, serif', letterSpacing: "0.28em" }}
      >
        N&#x39B;ETWORK
      </span>
    </span>
  );
}
