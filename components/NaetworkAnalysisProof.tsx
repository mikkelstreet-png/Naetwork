'use client';

import { useEffect } from "react";
import { NaetworkTrafficOptimized } from "@/components/NaetworkTrafficOptimized";

const textReplacements: Array<[string, string]> = [
  ["Vælg næste skridt", "Find den rette specialist"],
  [
    "Du vælger selv, om opgaven skal videre til en specialist. Ingen binding på første trin.",
    "Find den rette specialist for dig eller din virksomhed. Naetwork peger på en relevant specialistretning, og du vælger selv, om du vil gå videre."
  ],
  [
    "Du beskriver opgaven. Naetwork gør den klarere. Du vælger næste skridt. Specialisten udfører arbejdet direkte med dig.",
    "Du beskriver opgaven. Naetwork analyserer og gør den klarere. Du finder den rette specialist for dig eller din virksomhed. Specialisten udfører arbejdet direkte med dig."
  ],
  ["Du vælger selv næste skridt", "Find rette specialist"],
  [
    "“Jeg skal bruge hjælp til min hjemmeside.”",
    "“Jeg skal bruge hjælp til min hjemmeside. Den føles ikke særlig flot, den er lidt uoverskuelig, og jeg får ikke nok henvendelser.”"
  ],
  [
    "For bredt til at vælge den rigtige specialist.",
    "En helt normal start, men stadig for upræcis til at vælge den rigtige specialist eller scope opgaven korrekt."
  ],
  ["Efter Naetwork", "Efter Naetwork-analysen"]
];

function replaceTextNodes() {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();

  while (node) {
    if (node instanceof Text) nodes.push(node);
    node = walker.nextNode();
  }

  for (const textNode of nodes) {
    let value = textNode.nodeValue || "";
    for (const [from, to] of textReplacements) {
      if (value.includes(from)) value = value.replaceAll(from, to);
    }
    if (textNode.nodeValue !== value) textNode.nodeValue = value;
  }
}

function upgradeAfterNaetworkCard() {
  if (typeof document === "undefined") return;

  const headings = Array.from(document.querySelectorAll("p"));
  const afterHeading = headings.find((element) => element.textContent?.trim() === "Efter Naetwork-analysen");
  if (!afterHeading) return;

  const card = afterHeading.closest("div[class*='bg-[#071527]']") as HTMLDivElement | null;
  if (!card || card.dataset.naetworkAnalysisUpgraded === "true") return;

  card.dataset.naetworkAnalysisUpgraded = "true";
  card.innerHTML = `
    <p class="text-xs font-black uppercase tracking-[.18em] text-emerald-200">Efter Naetwork-analysen</p>
    <p class="mt-3 text-2xl font-black">Udsnit af den foreløbige brief</p>
    <div class="mt-5 grid gap-3 text-left">
      <div class="rounded-2xl bg-white/10 p-4">
        <p class="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Kort diagnose</p>
        <p class="mt-2 text-sm leading-6 text-white/75">Opgaven handler ikke kun om design. Den handler især om at gøre hjemmesiden mere overskuelig, mere troværdig og bedre til at få besøgende til at tage kontakt.</p>
      </div>
      <div class="rounded-2xl bg-white/10 p-4">
        <p class="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Scope</p>
        <p class="mt-2 text-sm leading-6 text-white/75">Forbedre forsidestruktur, visuel prioritering, teksthierarki og kontaktflow.</p>
      </div>
      <div class="grid gap-3 md:grid-cols-2">
        <div class="rounded-2xl bg-white/10 p-4">
          <p class="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Specialistretning</p>
          <p class="mt-2 text-sm leading-6 text-white/75">Hjemmeside-specialist med fokus på UX, tekst og konvertering.</p>
        </div>
        <div class="rounded-2xl bg-white/10 p-4">
          <p class="text-xs font-black uppercase tracking-[.14em] text-emerald-100">Næste spørgsmål</p>
          <p class="mt-2 text-sm leading-6 text-white/75">Hvilke henvendelser er mest værdifulde, og hvad skal besøgende gøre som næste handling?</p>
        </div>
      </div>
    </div>
  `;
}

function applyAnalysisProofCopy() {
  replaceTextNodes();
  upgradeAfterNaetworkCard();
}

export function NaetworkAnalysisProof() {
  useEffect(() => {
    applyAnalysisProofCopy();

    const observer = new MutationObserver(() => applyAnalysisProofCopy());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  return <NaetworkTrafficOptimized />;
}
