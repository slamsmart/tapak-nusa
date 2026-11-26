'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'

import type {
  SiteAdventure as Adventure,
  SiteCard as CultureCard,
  SiteContent,
  SiteProvince as Province,
  SiteQuestion as QuizQuestion,
} from '@/lib/content'
import { premiumPlans, type PremiumPlan } from '@/lib/premium'
import NusaDashboard, { type DashboardTab } from './nusa-dashboard'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme: 'light'
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        },
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

type View = 'map' | 'collection' | 'rank' | 'profile'
type PublicPage = 'culture' | 'stories' | 'map'
type ProvinceState = Province & {
  status: 'done' | 'open'
  score: number | null
}

type DemoUser = {
  email: string
  name: string
}

type ClearedProvinces = Record<string, number>
type StreakState = { days: number; lastActive: string }
type DailyState = { date: string; answers: number }

const dailyTarget = 3

// The provinces ordered first in the CMS keep the full-size numbered pin; the
// rest render compact so the map stays readable.
const heroPinCount = 5

// Level thresholds double as the progress bar targets in the profile view.
const levelLadder = [
  { min: 0, title: 'Penjelajah' },
  { min: 60, title: 'Penjelajah' },
  { min: 250, title: 'Pujangga' },
  { min: 600, title: 'Penjaga Cerita' },
]

function levelFor(xp: number) {
  let index = 0
  for (let i = 0; i < levelLadder.length; i += 1) {
    if (xp >= levelLadder[i].min) index = i
  }
  const next = levelLadder[index + 1]
  return {
    level: index + 1,
    title: levelLadder[index].title,
    nextTitle: next?.title ?? null,
    nextAt: next?.min ?? null,
  }
}

const monthAbbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]

function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

function previousDayKey() {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return dayKey(date)
}

function currentWeekLabel(now = new Date()) {
  const start = new Date(now)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  return `${start.getDate()} ${monthAbbr[start.getMonth()]}–${end.getDate()} ${monthAbbr[end.getMonth()]}`
}

const ranking = [
  ['1', 'LangitSenja', '1.240'],
  ['2', 'RimbaRaya', '1.185'],
  ['3', 'PuspaNusa', '1.070'],
  ['4', 'JejakPagi', '940'],
  ['5', 'KelanaKita', '875'],
]

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    map: (
      <>
        <path d="m3 6 5-2 8 3 5-2v14l-5 2-8-3-5 2Z" />
        <path d="M8 4v14m8-11v14" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5Z" />
        <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5Z" />
      </>
    ),
    rank: (
      <>
        <path d="M8 21V10h4v11M3 21v-6h4v6m10 0V4h4v17" />
        <path d="M2 21h20" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    flame: (
      <path d="M12 22c4 0 7-3 7-7 0-3-2-6-5-9 0 3-2 4-3 5 0-3-1-6-3-9 0 5-3 7-3 12 0 4 3 8 7 8Z" />
    ),
    star: <path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8L12 17.3l-6.3 3.2L7 13.7 2 8.9 9 8Z" />,
    lock: (
      <>
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    back: <path d="m15 18-6-6 6-6" />,
    trophy: (
      <>
        <path d="M8 4h8v5a4 4 0 0 1-8 0Z" />
        <path d="M8 6H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v5m-4 3h8" />
      </>
    ),
    dance: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="m10 7-3 4-4-1m11-3 3 4 4-1M9 12l3 2 3-2m-3 2-2 7m2-7 3 7" />
      </>
    ),
    house: (
      <>
        <path d="m3 11 9-7 9 7" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    food: (
      <>
        <path d="M4 11h16a8 8 0 0 1-16 0Z" />
        <path d="M8 7c0-2 2-2 2-4m4 4c0-2 2-2 2-4M3 21h18" />
      </>
    ),
    attire: <path d="m8 4 4 2 4-2 5 4-3 4-2-2v11H8V10l-2 2-3-4Z" />,
    tradition: (
      <>
        <path d="M12 21V10m0 7c-5 0-8-3-8-7 5 0 8 3 8 7Zm0-4c4 0 7-3 7-7-4 0-7 3-7 7Z" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  )
}

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <svg viewBox="0 0 32 32" aria-hidden>
          <path className="logo-island" d="m4.3 8.2 3-2.3 3.1 2.8-1.3 4.2-2.4 2.3-2.3-3.4Z" />
          <path className="logo-island" d="m12.5 8.2 4.2-2 3.7 2.8-.8 4.8-4 1.2-3.2-2.3Z" />
          <path
            className="logo-island"
            d="m22 9 2-2 1.7 2.1-1.1 2 2 1.2-1.1 3.6-2.1-2-2.2 1.3.7-3-1.5-1.1Z"
          />
          <path
            className="logo-island"
            d="M6.8 19.2c4.8-1.1 9.8-.7 14.2.8l-1.3 2.6c-4.2-.9-8.3-1.2-12.2-.5Z"
          />
          <path className="logo-island" d="m23.2 19.2 4.2-1.7.9 2.4-2 2.4-3.7.2-1-1.8Z" />
          <path className="logo-trail" d="M5.6 24.8c4.8-3 8.9-4.2 12.3-3.7 3.2.4 5.8-.4 8-2.4" />
          <circle cx="5.5" cy="24.8" r="1.8" />
          <circle cx="26.1" cy="18.6" r="1.4" />
        </svg>
      </span>
      <span>
        Tapak
        <br />
        Nusa
      </span>
    </div>
  )
}

function SupportBadge() {
  return (
    <aside className="support-badge" aria-label="Didukung oleh Budaya Go dan Puspresnas">
      <span>Supported by</span>
      <img
        src="/images/supported-by-budaya-go-puspresnas.png"
        alt="Budaya Go dan Terkurasi Puspresnas"
        width="250"
        height="49"
      />
    </aside>
  )
}

