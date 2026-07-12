# Phase 1: Positioning, brand and information architecture

## Product definition

Naetwork gives people access to relevant experience behind the roles, companies and career paths they are considering.

Category: Career Access.

Primary line: Know more before your next move.

Product line: Meet someone who knows the job before you apply.

Positioning: The access layer behind better career decisions.

## Information architecture

The public journey starts at `/start` with a concrete situation. Four lightweight paths organize the product without becoming separate products:

- `/explore`: roles, companies, industries and career paths.
- `/prepare`: current position, materials and career changes.
- `/apply`: a specific role or application.
- `/perform`: interviews, cases, negotiations and offers.

Supporting routes:

- `/how-it-works`: the three-step Career Access model.
- `/sessions`: outcome-led session concepts.
- `/professionals`: a downstream directory reached after situation and field selection.
- `/impact`: the transparent contribution model.
- `/professional/signup`: the professional entry point.

Legacy `/match` and `/onboarding` routes redirect within the application flow to `/start`.

## Content principles

- Start with the decision, not the professional.
- Describe relevance through actual experience, not status or popularity.
- Sell clarity and next steps, not an hour of time.
- Use one primary line and at most one supporting line on a surface.
- Avoid coaching, mentoring, networking and marketplace framing.
- Keep impact concrete and transparent without making it the primary product value.

## Phase boundaries

Phase 1 defines routes, hierarchy, terminology, SEO and the situation-first entry. It does not implement advanced matching, payment, document handling, complete onboarding, post-session delivery or visual special features.

## Deployment impact

All new routes are static or client-only public routes. Phase 1 requires no database migration, API change or new environment variable. Existing booking, auth and profile contracts remain unchanged.

## Definition of done

- Career Access is explicit and explainable in one sentence.
- The primary journey starts with the user's situation.
- Navigation exposes How it works, Sessions, For professionals, Impact, Sign in and Start with your situation.
- Explore, Prepare, Apply and Perform have canonical routes.
- Central public copy, metadata, sitemap and redirects use the same positioning.
- Danish and English express the same product principles.
- Content audit, typecheck, production build and responsive E2E tests pass.
- The phase commit is deployed to preview and verified before phase 2 begins.
