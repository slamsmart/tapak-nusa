import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'Tapak Nusa — Jelajah Budaya Indonesia',
    short_name: 'Tapak Nusa',
    description:
      'Petualangan interaktif untuk menjelajahi dan mempelajari budaya Indonesia melalui peta, cerita, dan kuis.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['standalone', 'minimal-ui'],
    orientation: 'portrait-primary',
    background_color: '#ffffff',
    theme_color: '#df2029',
    lang: 'id',
    dir: 'ltr',
    categories: ['education', 'travel', 'reference'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'Peta budaya',
        short_name: 'Peta',
        url: '/?view=map',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Cerita budaya',
        short_name: 'Cerita',
        url: '/?view=stories',
        icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }],
      },
    ],
  }
}
