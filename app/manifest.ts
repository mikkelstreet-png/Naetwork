import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Naetwork - 60-minutters karrieresessioner',
    short_name: 'Naetwork',
    description: 'Konkret feedback fra fagpersoner, der kender branchen indefra.',
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
