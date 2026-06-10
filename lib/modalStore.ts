"use client";

import { useSyncExternalStore } from "react";

export type Intent = "candidate" | "professional" | "company";

type State = { open: boolean; intent: Intent; preset: string | null };

let state: State = { open: false, intent: "candidate", preset: null };
const listeners = new Set<() => void>();

function emit() {
  state = { ...state };
  listeners.forEach((l) => l());
}

export function openModal(intent: Intent, preset: string | null = null) {
  state = { open: true, intent, preset };
  emit();
}

export function closeModal() {
  state = { ...state, open: false };
  emit();
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

const serverSnapshot: State = { open: false, intent: "candidate", preset: null };

export function useModal(): State {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => serverSnapshot,
  );
}
