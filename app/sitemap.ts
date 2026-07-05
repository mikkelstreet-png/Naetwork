import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';
  const siteUrl = (base.startsWith('http') ? base : `https://${base}`).replace(/\/$/, '');
  const routes = [
    '', '/professionals', '/match', '/professional/signup', '/mission', '/impact', '/contact',
    '/fields/ai', '/fields/banking', '/fields/consulting', '/fields/private-equity',
    '/terms', '/privacy', '/cookies',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date('2026-06-30'),
    changeFrequency: route === '' || route === '/professionals' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/professionals' ? 0.9 : 0.6,
  }));
}