function DemoAuthModal({
  currentUser,
  onClose,
  onSuccess,
  onSignOut,
}: {
  currentUser: DemoUser | null
  onClose: () => void
  onSuccess: (user: DemoUser) => void
  onSignOut: () => void
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [scriptReady, setScriptReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!scriptReady || !siteKey || !window.turnstile || !turnstileRef.current || currentUser)
      return

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      theme: 'light',
      callback: (value) => {
        setToken(value)
        setError('')
      },
      'expired-callback': () => setToken(''),
      'error-callback': () => {
        setToken('')
        setError('Verifikasi keamanan gagal dimuat. Coba segarkan tantangan.')
      },
    })

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [currentUser, scriptReady, siteKey])

  async function submitDemoAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const normalizedEmail = email.trim().toLowerCase()

    if (!/^[^\s@]+@gmail\.com$/i.test(normalizedEmail)) {
      setError('Gunakan alamat Gmail yang valid, misalnya nama@gmail.com.')
      return
    }
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Masukkan nama penjelajah minimal 2 karakter.')
      return
    }
    if (!token) {
      setError('Selesaikan verifikasi Cloudflare terlebih dahulu.')
      return
    }

    setBusy(true)
    try {
      const response = await fetch('/api/turnstile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const result = (await response.json()) as { success?: boolean; error?: string }
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Verifikasi Cloudflare belum berhasil.')
      }

      onSuccess({
        email: normalizedEmail,
        name: mode === 'signup' ? name.trim() : normalizedEmail.split('@')[0],
      })
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Tidak dapat melanjutkan masuk.')
      if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current)
      setToken('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop auth-backdrop" onMouseDown={onClose}>
      <div className="demo-auth-modal" onMouseDown={(event) => event.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Tutup dialog akun">
          ×
        </button>
        <div className="auth-brand">
          <Logo />
          <span>Mode demo</span>
        </div>
        {currentUser ? (
          <div className="auth-account">
            <span className="google-mark">G</span>
            <p className="eyebrow">Akun penjelajah aktif</p>
            <h2>{currentUser.name}</h2>
            <p>{currentUser.email}</p>
            <small>
              Akun demo tersimpan hanya di browser ini dan tidak terhubung ke akun Google asli.
            </small>
            <button className="secondary" onClick={onSignOut}>
              Keluar dari akun demo
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">Akses platform Tapak Nusa</p>
            <h2>{mode === 'signin' ? 'Masuk dengan Gmail.' : 'Buat akun penjelajah.'}</h2>
            <p className="auth-intro">
              Simulasi akun untuk memulai kuis. Kami tidak meminta kata sandi dan tidak terhubung ke
              Google OAuth.
            </p>
            <div className="auth-tabs" role="tablist" aria-label="Pilih masuk atau daftar">
              <button
                role="tab"
                aria-selected={mode === 'signin'}
                className={mode === 'signin' ? 'active' : ''}
                onClick={() => {
                  setMode('signin')
                  setError('')
                }}
              >
                Sign in
              </button>
              <button
                role="tab"
                aria-selected={mode === 'signup'}
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
              >
                Sign up
              </button>
            </div>
            <form onSubmit={submitDemoAuth}>
              {mode === 'signup' && (
                <label>
                  <span>Nama penjelajah</span>
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama panggilan"
                    maxLength={30}
                    autoComplete="name"
                  />
                </label>
              )}
              <label>
                <span>Alamat Gmail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="nama@gmail.com"
                  autoComplete="email"
                  inputMode="email"
                />
              </label>
              <div className="turnstile-shell">
                {siteKey ? (
                  <div ref={turnstileRef} />
                ) : (
                  <p>Cloudflare Turnstile belum dikonfigurasi.</p>
                )}
              </div>
              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}
              <button className="google-auth-button" type="submit" disabled={busy || !siteKey}>
                <span className="google-mark">G</span>
                {busy
                  ? 'Memverifikasi...'
                  : mode === 'signin'
                    ? 'Lanjutkan dengan Gmail'
                    : 'Daftar dengan Gmail'}
              </button>
            </form>
            <p className="cloudflare-note">
              <Icon name="lock" size={13} /> Dilindungi oleh Cloudflare Turnstile
            </p>
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
              strategy="afterInteractive"
              onReady={() => setScriptReady(true)}
              onError={() => setError('Skrip keamanan Cloudflare tidak dapat dimuat.')}
            />
          </>
        )}
      </div>
    </div>
  )
}

