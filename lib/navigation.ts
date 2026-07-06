export function safeInternalPath(value: string | null | undefined, fallback = '/dashboard') {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;

  try {
    const base = new URL('https://naetwork.invalid');
    const resolved = new URL(value, base);
    if (resolved.origin !== base.origin) return fallback;
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}

export function isBilingualPublicRoute(pathname: string) {
  return pathname === '/'
    || pathname === '/match'
    || pathname === '/impact'
    || pathname === '/mission'
    || pathname === '/contact'
    || pathname.startsWith('/fields/')
    || pathname.startsWith('/professionals')
}
