# Phase 2 design system

## Direction

Naetwork uses an **Architectural Access** design language. The interface is primarily black, white and neutral grey. A restrained cyan, mint, blue and lime spectrum appears through the hero aperture, the start panel and four fully coloured situation cards. Colour identifies a meaningful choice; it is not ambient decoration.

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
- Inter carries labels and metadata. Monospace typography is reserved for rare system data where it improves scanning.
- Text sizes use controlled jumps and explicit line lengths. Font sizes do not scale directly with viewport width.

## Components

### Access Hero

`AccessHero` is intentionally non-interactive. One brand truth, one concrete explanation, one primary action and three practical facts carry the first screen. The spectrum remains visible as an architectural opening, while the situation selector begins in the next section where the user expects to make a choice.

This separation keeps positioning and product interaction from competing for attention. The hero makes no match percentage, AI or outcome claim.

Mobile: the primary action spans the content width, the secondary action becomes a text link, practical facts stack, and the next section remains visible at 375 x 667.

Reduced motion: all transitions collapse to `0.01ms` through the global media query.

### Public Page Hero

`PublicPageHero` gives `/start`, `/how-it-works`, `/sessions`, `/explore`, `/prepare`, `/apply`, `/perform` and `/impact` a shared but compact entry grammar. Page-specific copy leads; the spectrum remains a supporting aperture rather than the subject.

### Editorial sections

Public pages use ledger rows, restrained rules and asymmetric headings instead of repeated card grids. The homepage moves from the brand truth to the user's situation, relevant experience, session outcomes, process and transparent pricing without a duplicate positioning section.

### Living Impact Line

`LivingImpactLine` connects the selected VAT-inclusive price to the VAT-exclusive basis and the fixed 20/30/50 split. It shows the exact Naetwork, Kræftens Bekæmpelse and professional amounts without fabricated platform totals.

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
- The hero has no client-side interaction or animation dependency.
- Decorative media is non-blocking outside the homepage hero.
- No layout shift is introduced by the image because every hero has stable geometry.

## Phase boundary

This phase changes visual language, public-page composition and presentational interactions only. Candidate and professional profile models, onboarding data, matching, booking, payment and post-session logic remain outside Phase 2.
