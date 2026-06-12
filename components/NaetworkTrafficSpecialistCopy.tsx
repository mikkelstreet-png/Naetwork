'use client';

import { useEffect } from "react";
import { NaetworkTrafficOptimized } from "@/components/NaetworkTrafficOptimized";

const replacements: Array<[string, string]> = [
  [
    "Vælg næste skridt",
    "Find den rette specialist"
  ],
  [
    "Du vælger selv, om opgaven skal videre til en specialist. Ingen binding på første trin.",
    "Find den rette specialist for dig eller din virksomhed. Naetwork peger på en relevant specialistretning, og du vælger selv, om du vil gå videre."
  ],
  [
    "Du beskriver opgaven. Naetwork gør den klarere. Du vælger næste skridt. Specialisten udfører arbejdet direkte med dig.",
    "Du beskriver opgaven. Naetwork gør den klarere. Du finder den rette specialist for dig eller din virksomhed. Specialisten udfører arbejdet direkte med dig."
  ],
  [
    "Du vælger selv næste skridt",
    "Find rette specialist"
  ]
];

function applyCopyFixes() {
  if (typeof document === "undefined") return;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let current = walker.nextNode();

  while (current) {
    if (current instanceof Text) textNodes.push(current);
    current = walker.nextNode();
  }

  for (const node of textNodes) {
    let value = node.nodeValue || "";
    for (const [from, to] of replacements) {
      if (value.includes(from)) value = value.replaceAll(from, to);
    }
    if (node.nodeValue !== value) node.nodeValue = value;
  }
}

export function NaetworkTrafficSpecialistCopy() {
  useEffect(() => {
    applyCopyFixes();

    const observer = new MutationObserver(() => applyCopyFixes());
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  return <NaetworkTrafficOptimized />;
}
