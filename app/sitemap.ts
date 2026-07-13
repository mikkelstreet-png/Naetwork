import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_BASE_URL ?? 'https://naetwork.dk';
  const siteUrl = (base.startsWith('http') ? base : `https://${base}`).replace(/\/$/, '');
  const routes = [
    '', '/start', '/how-it-works', '/sessions', '/explore', '/prepare', '/apply', '/perform',
    '/professionals', '/professional/signup', '/mission', '/impact', '/contact',
    '/fields/ai', '/fields/banking', '/fields/consulting', '/fields/private-equity',
    '/terms', '/privacy', '/cookies', '/afbestilling',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date('2026-07-13'),
    changeFrequency: route === '' || route === '/start' || route === '/sessions' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/start' ? 0.9 : route === '/sessions' ? 0.8 : 0.6,
  }));
}
