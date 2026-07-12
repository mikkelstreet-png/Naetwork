import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naetwork - Karrieresparring med mening',
    short_name: 'Naetwork',
    description: '60 minutters fokuseret karrieresparring med gennemgåede professionelle.',
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
