import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naetwork - Career Access',
    short_name: 'Naetwork',
    description: 'Adgang til relevant erfaring bag bedre karrierevalg.',
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
