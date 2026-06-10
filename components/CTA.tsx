"use client";

import { ArrowRight } from "lucide-react";
import { openModal, type Intent } from "@/lib/modalStore";

type Props = {
  children: React.ReactNode;
  className?: string;
  intent?: Intent;
  preset?: string | null;
  href?: string;
  arrow?: boolean;
};

export function CTA({
  children,
  className = "btn-pine",
  intent = "candidate",
  preset = null,
  href,
  arrow = false,
}: Props) {
  if (href) {
    return (
      <a href={href} className={className}>
        {children}
        {arrow && <ArrowRight size={16} />}
      </a>
    );
  }
  return (
    <button
      type="button"
      className={className}
      onClick={() => openModal(intent, preset)}
    >
      {children}
      {arrow && <ArrowRight size={16} />}
    </button>
  );
}
