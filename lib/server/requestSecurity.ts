function parseOrigin(value: string | null | undefined) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function configuredOrigins() {
  const configured = process.env.NEXT_PUBLIC_APP_URL
    ?? process.env.APP_BASE_URL
    ?? 'https://naetwork.dk';
  const canonical = parseOrigin(configured.startsWith('http') ? configured : `https://${configured}`);
  if (!canonical) return [];

  const origins = [canonical];
  const url = new URL(canonical);

  if (url.hostname === 'naetwork.dk') origins.push(`${url.protocol}//www.naetwork.dk${url.port ? `:${url.port}` : ''}`);
  if (url.hostname === 'www.naetwork.dk') origins.push(`${url.protocol}//naetwork.dk${url.port ? `:${url.port}` : ''}`);

  return origins;
}

export function isSameSiteRequest(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site')?.toLowerCase();
  if (fetchSite === 'cross-site') return false;

  const rawOrigin = request.headers.get('origin');

  // Some iOS in-app browsers submit ordinary same-site forms with Origin: null.
  // Sec-Fetch-Site still lets us reject explicit cross-site submissions above.
  if (!rawOrigin || rawOrigin === 'null') return true;

  const origin = parseOrigin(rawOrigin);
  if (!origin) return false;

  const requestOrigin = new URL(request.url).origin;
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https';
  const forwardedOrigin = forwardedHost ? parseOrigin(`${forwardedProto}://${forwardedHost}`) : null;
  const allowedOrigins = new Set([requestOrigin, forwardedOrigin, ...configuredOrigins()].filter(Boolean));

  return allowedOrigins.has(origin);
}
