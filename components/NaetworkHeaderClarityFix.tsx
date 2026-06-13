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

function addHeaderActions() {
  const header = document.querySelector("header");
  if (!header) return;

  const actionArea = header.querySelector("div.flex.shrink-0.items-center.gap-2");
  if (!actionArea) return;

  const existingPrimary = Array.from(actionArea.querySelectorAll("button")).find((button) => {
    const text = button.textContent?.trim() || "";
    return text === "Opret opgave" || text === "Start kort" || text === "Start her";
  });

  if (existingPrimary instanceof HTMLElement) {
    existingPrimary.style.display = "none";
    existingPrimary.setAttribute("aria-hidden", "true");
  }

  if (!header.querySelector('[data-naetwork-login-link="true"]')) {
    const login = document.createElement("a");
    login.href = "/login";
    login.textContent = "Log ind";
    login.setAttribute("data-naetwork-login-link", "true");
    login.className = "hidden min-h-[46px] items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm transition hover:border-slate-300 sm:inline-flex";
    actionArea.insertBefore(login, actionArea.firstChild);
  }

  if (!header.querySelector('[data-naetwork-create-link="true"]')) {
    const create = document.createElement("a");
    create.href = "/opret";
    create.textContent = "Opret bruger";
    create.setAttribute("data-naetwork-create-link", "true");
    create.className = "inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#071527] px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#0b203a]";
    const menuButton = Array.from(actionArea.querySelectorAll("button")).find((button) => button.textContent?.trim() === "Menu");
    if (menuButton) actionArea.insertBefore(create, menuButton);
    else actionArea.appendChild(create);
  }
}

function polishHeader() {
  relabelButtons();
  addHeaderActions();
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
