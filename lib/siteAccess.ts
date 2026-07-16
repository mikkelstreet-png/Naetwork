export const SITE_ACCESS_COOKIE = 'naetwork_site_access';

export async function createSiteAccessCookieValue(secret: string) {
  const payload = new TextEncoder().encode(`naetwork-site-access:${secret}`);
  const digest = await crypto.subtle.digest('SHA-256', payload);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function normaliseNextPath(value: FormDataEntryValue | string | null | undefined) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  if (value === '/adgang' || value.startsWith('/adgang?') || value.startsWith('/api/site-access')) return '/';
  return value;
}
