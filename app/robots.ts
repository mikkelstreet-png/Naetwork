import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';
  const siteUrl = base.startsWith('http') ? base : `https://${base}`;
  const accessGateEnabled = Boolean(process.env.SITE_ACCESS_CODE && process.env.SITE_ACCESS_TOKEN);

  if (accessGateEnabled) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/dashboard', '/profil', '/auth', '/api', '/login', '/signup', '/forgot-password', '/reset-password'] },
    ],
    sitemap: `${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  };
}
