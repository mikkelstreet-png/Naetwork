'use client';

import { useEffect } from "react";

const unclearLabels = new Map([
  ["Start kort", "Opret opgave"],
  ["Start her", "Opret opgave"],
  ["Start med en kort beskrivelse", "Opret opgave"],
  ["Start med egen opgave", "Opret opgave"],
  ["Start med kort beskrivelse", "Opret opgave"]
]);

function relabelButtons() {
  document.querySelectorAll("button, a").forEach((element) => {
    const text = element.textContent?.trim() || "";
    const next = unclearLabels.get(text);
    if (next) element.textContent = next;
  });
}

function addLoginLink() {
  const header = document.querySelector("header");
  if (!header) return;
  if (header.querySelector('[data-naetwork-login-link="true"]')) return;

  const actionArea = header.querySelector("div.flex.shrink-0.items-center.gap-2");
  if (!actionArea) return;

  const link = document.createElement("a");
  link.href = "/access";
  link.textContent = "Log ind";
  link.setAttribute("data-naetwork-login-link", "true");
  link.className = "inline-flex min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300";

  actionArea.insertBefore(link, actionArea.firstChild);
}

function polishHeader() {
  relabelButtons();
  addLoginLink();
}

export function NaetworkHeaderClarityFix() {
  useEffect(() => {
    polishHeader();
    const observer = new MutationObserver(polishHeader);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
