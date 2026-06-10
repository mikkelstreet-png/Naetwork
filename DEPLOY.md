# Deploy — Naetwork

## Already done
The repository was created and pushed via the GitHub API.

## Remaining: Vercel (one time, ~1 minute)
1. Go to https://vercel.com → **Continue with GitHub**.
2. **Add New… → Project** → import the `naetwork` repository.
3. Vercel auto-detects Next.js — keep all defaults → **Deploy**.
4. Live at `https://naetwork.vercel.app` (or similar). English at `/`, Danish at `/da`.

Every future `git push` (or file edit committed on github.com) redeploys automatically.

## Before real go-live (lib/content.ts)
- `donateUrl`: the real MobilePay link.
- `formEndpoint`: a Formspree endpoint so booking/interest submissions reach your inbox.
- `url`: your final domain (fixes sitemap + share links).

## Security
Revoke the deploy token at github.com → Settings → Developer settings →
Personal access tokens as soon as the push is confirmed.