function AboutLanding({
  authModal,
  onBack,
  onExplore,
  onCollection,
}: {
  authModal: React.ReactNode
  onBack: () => void
  onExplore: () => void
  onCollection: () => void
}) {
  const pillars = [
    {
      icon: 'map',
      title: 'Jelajah 38 provinsi',
      text: 'Pilih daerah melalui peta interaktif dan temukan pintu masuk ke budaya setempat.',
    },
    {
      icon: 'book',
      title: 'Belajar lewat cerita',
      text: 'Baca pengantar ringkas tentang busana, seni, arsitektur, tradisi, dan kuliner.',
    },
    {
      icon: 'star',
      title: 'Uji pemahaman',
      text: 'Selesaikan kuis bergambar, kumpulkan XP, dan bangun koleksi perjalanan budaya.',
    },
  ]

  return (
    <main className="about-landing">
      <header className="about-header">
        <button className="about-logo" onClick={onBack} aria-label="Kembali ke homepage">
          <Logo />
        </button>
        <button className="about-back" onClick={onBack}>
          <Icon name="back" size={16} /> Kembali ke homepage
        </button>
      </header>

      <section className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Tentang Tapak Nusa</p>
          <h1>
            Belajar budaya,
            <br />
            satu jejak setiap hari.
          </h1>
          <p>
            Tapak Nusa adalah platform pembelajaran interaktif untuk mengenal kekayaan budaya
            Indonesia melalui peta, kartu cerita, dan kuis yang ringan serta menyenangkan.
          </p>
          <div className="about-actions">
            <button className="about-primary" onClick={onExplore}>
              Mulai menjelajah <Icon name="arrow" size={15} />
            </button>
            <button className="about-secondary" onClick={onCollection}>
              Lihat koleksi 38 provinsi
            </button>
          </div>
        </div>
        <figure className="about-photo">
          <img
            src="https://images.unsplash.com/photo-1549431971-f54b3f5c82d8?auto=format&fit=crop&w=1400&q=88"
            alt="Anak Indonesia membaca lembar pembelajaran"
          />
          <figcaption>
            <span>Untuk generasi yang ingin tahu</span>
            <small>Foto: Husniati Salma / Unsplash</small>
          </figcaption>
        </figure>
      </section>

      <section className="about-platform">
        <div className="about-section-heading">
          <p className="eyebrow">Cara Tapak Nusa bekerja</p>
          <h2>Dari rasa ingin tahu menjadi perjalanan.</h2>
        </div>
        <div className="about-pillars">
          {pillars.map((pillar, index) => (
            <article key={pillar.title}>
              <span className="about-number">{String(index + 1).padStart(2, '0')}</span>
              <i>
                <Icon name={pillar.icon} size={22} />
              </i>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
        <p className="about-principle">
          Dibuat untuk menumbuhkan rasa ingin tahu, penghargaan terhadap keberagaman, dan kebiasaan
          belajar budaya dari sumber yang dicantumkan pada setiap materi.
        </p>
      </section>
      <SupportBadge />
      {authModal}
    </main>
  )
}

function PublicDiscoveryLanding({
  page,
  content,
  authModal,
  onBack,
  onDashboard,
}: {
  page: PublicPage
  content: SiteContent
  authModal: React.ReactNode
  onBack: () => void
  onDashboard: () => void
}) {
  const copy = {
    culture: {
      eyebrow: 'Budaya Nusantara',
      title: 'Ragam yang hidup, cerita yang terus diwariskan.',
      text: 'Kenali seni, rumah adat, kuliner, busana, dan tradisi sebagai pintu awal memahami keberagaman Indonesia.',
      action: 'Jelajahi budaya di dashboard',
    },
    stories: {
      eyebrow: 'Cerita budaya',
      title: 'Setiap daerah punya suara untuk didengarkan.',
      text: 'Tapak Nusa merangkum pengantar budaya dalam kartu singkat dengan sumber dan konteks yang mudah dipelajari.',
      action: 'Buka koleksi di dashboard',
    },
    map: {
      eyebrow: 'Peta budaya',
      title: `${content.provinces.length} provinsi, satu perjalanan Nusantara.`,
      text: 'Lihat cakupan provinsi yang tersedia, lalu masuk ke peta interaktif untuk memilih materi dan memulai petualangan.',
      action: 'Buka peta interaktif',
    },
  }[page]
  const previewSlugs =
    page === 'culture' ? ['aceh', 'sumbar', 'bali'] : ['yogya', 'jakarta', 'aceh']
  const previewCards = previewSlugs.flatMap((slug) => {
    const adventure = content.adventures[slug]
    const card = adventure?.cards[0]
    return card ? [{ province: adventure.province, card }] : []
  })

  return (
    <main className={`public-discovery public-discovery--${page}`}>
      <header className="about-header">
        <button className="about-logo" onClick={onBack} aria-label="Kembali ke homepage">
          <Logo />
        </button>
        <button className="about-back" onClick={onBack}>
          <Icon name="back" size={16} /> Kembali ke homepage
        </button>
      </header>

      <section className="public-discovery__hero">
        <div>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.text}</p>
          <button className="about-primary" onClick={onDashboard}>
            {copy.action} <Icon name="arrow" size={15} />
          </button>
          <small>
            <Icon name="lock" size={12} /> Sign-in baru diperlukan ketika memulai kuis.
          </small>
        </div>
        <aside>
          <span>
            <b>{content.provinces.length}</b>
            <small>Provinsi</small>
          </span>
          <span>
            <b>
              {Object.values(content.adventures).reduce(
                (total, adventure) => total + adventure.cards.length,
                0,
              )}
            </b>
            <small>Cerita pengantar</small>
          </span>
          <span>
            <b>{content.regionCount}</b>
            <small>Rumpun budaya</small>
          </span>
        </aside>
      </section>

      {page === 'map' ? (
        <section className="public-province-browser">
          <div className="public-section-heading">
            <p className="eyebrow">Cakupan perjalanan</p>
            <h2>Provinsi yang dapat dijelajahi</h2>
          </div>
          <div className="public-province-grid">
            {content.provinces.map((province, index) => (
              <span key={province.id}>
                <i style={{ background: province.tone }} />
                <small>{String(index + 1).padStart(2, '0')}</small>
                <b>{province.name}</b>
                <em>{province.island}</em>
              </span>
            ))}
          </div>
        </section>
      ) : (
        <section className="public-preview">
          <div className="public-section-heading">
            <p className="eyebrow">
              {page === 'culture' ? 'Pilihan kategori' : 'Cuplikan koleksi'}
            </p>
            <h2>
              {page === 'culture'
                ? 'Lima cara memulai perjalanan budaya'
                : 'Cerita singkat untuk memantik rasa ingin tahu'}
            </h2>
          </div>
          {page === 'culture' && (
            <div className="public-category-row">
              {[
                ['dance', 'Tari & seni'],
                ['house', 'Rumah adat'],
                ['food', 'Kuliner'],
                ['attire', 'Pakaian adat'],
                ['tradition', 'Tradisi'],
              ].map(([icon, label]) => (
                <span key={label}>
                  <i>
                    <Icon name={icon} size={20} />
                  </i>
                  {label}
                </span>
              ))}
            </div>
          )}
          <div className="public-card-grid">
            {previewCards.map(({ province, card }) => (
              <article key={`${province}-${card.title}`}>
                <img src={card.image} alt={card.alt} loading="lazy" />
                <div>
                  <small>
                    {province} · {card.label}
                  </small>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                  <em>{card.credit}</em>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      <SupportBadge />
      {authModal}
    </main>
  )
}

export default function TapakNusa({ content }: { content: SiteContent }) {
  const adventures = content.adventures
  // Prevents opening an adventure that has no material yet.
  const provinces = content.provinces.filter((province) => adventures[province.id]?.cards.length)
  const [started, setStarted] = useState(false)
  const [alias, setAlias] = useState('Kelana')
  const [homeSearch, setHomeSearch] = useState('')
  const [showAbout, setShowAbout] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [publicPage, setPublicPage] = useState<PublicPage | null>(null)
  const [view, setView] = useState<View>('map')
  const [selected, setSelected] = useState<Province | null>(null)
  const [learn, setLearn] = useState<number | null>(null)
  const [quiz, setQuiz] = useState(false)
  const [qIndex, setQIndex] = useState(0)
  const [choice, setChoice] = useState<number | null>(null)
  const [verdict, setVerdict] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [checkError, setCheckError] = useState<string | null>(null)
  const [correctAnswers, setCorrectAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)
  const [xp, setXp] = useState(80)
  const [cleared, setCleared] = useState<ClearedProvinces>({ aceh: 5 })
  const [streak, setStreak] = useState<StreakState>({ days: 4, lastActive: '' })
  const [daily, setDaily] = useState<DailyState>({ date: '', answers: 1 })
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingQuiz, setPendingQuiz] = useState(false)
  const [restored, setRestored] = useState(false)
  const adventure = adventures[selected?.id ?? provinces[0]?.id ?? '']
  const collectionCards = provinces.map((province, index) => {
    const cards = adventures[province.id].cards
    return {
      id: province.id,
      province: province.name.toLocaleUpperCase('id'),
      card: cards[index % cards.length],
    }
  })
  // Hero stories track the CMS order: first matching card of the province.
  const storyCard = (slug: string, label: string) => {
    const cards = adventures[slug]?.cards ?? []
    return cards.find((card) => card.label.toLowerCase().includes(label)) ?? cards[0]
  }
  const houseStory = storyCard('sumbar', 'arsitektur')
  const danceStory = storyCard('bali', 'seni')
  const foodStory = storyCard('sumbar', 'kuliner')

  const provincesWithState = useMemo<ProvinceState[]>(
    () =>
      provinces.map((province) => {
        const best = cleared[province.id]
        return {
          ...province,
          status: typeof best === 'number' ? 'done' : 'open',
          score: typeof best === 'number' ? best : null,
        }
      }),
    [cleared, provinces],
  )
  const clearedCount = provincesWithState.filter((province) => province.status === 'done').length
  const level = levelFor(xp)
  const dailyDone = daily.date === dayKey() || daily.date === '' ? daily.answers : 0
  const dailyRatio = Math.min(dailyDone / dailyTarget, 1)

  useEffect(() => {
    let restoredUser: DemoUser | null = null
    const savedUser = localStorage.getItem('tapak-nusa-demo-user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as DemoUser
        if (user.email?.endsWith('@gmail.com') && user.name) {
          restoredUser = user
          setDemoUser(user)
        } else {
          localStorage.removeItem('tapak-nusa-demo-user')
        }
      } catch {
        localStorage.removeItem('tapak-nusa-demo-user')
      }
    }

    const savedPlayer = localStorage.getItem('nusantara-quest-player')
    if (savedPlayer) {
      try {
        const data = JSON.parse(savedPlayer) as {
          started?: boolean
          alias?: string
          xp?: number
          cleared?: ClearedProvinces
          streak?: StreakState
          daily?: DailyState
        }
        setStarted(Boolean(data.started))
        setAlias(restoredUser?.name || data.alias || 'Kelana')
        setXp(typeof data.xp === 'number' ? data.xp : 80)

        const isUntouchedZeroState =
          (data.xp ?? 80) === 80 &&
          (!data.cleared || Object.keys(data.cleared).length === 0) &&
          (!data.streak || data.streak.days === 0)

        if (!isUntouchedZeroState) {
          if (data.cleared && typeof data.cleared === 'object') setCleared(data.cleared)
          if (data.streak && typeof data.streak.days === 'number') setStreak(data.streak)
          if (data.daily && typeof data.daily.answers === 'number') setDaily(data.daily)
        }
      } catch {
        localStorage.removeItem('nusantara-quest-player')
      }
    } else if (restoredUser) {
      setAlias(restoredUser.name)
      setStarted(true)
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    localStorage.setItem(
      'nusantara-quest-player',
      JSON.stringify({ started, alias, xp, cleared, streak, daily }),
    )
  }, [alias, cleared, daily, restored, started, streak, xp])

  const score = useMemo(() => correctAnswers.filter(Boolean).length, [correctAnswers])

  function enterView(nextView: View) {
    setView(nextView)
    setStarted(true)
    setShowAbout(false)
    setPublicPage(null)
  }

  function openProvince(provinceId: string) {
    const province = provinces.find((item) => item.id === provinceId)
    if (province) setSelected(province)
    setView('map')
    setStarted(true)
    setShowAbout(false)
    setPublicPage(null)
  }

  function exploreSearch() {
    const query = homeSearch.trim().toLocaleLowerCase('id')
    if (!query) {
      enterView('map')
      return
    }

    const provinceMatch = provinces.find((province) =>
      province.name.toLocaleLowerCase('id').includes(query),
    )
    const adventureMatch = Object.entries(adventures).find(([, item]) =>
      item.cards.some((card) => card.title.toLocaleLowerCase('id').includes(query)),
    )
    const match = provinceMatch ?? provinces.find((province) => province.id === adventureMatch?.[0])
    if (match) openProvince(match.id)
    else enterView('map')
  }

  function returnHome() {
    setStarted(false)
    setShowAbout(false)
    setPublicPage(null)
    setSelected(null)
    setLearn(null)
    setAuthOpen(false)
    setPendingQuiz(false)
    resetQuiz()
  }

  function openProfile() {
    enterView('profile')
  }

  function handleLandingUserAction() {
    if (demoUser) {
      enterView('map')
      return
    }
    setAuthOpen(true)
  }

  function openProfileSettings() {
    setAuthOpen(true)
  }

  function requestQuiz() {
    setLearn(null)
    if (!adventure.questions.length) return
    if (demoUser) {
      setQuiz(true)
      return
    }
    setPendingQuiz(true)
    setAuthOpen(true)
  }

  function completeDemoAuth(user: DemoUser) {
    setDemoUser(user)
    setAlias(user.name)
    localStorage.setItem('tapak-nusa-demo-user', JSON.stringify(user))
    setAuthOpen(false)
    if (!started) {
      setStarted(true)
      setShowAbout(false)
      setPublicPage(null)
      setView('map')
    }
    if (pendingQuiz) {
      setQuiz(true)
      setPendingQuiz(false)
    }
  }

  function signOutDemoUser() {
    setDemoUser(null)
    setAlias('Kelana')
    setShowAbout(false)
    setPublicPage(null)
    setSelected(null)
    setLearn(null)
    resetQuiz()
    localStorage.removeItem('tapak-nusa-demo-user')
    setAuthOpen(false)
  }

  function resetQuiz() {
    setQuiz(false)
    setQIndex(0)
    setChoice(null)
    setVerdict(null)
    setCheckError(null)
    setCorrectAnswers([])
    setShowResult(false)
  }

  async function chooseAnswer(question: QuizQuestion, index: number) {
    setChoice(index)
    setVerdict(null)
    setCheckError(null)
    try {
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, choice: index }),
      })
      const data = (await response.json()) as {
        correct?: boolean
        explanation?: string
        error?: string
      }
      if (!response.ok) throw new Error(data.error ?? 'Gagal memeriksa jawaban.')
      setVerdict({ correct: Boolean(data.correct), explanation: data.explanation ?? '' })
    } catch {
      setChoice(null)
      setCheckError('Jawaban belum bisa diperiksa. Periksa koneksi lalu coba lagi.')
    }
  }

  function nextQuestion() {
    if (!verdict) return
    const updated = [...correctAnswers, verdict.correct]
    setCorrectAnswers(updated)
    if (qIndex === adventure.questions.length - 1) {
      const finalScore = updated.filter(Boolean).length
      setXp((old) => old + finalScore * 10 + (finalScore >= 4 ? 30 : 0))
      const provinceId = selected?.id
      if (provinceId) {
        setCleared((old) => {
          const previous = old[provinceId]
          if (typeof previous === 'number' && previous >= finalScore) return old
          return { ...old, [provinceId]: finalScore }
        })
      }
      const today = dayKey()
      setDaily((old) => ({
        date: today,
        answers: (old.date === today || old.date === '' ? old.answers : 0) + finalScore,
      }))
      setStreak((old) => {
        if (old.lastActive === today) return old
        if (old.lastActive === '' && old.days > 0) return { days: old.days, lastActive: today }
        const resumed = old.lastActive === previousDayKey()
        return { days: resumed ? old.days + 1 : 1, lastActive: today }
      })
      setShowResult(true)
    } else {
      setQIndex((i) => i + 1)
      setChoice(null)
      setVerdict(null)
      setCheckError(null)
    }
  }

  const authModal = authOpen ? (
    <DemoAuthModal
      currentUser={demoUser}
      onClose={() => {
        setAuthOpen(false)
        setPendingQuiz(false)
      }}
      onSuccess={completeDemoAuth}
      onSignOut={signOutDemoUser}
    />
  ) : null

  if (!started && publicPage) {
    return (
      <PublicDiscoveryLanding
        page={publicPage}
        content={content}
        authModal={authModal}
        onBack={() => setPublicPage(null)}
        onDashboard={() => enterView(publicPage === 'stories' ? 'collection' : 'map')}
      />
    )
  }

  if (!started && showAbout) {
    return (
      <AboutLanding
        authModal={authModal}
        onBack={() => setShowAbout(false)}
        onExplore={() => enterView('map')}
        onCollection={() => enterView('collection')}
      />
    )
  }

  if (!started) {
    return (
      <main className="home-landing">
        <img
          className="home-background"
          src="https://images.unsplash.com/photo-1655289112205-d3b56c6b61f8?auto=format&fit=crop&w=2200&q=90"
          alt="Kompleks pura Bali di tengah lanskap pegunungan"
        />
        <div className="home-light" aria-hidden />

        <header className="home-header">
          <div className="home-brand">
            <Logo />
          </div>
          <nav className="home-nav" aria-label="Navigasi utama">
            <button className="home-nav-active" onClick={() => enterView('map')}>
              <Icon name="map" size={16} /> Jelajahi
            </button>
            <button onClick={() => setPublicPage('culture')}>
              <Icon name="star" size={16} /> Budaya
            </button>
            <button onClick={() => setPublicPage('stories')}>
              <Icon name="book" size={16} /> Cerita
            </button>
            <button onClick={() => setPublicPage('map')}>
              <Icon name="map" size={16} /> Peta Budaya
            </button>
            <button onClick={() => setPricingOpen(true)}>
              <Icon name="trophy" size={16} /> Premium
            </button>
            <button
              onClick={() => {
                setPublicPage(null)
                setShowAbout(true)
              }}
            >
              <Icon name="user" size={16} /> Tentang
            </button>
          </nav>
          <div className="home-actions">
            <button
              onClick={() => document.getElementById('home-search')?.focus()}
              aria-label="Fokus ke pencarian"
            >
              <span className="home-search-icon" />
            </button>
            <button
              onClick={handleLandingUserAction}
              aria-label={demoUser ? 'Buka dashboard penjelajah' : 'Masuk ke dashboard penjelajah'}
              title={demoUser ? 'Buka dashboard' : 'Masuk ke dashboard'}
            >
              <Icon name="user" size={22} />
            </button>
          </div>
        </header>

        <section className="home-copy" id="tentang-home">
          <span className="home-copy-accent" aria-hidden />
          <h1>
            Kenali Budaya
            <br />
            Indonesia
            <br />
            <em>Lebih Dekat</em>
          </h1>
          <p>Jelajahi kekayaan budaya Nusantara melalui teknologi yang menyenangkan.</p>
        </section>

        <div className="home-person">
          <img
            src="https://images.unsplash.com/photo-1641704093560-2ccd641efd96?auto=format&fit=crop&w=1000&q=90"
            alt="Anak perempuan mengenakan busana merah sebagai wajah penjelajah budaya"
          />
          <span>Generasi baru, cerita yang terus hidup.</span>
        </div>

        <svg className="home-route" viewBox="0 0 300 700" aria-hidden>
          <path d="M126 145 C112 218 256 265 240 345 C226 416 134 462 156 545" />
          <circle cx="126" cy="145" r="7" />
          <circle cx="240" cy="345" r="7" />
          <circle cx="156" cy="545" r="7" />
        </svg>

        <button className="home-story-card story-house" onClick={() => openProvince('sumbar')}>
          <img src={houseStory?.image} alt={houseStory?.alt} />
          <span>
            <small>{houseStory?.label}</small>
            <b>{houseStory?.title}</b>
            <em>{adventures['sumbar']?.province}</em>
          </span>
          <i>
            <Icon name="arrow" size={15} />
          </i>
        </button>
        <button className="home-story-card story-dance" onClick={() => openProvince('bali')}>
          <img src={danceStory?.image} alt={danceStory?.alt} />
          <span>
            <small>{danceStory?.label}</small>
            <b>{danceStory?.title}</b>
            <em>{adventures['bali']?.province}</em>
          </span>
          <i>
            <Icon name="arrow" size={15} />
          </i>
        </button>
        <button className="home-story-card story-food" onClick={() => openProvince('sumbar')}>
          <img src={foodStory?.image} alt={foodStory?.alt} />
          <span>
            <small>{foodStory?.label}</small>
            <b>{foodStory?.title}</b>
            <em>{adventures['sumbar']?.province}</em>
          </span>
          <i>
            <Icon name="arrow" size={15} />
          </i>
        </button>

        <section className="home-explore" id="jelajahi-home">
          <p className="home-kicker">
            <span>
              <Icon name="map" size={15} />
            </span>
            Mulai jelajahi budaya
          </p>
          <h2>
            Setiap langkah
            <br /> penuh cerita
          </h2>
          <p>Temukan budaya, tradisi, dan kearifan lokal di seluruh Indonesia dengan mudah.</p>
          <div className="home-metrics">
            <span>
              <Icon name="map" size={20} />
              <b>38</b>
              <small>Provinsi</small>
            </span>
            <span>
              <Icon name="user" size={20} />
              <b>7.000+</b>
              <small>Budaya & tradisi</small>
            </span>
            <span>
              <Icon name="book" size={20} />
              <b>152</b>
              <small>Cerita budaya</small>
            </span>
          </div>
          <form
            className="home-search"
            onSubmit={(event) => {
              event.preventDefault()
              exploreSearch()
            }}
          >
            <span className="home-search-icon" />
            <input
              id="home-search"
              value={homeSearch}
              onChange={(event) => setHomeSearch(event.target.value)}
              placeholder="Cari provinsi atau budaya..."
              aria-label="Cari provinsi atau budaya"
            />
            <button type="submit">
              Mulai jelajahi <Icon name="arrow" size={14} />
            </button>
          </form>
          <div className="home-divider">
            <span>atau jelajahi berdasarkan kategori</span>
          </div>
          <div className="home-categories" id="budaya-home">
            <button onClick={() => openProvince('aceh')}>
              <b>
                <Icon name="dance" size={21} />
              </b>
              <span>Tari & seni</span>
            </button>
            <button onClick={() => openProvince('sumbar')}>
              <b>
                <Icon name="house" size={21} />
              </b>
              <span>Rumah adat</span>
            </button>
            <button onClick={() => openProvince('bali')}>
              <b>
                <Icon name="food" size={21} />
              </b>
              <span>Kuliner</span>
            </button>
            <button onClick={() => openProvince('jakarta')}>
              <b>
                <Icon name="attire" size={21} />
              </b>
              <span>Pakaian adat</span>
            </button>
            <button onClick={() => openProvince('yogya')}>
              <b>
                <Icon name="tradition" size={21} />
              </b>
              <span>Tradisi</span>
            </button>
          </div>
        </section>

        <button className="home-map-cta" onClick={() => enterView('map')}>
          <span>
            <Icon name="map" size={25} />
          </span>
          Peta budaya
        </button>
        <p className="home-credit">Foto: Reena Yadav & Anh Vy / Unsplash</p>
        <SupportBadge />
        {authModal}
        {pricingOpen && <PricingModal user={demoUser} onClose={() => setPricingOpen(false)} />}
      </main>
    )
  }

  const viewToTab: Record<View, DashboardTab> = {
    map: 'beranda',
    collection: 'koleksi',
    rank: 'peringkat',
    profile: 'profil',
  }

  function handleDashboardQuizWin(provinceId: string, correct: boolean) {
    if (!correct) return
    setXp((old) => old + 15)
    setCleared((old) => ({
      ...old,
      [provinceId]: Math.max(old[provinceId] ?? 0, 5),
    }))
    const today = dayKey()
    setDaily((old) => ({
      date: today,
      answers: (old.date === today || old.date === '' ? old.answers : 0) + 1,
    }))
    setStreak((old) => {
      if (old.lastActive === today) return old
      if (old.lastActive === '' && old.days > 0) return { days: old.days, lastActive: today }
      const resumed = old.lastActive === previousDayKey()
      return { days: resumed ? old.days + 1 : 1, lastActive: today }
    })
  }

  return (
    <>
      <NusaDashboard
        key={view}
        provinces={provinces}
        adventures={adventures}
        alias={alias}
        demoUser={demoUser}
        xp={xp}
        level={level}
        streakDays={streak.days}
        dailyDone={dailyDone}
        dailyTarget={dailyTarget}
        cleared={cleared}
        initialTab={viewToTab[view]}
        selectedProvince={selected}
        onSelectProvince={setSelected}
        onReturnHome={returnHome}
        onOpenAuth={() => setAuthOpen(true)}
        onCompleteQuizQuestion={handleDashboardQuizWin}
      />
      {authModal}
    </>
  )
}

type QrisSession = {
  plan: PremiumPlan
  paymentId: string
  qrString: string
  amount: number
  expiresAt: string | null
}

type QrisPhase = 'idle' | 'creating' | 'ready' | 'paid' | 'error'

function PricingModal({ user, onClose }: { user: DemoUser | null; onClose: () => void }) {
  const [phase, setPhase] = useState<QrisPhase>('idle')
  const [session, setSession] = useState<QrisSession | null>(null)
  const [qrSvg, setQrSvg] = useState('')
  const [error, setError] = useState('')

  async function startSession(plan: PremiumPlan) {
    setPhase('creating')
    setError('')
    try {
      const res = await fetch('/api/premium/qris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          email: user?.email || 'tamu@tapaknusa.app',
          name: user?.name || 'Tamu Tapak Nusa',
        }),
      })
      const data = (await res.json().catch(() => null)) as {
        paymentId?: string
        amount?: number
        qrString?: string
        expiresAt?: string | null
        error?: string
      } | null
      if (!res.ok || !data?.paymentId || !data.qrString) {
        throw new Error(data?.error || 'Gagal membuat QRIS.')
      }
      const svg = await QRCode.toString(data.qrString, {
        type: 'svg',
        errorCorrectionLevel: 'M',
        margin: 1,
        width: 232,
        color: { dark: '#0b3945', light: '#ffffff' },
      })
      setSession({
        plan,
        paymentId: data.paymentId,
        qrString: data.qrString,
        amount: data.amount ?? plan.amount,
        expiresAt: data.expiresAt ?? null,
      })
      setQrSvg(svg)
      setPhase('ready')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal membuat QRIS.')
      setPhase('error')
    }
  }

  useEffect(() => {
    if (phase !== 'ready' || !session) return
    let cancelled = false
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`/api/premium/qris?paymentId=${session.paymentId}`)
        const data = (await res.json().catch(() => null)) as { status?: string } | null
        if (!cancelled && res.ok && data?.status === 'paid') setPhase('paid')
      } catch {
        // A missed poll is not a payment failure; the interval keeps running.
      }
    }, 5000)
    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [phase, session])

  const expired = session?.expiresAt != null && new Date(session.expiresAt).getTime() < Date.now()

  return (
    <div className="modal-backdrop auth-backdrop" onMouseDown={onClose}>
      <div
        className="demo-auth-modal pricing-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Paket langganan Tapak Nusa"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="close" onClick={onClose} aria-label="Tutup paket langganan">
          ×
        </button>
        <div className="auth-brand">
          <Logo />
          <span>Premium</span>
        </div>
        {phase === 'idle' || phase === 'creating' || phase === 'error' ? (
          <>
            <p className="eyebrow">Berlangganan Tapak Nusa</p>
            <h2>Pilih paket langganan.</h2>
            <p className="auth-intro">
              Akses penuh materi budaya, kuis bergambar, dan koleksi di seluruh 38 provinsi.
            </p>
            <div className="pricing-grid">
              {premiumPlans.map((plan) => (
                <article
                  key={plan.id}
                  className={plan.badge ? 'pricing-plan featured' : 'pricing-plan'}
                >
                  {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                  <h3>{plan.name}</h3>
                  <p className="pricing-price">
                    <b>{plan.price}</b>
                    {plan.per && <small>{plan.per}</small>}
                  </p>
                  <p className="pricing-note">{plan.note}</p>
                  <button
                    className="pricing-cta"
                    onClick={() => startSession(plan)}
                    disabled={phase === 'creating'}
                  >
                    Berlangganan
                  </button>
                </article>
              ))}
            </div>
            {phase === 'creating' && <p className="pricing-footnote">Membuat kode QRIS…</p>}
            {phase === 'error' && (
              <p className="pricing-footnote is-error">
                {error}{' '}
                <button className="qris-retry" onClick={() => setPhase('idle')}>
                  Coba lagi
                </button>
              </p>
            )}
            <p className="pricing-footnote">
              Pembayaran aman diproses oleh Mayar. Langganan bisa berhenti kapan saja, kecuali paket
              Lifetime yang berlaku selamanya.
            </p>
          </>
        ) : (
          session && (
            <div className="qris-view">
              <p className="eyebrow">Pembayaran {session.plan.name}</p>
              <h2>Scan QRIS ini.</h2>
              {phase === 'paid' ? (
                <div className="qris-paid">
                  <b>Pembayaran diterima.</b>
                  <p>Terima kasih telah berlangganan Tapak Nusa Premium.</p>
                </div>
              ) : (
                <>
                  <div className="qr-wrap">
                    {qrSvg && (
                      <img
                        src={`data:image/svg+xml;utf8,${encodeURIComponent(qrSvg)}`}
                        alt="Kode QRIS pembayaran"
                      />
                    )}
                  </div>
                  <p className="qris-amount">
                    <b>Rp{session.amount.toLocaleString('id-ID')}</b>
                  </p>
                  <p className="qris-status">
                    {expired ? 'QRIS kedaluwarsa.' : 'Menunggu pembayaran…'}
                  </p>
                  {expired && (
                    <button
                      className="pricing-cta qris-renew"
                      onClick={() => startSession(session.plan)}
                    >
                      Perbarui QR
                    </button>
                  )}
                  <button className="qris-back" onClick={() => setPhase('idle')}>
                    Kembali ke paket
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>
    </div>
  )
}

function ProvinceModal({
  province,
  adventure,
  onClose,
  onLearn,
  onQuiz,
}: {
  province: Province
  adventure: Adventure
  onClose: () => void
  onLearn: () => void
  onQuiz: () => void
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="province-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose} aria-label="Tutup">
          ×
        </button>
        <div className="modal-art">
          <img
            src={adventure.cards[0].image}
            alt={adventure.cards[0].alt}
            className="province-cover"
          />
          <span className="photo-credit">{adventure.cards[0].credit}</span>
          <span className="chapter">Jelajah {province.name}</span>
        </div>
        <div className="modal-body">
          <p className="eyebrow">{province.island}</p>
          <h2>{province.name}</h2>
          <p>{adventure.intro}</p>
          <div className="mini-stats">
            <span>
              <b>{adventure.cards.length}</b>
              <small>Cerita</small>
            </span>
            <span>
              <b>{adventure.questions.length}</b>
              <small>Soal</small>
            </span>
            <span>
              <b>{adventure.questions.length * 10 + 30}</b>
              <small>XP tersedia</small>
            </span>
          </div>
          <button className="primary" onClick={onLearn}>
            Mulai belajar <Icon name="arrow" size={14} />
          </button>
          <button className="secondary" onClick={onQuiz}>
            Langsung ke kuis latihan
          </button>
        </div>
      </div>
    </div>
  )
}

function LearnModal({
  index,
  adventure,
  onClose,
  onNext,
}: {
  index: number
  adventure: Adventure
  onClose: () => void
  onNext: () => void
}) {
  const card = adventure.cards[index]
  return (
    <div className="modal-backdrop">
      <div className="learn-modal">
        <div className="knowledge-art">
          <img src={card.image} alt={card.alt} />
          <span className="photo-credit">{card.credit}</span>
          <button className="back" onClick={onClose}>
            <Icon name="back" size={16} /> Kembali
          </button>
          <span className="card-count">
            {index + 1} / {adventure.cards.length}
          </span>
        </div>
        <div className="knowledge-copy">
          <p className="eyebrow">{card.label}</p>
          <h2>{card.title}</h2>
          <p>{card.text}</p>
          <blockquote>
            “Kenali bentuknya, pahami konteksnya.”
            <small>Budaya hidup bersama komunitas yang menjaganya.</small>
          </blockquote>
          <div className="source">Sumber: {card.source}</div>
          <button className="primary" onClick={onNext}>
            {index === adventure.cards.length - 1 ? 'Mulai kuis' : 'Cerita berikutnya'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function QuizModal({
  qIndex,
  adventure,
  choice,
  verdict,
  checkError,
  onChoice,
  onNext,
  onClose,
  result,
  score,
  xp,
}: {
  qIndex: number
  adventure: Adventure
  choice: number | null
  verdict: { correct: boolean; explanation: string } | null
  checkError: string | null
  onChoice: (i: number) => void
  onNext: () => void
  onClose: () => void
  result: boolean
  score: number
  xp: number
}) {
  const q = adventure.questions[qIndex]
  if (result)
    return (
      <div className="modal-backdrop">
        <div className="result-modal">
          <div className="burst">
            <Icon name="trophy" size={38} />
          </div>
          <p className="eyebrow">Perjalanan selesai</p>
          <h2>{score >= 4 ? 'Luar biasa, Penjelajah.' : 'Sedikit lagi, Penjelajah.'}</h2>
          <p>
            {score >= 4
              ? `Kamu telah menyelesaikan pengantar budaya ${adventure.province}.`
              : 'Baca kembali ceritanya dan coba sekali lagi. Setiap jawaban adalah bagian dari belajar.'}
          </p>
          <div className="scoreboard">
            <span>
              <b>
                {score}/{adventure.questions.length}
              </b>
              <small>Jawaban benar</small>
            </span>
            <span>
              <b>+{score * 10 + (score >= 4 ? 30 : 0)}</b>
              <small>XP diperoleh</small>
            </span>
            <span>
              <b>{xp}</b>
              <small>Total XP</small>
            </span>
          </div>
          <div className="badge-earned">
            <span className="badge-mark">
              {adventure.province
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)}
            </span>
            <p>
              <small>LEN­CANA BARU</small>
              <b>Jejak {adventure.province}</b>
            </p>
          </div>
          <button className="primary" onClick={onClose}>
            Kembali ke peta <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    )
  const answered = choice !== null
  return (
    <div className="modal-backdrop">
      <div className="quiz-modal">
        <header>
          <button onClick={onClose} aria-label="Tutup kuis">
            ×
          </button>
          <div className="quiz-progress">
            <i style={{ width: `${((qIndex + 1) / adventure.questions.length) * 100}%` }} />
          </div>
          <span>
            {qIndex + 1} dari {adventure.questions.length}
          </span>
        </header>
        <div className="quiz-content">
          <p className="eyebrow">Kuis reguler · {adventure.province}</p>
          <figure className="quiz-image">
            <img src={q.image} alt={q.alt} />
            <figcaption>
              Foto pendukung · {q.credit}
              <span>Amati detail gambar sebelum menjawab</span>
            </figcaption>
          </figure>
          <h2>{q.q}</h2>
          <div className="options">
            {q.options.map((o, i) => (
              <button
                key={o}
                onClick={() => !answered && onChoice(i)}
                className={answered && choice === i ? (verdict?.correct ? 'correct' : 'wrong') : ''}
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {o}
                {answered && choice === i && verdict?.correct && <Icon name="check" size={18} />}
              </button>
            ))}
          </div>
          {answered && !verdict && !checkError && (
            <div className="feedback">
              <b>Memeriksa jawaban…</b>
            </div>
          )}
          {answered && verdict && (
            <div className={`feedback ${verdict.correct ? 'yes' : 'no'}`}>
              <b>{verdict.correct ? 'Tepat sekali.' : 'Belum tepat.'}</b>
              <p>{verdict.explanation}</p>
              <small>Sumber materi: referensi pada kartu pembelajaran {adventure.province}</small>
            </div>
          )}
          {checkError && (
            <div className="feedback no">
              <b>Belum bisa diperiksa.</b>
              <p>{checkError}</p>
            </div>
          )}
          <button className="primary next" disabled={!verdict} onClick={onNext}>
            {qIndex === adventure.questions.length - 1 ? 'Lihat hasil' : 'Lanjutkan'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Collection({
  cleared,
  onOpenProvince,
  collectionCards,
}: {
  cleared: ClearedProvinces
  onOpenProvince: (provinceId: string) => void
  collectionCards: { id: string; province: string; card: CultureCard }[]
}) {
  return (
    <>
      <div className="section-heading simple">
        <div>
          <p className="eyebrow">Koleksi budaya</p>
          <h1>{collectionCards.length} cerita pembuka dari Nusantara.</h1>
          <p>
            Jelajahi satu kartu pilihan dari setiap provinsi dan buka kembali materi perjalananmu.
          </p>
        </div>
        <span className="collection-count">
          <b>{Object.keys(cleared).length}</b> dari {collectionCards.length} provinsi tuntas
        </span>
      </div>
      <div className="collection-subhead">
        <div>
          <p className="eyebrow">Pilihan dari setiap provinsi</p>
          <h2>Catatan perjalananmu</h2>
        </div>
        <span>{collectionCards.length} kartu</span>
      </div>
      <div className="collection-grid">
        {collectionCards.map(({ id, card: c, province }, i) => (
          <article key={id} className={cleared[id] === undefined ? '' : 'is-cleared'}>
            <div className="card-art">
              <img src={c.image} alt={c.alt} loading="lazy" decoding="async" />
              <span>{String(i + 1).padStart(2, '0')}</span>
              <small>{c.credit}</small>
            </div>
            <div>
              <small>
                {province} · {c.label}
              </small>
              <h3>{c.title}</h3>
              <p>{c.text.slice(0, 84)}...</p>
              <button onClick={() => onOpenProvince(id)}>
                Baca kembali <Icon name="arrow" size={12} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function Leaderboard({
  alias,
  xp,
  clearedCount,
  level,
}: {
  alias: string
  xp: number
  clearedCount: number
  level: ReturnType<typeof levelFor>
}) {
  const standings = useMemo(
    () =>
      [
        ...ranking.map(([place, name, score]) => ({
          place,
          name,
          score: Number(score.replace('.', '')),
          you: false,
        })),
        { place: '—', name: alias, score: xp, you: true },
      ].sort((a, b) => b.score - a.score),
    [alias, xp],
  )
  const myPlace = standings.findIndex((row) => row.you) + 1
  const ahead = standings[myPlace - 2]
  const behind = standings[myPlace]

  return (
    <>
      <div className="section-heading simple">
        <div>
          <p className="eyebrow">Peringkat mingguan</p>
          <h1>Belajar bersama para penjelajah.</h1>
          <p>Peringkat berdasarkan XP minggu ini. Minggu baru dimulai Senin pukul 00.00 WIB.</p>
        </div>
        <div className="week-chip">{currentWeekLabel()}</div>
      </div>
      <div className="rank-layout">
        <div className="leaderboard">
          {standings.map((row, i) => (
            <div
              key={`${row.place}-${row.name}`}
              className={`${i < 3 ? 'top' : ''} ${row.you ? 'you' : ''}`.trim()}
            >
              <span className="place">{i + 1}</span>
              <span className="rank-avatar">{row.name.slice(0, 1)}</span>
              <p>
                <b>
                  {row.name} {row.you && <em>Kamu</em>}
                </b>
                <small>
                  {i < 3
                    ? 'Pendekar Budaya'
                    : row.you
                      ? `${level.title} Lv. ${level.level}`
                      : 'Penjelajah'}
                </small>
              </p>
              <strong>{row.score.toLocaleString('id-ID')} XP</strong>
            </div>
          ))}
        </div>
        <aside className="rank-aside">
          <Icon name="trophy" size={32} />
          <h3>Tetap penasaran.</h3>
          <p>
            Peringkat bukan tujuan akhir. Setiap cerita yang kamu pahami adalah kemajuan yang
            sesungguhnya.
          </p>
          <div className="rank-stat">
            <b>#{myPlace}</b>
            <small>Peringkatmu minggu ini</small>
          </div>
          <div className="rank-stat">
            <b>{ahead ? `${(ahead.score - xp).toLocaleString('id-ID')} XP` : 'Puncak'}</b>
            <small>{ahead ? `Untuk menyalip ${ahead.name}` : 'Kamu di peringkat teratas'}</small>
          </div>
          <div className="rank-stat">
            <b>{clearedCount}</b>
            <small>Provinsi tuntas · {behind ? `di atas ${behind.name}` : 'terakhir'}</small>
          </div>
        </aside>
      </div>
    </>
  )
}

function Profile({
  alias,
  xp,
  level,
  clearedCount,
  streakDays,
  dailyDone,
  onEdit,
}: {
  alias: string
  xp: number
  level: ReturnType<typeof levelFor>
  clearedCount: number
  streakDays: number
  dailyDone: number
  onEdit: () => void
}) {
  const span = level.nextAt === null ? null : level.nextAt - levelLadder[level.level - 1].min
  const into = level.nextAt === null ? 1 : (xp - levelLadder[level.level - 1].min) / span!
  return (
    <>
      <div className="profile-hero">
        <div className="big-avatar">{alias[0]}</div>
        <div>
          <p className="eyebrow">Profil penjelajah</p>
          <h1>{alias}</h1>
          <p>
            {level.title} · Level {level.level}
          </p>
        </div>
        <button className="secondary" onClick={onEdit}>
          Ubah profil
        </button>
      </div>
      <div className="profile-grid">
        <section>
          <p className="eyebrow">Perjalananmu</p>
          <div className="profile-numbers">
            <span>
              <b>{xp}</b>
              <small>Total XP</small>
            </span>
            <span>
              <b>{streakDays}</b>
              <small>Nyala obor</small>
            </span>
            <span>
              <b>{clearedCount}</b>
              <small>Daerah selesai</small>
            </span>
          </div>
          <div className="level-line">
            <p>
              <b>{level.nextTitle ? `Menuju ${level.nextTitle}` : 'Level tertinggi'}</b>
              <small>{level.nextAt === null ? `${xp} XP` : `${xp} / ${level.nextAt} XP`}</small>
            </p>
            <div className="meter">
              <i style={{ width: `${Math.min(into * 100, 100)}%` }} />
            </div>
            <p className="level-note">
              <small>
                {Math.min(dailyDone, dailyTarget)}/{dailyTarget} misi hari ini selesai
              </small>
            </p>
          </div>
        </section>
        <section>
          <p className="eyebrow">Lencana</p>
          <div className="badges">
            <span>
              <i>AC</i>
              <b>Jejak Aceh</b>
            </span>
            <span>
              <i>5/5</i>
              <b>Skor Sempurna</b>
            </span>
            <span className="locked">
              <i>
                <Icon name="lock" />
              </i>
              <b>7 Hari Menyala</b>
            </span>
          </div>
        </section>
      </div>
    </>
  )
}
