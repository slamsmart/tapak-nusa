import type { CollectionSlug, Payload } from 'payload'
import type { ReactNode } from 'react'
import type { Admin } from '../payload-types'
import './tapak-nusa-admin.css'

function TapakNusaMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`tapak-admin-mark${compact ? ' is-compact' : ''}`} aria-hidden>
      <svg viewBox="0 0 32 32">
        <path d="m4.3 8.2 3-2.3 3.1 2.8-1.3 4.2-2.4 2.3-2.3-3.4Z" />
        <path d="m12.5 8.2 4.2-2 3.7 2.8-.8 4.8-4 1.2-3.2-2.3Z" />
        <path d="m22 9 2-2 1.7 2.1-1.1 2 2 1.2-1.1 3.6-2.1-2-2.2 1.3.7-3-1.5-1.1Z" />
        <path d="M6.8 19.2c4.8-1.1 9.8-.7 14.2.8l-1.3 2.6c-4.2-.9-8.3-1.2-12.2-.5Z" />
        <path d="m23.2 19.2 4.2-1.7.9 2.4-2 2.4-3.7.2-1-1.8Z" />
        <path
          className="tapak-admin-mark__route"
          d="M5.6 24.8c4.8-3 8.9-4.2 12.3-3.7 3.2.4 5.8-.4 8-2.4"
        />
        <circle cx="5.5" cy="24.8" r="1.8" />
        <circle cx="26.1" cy="18.6" r="1.4" />
      </svg>
    </span>
  )
}

export function TapakNusaAdminLogo() {
  return (
    <span className="tapak-admin-logo">
      <TapakNusaMark />
      <strong>
        Tapak
        <br />
        Nusa
      </strong>
    </span>
  )
}

export function TapakNusaAdminIcon() {
  return <TapakNusaMark compact />
}

type StatCard = {
  slug: CollectionSlug
  label: string
  glyph: ReactNode
}

const statCards: StatCard[] = [
  {
    slug: 'culture-entries',
    label: 'Kultur budaya',
    glyph: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 1.5Z" />
        <path d="M9 7h6M9 11h6" />
      </svg>
    ),
  },
  {
    slug: 'culture-cards',
    label: 'Kartu budaya',
    glyph: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="6" width="15" height="13" rx="2" />
        <path d="M8 3h11a2 2 0 0 1 2 2v11" />
      </svg>
    ),
  },
  {
    slug: 'provinces',
    label: 'Provinsi',
    glyph: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    slug: 'quiz-questions',
    label: 'Pertanyaan kuis',
    glyph: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.3a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2-2.5 3.6" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    slug: 'media',
    label: 'Media',
    glyph: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m21 16-4.5-4.5L9 19" />
      </svg>
    ),
  },
]

export async function TapakNusaAdminDashboard({
  payload,
  user,
}: {
  payload: Payload
  user: Admin | null
}) {
  const counts = await Promise.all(
    statCards.map(async (card) => {
      try {
        const { totalDocs } = await payload.count({
          collection: card.slug,
          overrideAccess: false,
          user,
        })
        return totalDocs
      } catch {
        return null
      }
    }),
  )

  return (
    <section className="tapak-admin-dashboard">
      <div className="tapak-admin-dashboard__head">
        <div className="tapak-admin-dashboard__copy">
          <span className="tapak-admin-dashboard__eyebrow">Pusat kendali budaya</span>
          <h1>Kelola jejak Nusantara dari satu tempat.</h1>
          <p className="tapak-admin-dashboard__lede">
            Tinjau kultur budaya, kartu, pertanyaan kuis, dan pustaka media dalam satu tampilan.
          </p>
        </div>
        <div className="tapak-admin-dashboard__actions">
          <a href="/admin/collections/culture-entries">Kelola kultur budaya</a>
          <a href="/admin/collections/media">Buka pustaka media</a>
        </div>
      </div>
      <ul className="tapak-admin-dashboard__stats" aria-label="Ringkasan isi Tapak Nusa">
        {statCards.map((card, index) => (
          <li key={card.slug}>
            <a className="tapak-stat" href={`/admin/collections/${card.slug}`}>
              <span className="tapak-stat__glyph" aria-hidden="true">
                {card.glyph}
              </span>
              <span className="tapak-stat__meta">
                <b className="tapak-stat__count">{counts[index] ?? '—'}</b>
                <span className="tapak-stat__label">{card.label}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
