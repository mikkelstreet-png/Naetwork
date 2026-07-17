import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naetwork - den professionelle adgangsplatform',
    short_name: 'Naetwork',
    description: 'Relevant professionel erfaring, når den betyder mest.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#ffffff',
    lang: 'da',
    icons: [
      {
        src: '/naetwork-logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  }
}
