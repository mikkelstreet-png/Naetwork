import { NextRequest } from 'next/server';
import { normaliseNextPath } from '@/lib/siteAccess';

export const dynamic = 'force-dynamic';

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

export async function GET(request: NextRequest) {
  const nextPath = normaliseNextPath(request.nextUrl.searchParams.get('next'));
  const error = request.nextUrl.searchParams.get('error');
  const errorMessage = error === 'rate_limited'
    ? 'For mange forsøg. Vent 10 minutter, og prøv igen.'
    : error === 'invalid'
      ? 'Koden er ikke korrekt. Prøv igen.'
      : '';

  const html = `<!doctype html>
<html lang="da">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow, noarchive">
    <meta name="theme-color" content="#09090b">
    <title>Privat adgang · Naetwork</title>
    <style>
      * { box-sizing: border-box; }
      html, body { min-height: 100%; }
      body { margin: 0; background: #09090b; color: #fff; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; -webkit-font-smoothing: antialiased; }
      .shell { min-height: 100svh; display: grid; grid-template-rows: auto 1fr auto; }
      .topbar { display: flex; align-items: center; min-height: 72px; padding: 0 7vw; background: #fff; color: #09090b; }
      .brand { display: inline-flex; align-items: center; gap: 13px; font-size: 18px; font-weight: 750; letter-spacing: -.02em; }
      .mark { position: relative; display: grid; width: 44px; height: 44px; place-items: center; overflow: hidden; border-radius: 4px; background: #09090b; color: #fff; font-size: 13px; font-weight: 700; }
      .mark::after { position: absolute; inset: auto 0 0; height: 3px; background: linear-gradient(90deg, #86e5ed 0 25%, #a4e5bf 25% 50%, #abc8ee 50% 75%, #dce99b 75%); content: ""; }
      main { position: relative; display: grid; place-items: center; overflow: hidden; padding: clamp(48px, 8vw, 96px) 24px; }
      main::after { position: absolute; right: -12vw; bottom: -42%; width: min(75vw, 980px); height: min(75vw, 980px); border: 2px solid rgba(164,229,191,.28); border-radius: 50%; box-shadow: 0 0 110px rgba(164,229,191,.11); content: ""; transform: rotate(-12deg) scaleY(.34); }
      .panel { position: relative; z-index: 1; width: min(100%, 520px); }
      .eyebrow { margin: 0 0 18px; color: #a8a8ad; font-size: 12px; font-weight: 700; letter-spacing: .07em; text-transform: uppercase; }
      h1 { max-width: 12ch; margin: 0; font-size: clamp(44px, 7vw, 76px); font-weight: 570; letter-spacing: -.055em; line-height: .96; }
      .intro { max-width: 43ch; margin: 26px 0 34px; color: #b8b8bc; font-size: 17px; line-height: 1.65; }
      form { display: grid; gap: 14px; }
      label { font-size: 14px; font-weight: 700; }
      input { width: 100%; min-height: 56px; border: 1px solid #55565a; border-radius: 4px; background: #151517; color: #fff; padding: 0 17px; font: inherit; outline: none; }
      input:focus { border-color: #fff; box-shadow: 0 0 0 3px rgba(255,255,255,.15); }
      button { min-height: 56px; border: 0; border-radius: 4px; background: #fff; color: #09090b; padding: 0 20px; font: inherit; font-weight: 800; cursor: pointer; }
      button:hover { background: #e8e8e5; }
      button:focus-visible { outline: 2px solid #fff; outline-offset: 4px; }
      .error { min-height: 22px; margin: 0; color: #f3b5b5; font-size: 14px; line-height: 1.5; }
      .rail { display: grid; grid-template-columns: repeat(4, 1fr); height: 4px; }
      .rail span:nth-child(1) { background: #86e5ed; }
      .rail span:nth-child(2) { background: #a4e5bf; }
      .rail span:nth-child(3) { background: #abc8ee; }
      .rail span:nth-child(4) { background: #dce99b; }
      @media (max-width: 600px) { .topbar { min-height: 64px; padding: 0 20px; } .mark { width: 38px; height: 38px; } main { place-items: start center; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="topbar"><div class="brand"><span class="mark" aria-hidden="true">N</span><span>Naetwork</span></div></header>
      <main>
        <section class="panel" aria-labelledby="access-title">
          <p class="eyebrow">Privat forhåndsvisning</p>
          <h1 id="access-title">Adgang til Naetwork.</h1>
          <p class="intro">Siden er adgangsbeskyttet. Indtast koden for at fortsætte til Naetwork.</p>
          <form method="post" action="/api/site-access">
            <input type="hidden" name="next" value="${escapeHtml(nextPath)}">
            <label for="code">Adgangskode</label>
            <input id="code" name="code" type="password" autocomplete="current-password" required autofocus aria-describedby="access-error">
            <p class="error" id="access-error" aria-live="polite">${escapeHtml(errorMessage)}</p>
            <button type="submit">Åbn Naetwork</button>
          </form>
        </section>
      </main>
      <div class="rail" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    </div>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'Content-Type': 'text/html; charset=utf-8',
      'Referrer-Policy': 'no-referrer',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
    },
  });
}
