# Phase 2 design system

## Direction

Naetwork uses an **Architectural Access** design language. The interface is primarily black, white and neutral grey. A four-colour spectrum is only revealed through openings, rails and active states. This keeps the product calm while making the idea of access recognisable without the logo.

The system is designed around three product movements:

1. A situation is stated.
2. Relevant experience is revealed.
3. A concrete next step becomes available.

## Core tokens

The canonical tokens live in `app/globals.css`.

- Ink: `#09090b`
- Paper: `#fdfdfb`
- Canvas: `#f1f1ec`
- Lines: `#deded8` and `#c8c8c0`
- Spectrum: cyan `#86e5ed`, mint `#a4e5bf`, blue `#abc8ee`, lime `#dce99b`
- Control radius: `4px`
- Panel radius: `6px`
- Motion curve: `cubic-bezier(0.2, 0.7, 0.2, 1)`
- Content width: `82rem`

The spectrum is not a general decoration. It identifies an opening, a selected path, a contribution connection or a transition between information states.

## Typography

- Space Grotesk carries headings and decisive product statements.
- Inter carries body text, controls and operational content.
- JetBrains Mono carries short system labels, sequence numbers and metadata.
- Text sizes use controlled jumps and explicit line lengths. Font sizes do not scale directly with viewport width.

## Components

### Interactive Access Hero

`AccessHero` previews the product before account creation. Five recognisable situations update the experience Naetwork would look for. It uses real navigation links and makes no match percentage or AI claim.

Fallback: the default interview state is complete and understandable without interaction.

Mobile: choices become a horizontally scrollable control while the result remains visible in the first viewport.

Reduced motion: all transitions collapse to `0.01ms` through the global media query.

### Public Page Hero

`PublicPageHero` gives `/start`, `/how-it-works`, `/sessions`, `/explore`, `/prepare`, `/apply` and `/perform` a shared entry grammar. The image is revealed through an architectural opening; page-specific content remains on a high-contrast ink surface.

### Living Impact Line

`LivingImpactLine` connects the selected VAT-inclusive price to the VAT-exclusive basis and the exact 40-90% contribution range. It uses no fabricated platform totals.

### Navigation

The primary navigation uses plain labels, one active-state rule and one decisive situation-first action. Decorative sequence numbers were removed to reduce noise.

## Interaction rules

- Motion explains state changes or relationships only.
- No scroll locking, parallax or delayed navigation.
- Hover movement is limited to one to three pixels.
- Focus remains visible on every interactive element.
- Touch targets are at least 44px on compact layouts.
- Interactive controls expose pressed state and unique accessible names.

## Performance budget

- No new runtime or animation dependencies.
- The 16KB spectrum is served as `/public/naetwork-spectrum.webp`; it is no longer embedded in the client JavaScript bundle.
- Hero interactivity uses React state and CSS transitions only.
- Decorative media is non-blocking outside the homepage hero.
- No layout shift is introduced by the image because every hero has stable geometry.

## Phase boundary

This phase changes visual language, public-page composition and presentational interactions only. Candidate and professional profile models, onboarding data, matching, booking, payment and post-session logic remain outside Phase 2.
