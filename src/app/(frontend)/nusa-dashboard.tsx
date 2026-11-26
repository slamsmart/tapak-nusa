'use client'

import React, { useMemo, useState } from 'react'
import type {
  SiteAdventure as Adventure,
  SiteCard as CultureCard,
  SiteProvince as Province,
  SiteQuestion as QuizQuestion,
} from '@/lib/content'

export type DashboardTab = 'beranda' | 'koleksi' | 'peringkat' | 'profil'
type MapRegion = 'all' | 'barat' | 'tengah' | 'timur'

type DemoUser = {
  email: string
  name: string
}

type LevelInfo = {
  level: number
  title: string
  nextTitle: string | null
  nextAt: number | null
}

type NusaDashboardProps = {
  provinces: Province[]
  adventures: Record<string, Adventure>
  alias: string
  demoUser: DemoUser | null
  xp: number
  level: LevelInfo
  streakDays: number
  dailyDone: number
  dailyTarget: number
  cleared: Record<string, number>
  initialTab?: DashboardTab
  selectedProvince: Province | null
  onSelectProvince: (province: Province | null) => void
  onReturnHome: () => void
  onOpenAuth: () => void
  onCompleteQuizQuestion: (provinceId: string, correct: boolean) => void
}

const WESTERN_IDS = new Set([
  'aceh',
  'sumut',
  'sumbar',
  'riau',
  'kepri',
  'jambi',
  'sumsel',
  'babel',
  'bengkulu',
  'lampung',
  'banten',
  'jakarta',
  'jabar',
  'jateng',
  'yogya',
  'yogyakarta',
  'jatim',
])

const CENTRAL_IDS = new Set([
  'bali',
  'ntb',
  'ntt',
  'kalbar',
  'kalteng',
  'kalsel',
  'kaltim',
  'kaltara',
  'sulut',
  'gorontalo',
  'sulteng',
  'sulbar',
  'sulsel',
  'sultra',
])

function regionForProvince(id: string): 'barat' | 'tengah' | 'timur' {
  if (WESTERN_IDS.has(id)) return 'barat'
  if (CENTRAL_IDS.has(id)) return 'tengah'
  return 'timur'
}

function regionLabelFor(region: 'barat' | 'tengah' | 'timur'): string {
  if (region === 'barat') return 'Wilayah Barat'
  if (region === 'tengah') return 'Wilayah Tengah'
  return 'Wilayah Timur'
}

const PROVINCE_HIGHLIGHTS: Record<
  string,
  { tagline: string; house: string; dance: string; food: string; thumb: string; progress: number }
> = {
  aceh: {
    tagline: 'Serambi Mekkah • Tari Saman & Masjid Raya Baiturrahman',
    house: 'Rumoh Aceh',
    dance: 'Tari Saman',
    food: 'Mie Aceh',
    thumb:
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=240&q=80',
    progress: 98,
  },
  sumbar: {
    tagline: 'Ranah Minang • Rumah Gadang & Budaya Matrilineal',
    house: 'Rumah Gadang',
    dance: 'Tari Piring',
    food: 'Rendang',
    thumb:
      'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=240&q=80',
    progress: 95,
  },
  bali: {
    tagline: 'Pulau Dewata • Pura Ulun Danu & Filosofi Tri Hita Karana',
    house: 'Gapura Candi Bentar',
    dance: 'Tari Kecak',
    food: 'Ayam Betutu',
    thumb:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=240&q=80',
    progress: 92,
  },
  jakarta: {
    tagline: 'Tanah Betawi • Ondel-ondel & Monumen Nasional',
    house: 'Rumah Kebaya',
    dance: 'Tari Topeng Betawi',
    food: 'Kerak Telor',
    thumb:
      'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=240&q=80',
    progress: 90,
  },
  yogya: {
    tagline: 'Kota Budaya • Keraton Ngayogyakarta & Seni Batik',
    house: 'Rumah Joglo',
    dance: 'Tari Serimpi',
    food: 'Gudeg',
    thumb:
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=240&q=80',
    progress: 88,
  },
  sulsel: {
    tagline: 'Bumi Anging Mammiri • Kapal Pinisi & Tongkonan Toraja',
    house: 'Tongkonan',
    dance: 'Tari Pakarena',
    food: 'Coto Makassar',
    thumb:
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=240&q=80',
    progress: 84,
  },
  papua: {
    tagline: 'Mutiara Hitam dari Timur • Rumah Honai & Alat Musik Tifa',
    house: 'Rumah Honai',
    dance: 'Tari Yospan',
    food: 'Papeda',
    thumb:
      'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=240&q=80',
    progress: 79,
  },
}

const CHART_DATA = {
  '7days': [
    { day: 'Sen', x: 50, y: 155, label: '+14 XP' },
    { day: 'Sel', x: 133, y: 138, label: '+18 XP' },
    { day: 'Rab', x: 216, y: 110, label: '+22 XP' },
    { day: 'Kam', x: 300, y: 96, label: '+25 XP' },
    { day: 'Jum', x: 383, y: 64, label: '+32 XP' },
    { day: 'Sab', x: 466, y: 94, label: '+26 XP' },
    { day: 'Min', x: 550, y: 100, label: '+24 XP' },
  ],
  '30days': [
    { day: 'Mgg 1', x: 50, y: 148, label: '+65 XP' },
    { day: 'Mgg 2', x: 175, y: 120, label: '+92 XP' },
    { day: 'Mgg 3', x: 300, y: 82, label: '+145 XP' },
    { day: 'Mgg 4', x: 425, y: 96, label: '+118 XP' },
    { day: 'Kini', x: 550, y: 68, label: '+160 XP' },
  ],
} as const

const ACHIEVEMENTS = [
  {
    title: 'Langkah Pertama',
    desc: 'Selesaikan kuis provinsi pertama',
    unlocked: true,
    icon: 'award',
  },
  {
    title: 'Penjelajah Sumatera',
    desc: 'Pelajari budaya di wilayah Sumatera',
    unlocked: true,
    icon: 'map-pin',
  },
  {
    title: 'Api Semangat 4 Hari',
    desc: 'Belajar 4 hari berturut-turut',
    unlocked: true,
    icon: 'flame',
  },
  {
    title: 'Jejak Serambi Mekkah',
    desc: 'Raih skor tinggi di Provinsi Aceh',
    unlocked: true,
    icon: 'star',
  },
  {
    title: 'Sahabat Ranah Minang',
    desc: 'Kenali Rumah Gadang & kuliner Minang',
    unlocked: true,
    icon: 'book-open',
  },
  {
    title: 'Pengamat Visual',
    desc: 'Jawab benar soal kuis bergambar',
    unlocked: true,
    icon: 'sparkles',
  },
  {
    title: 'Penjaga Tradisi',
    desc: 'Baca sumber dan konteks komunitas',
    unlocked: true,
    icon: 'trophy',
  },
  {
    title: 'Kolektor Cerita',
    desc: 'Buka kartu pengantar lintas pulau',
    unlocked: true,
    icon: 'book-open',
  },
  {
    title: 'Bintang Mingguan',
    desc: 'Masuk papan peringkat penjelajah aktif',
    unlocked: true,
    icon: 'award',
  },
  {
    title: 'Penjelajah 20 Provinsi',
    desc: 'Tuntaskan kuis di 20 provinsi berbeda',
    unlocked: false,
    icon: 'lock',
  },
  {
    title: 'Api 14 Hari',
    desc: 'Jaga konsistensi belajar 2 minggu penuh',
    unlocked: false,
    icon: 'lock',
  },
  {
    title: 'Duta Nusantara',
    desc: 'Tuntaskan seluruh 38 provinsi Indonesia',
    unlocked: false,
    icon: 'lock',
  },
]

function LucideSvg({
  name,
  className = 'w-5 h-5',
  filled = false,
}: {
  name: string
  className?: string
  filled?: boolean
}) {
  switch (name) {
    case 'home':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    case 'book-open':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    case 'bar-chart-2':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    case 'bar-chart-3':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M3 3v18h18" />
          <path d="M18 17V9" />
          <path d="M13 17V5" />
          <path d="M8 17v-3" />
        </svg>
      )
    case 'user':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    case 'star':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
    case 'flame':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      )
    case 'award':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="8" r="6" />
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
        </svg>
      )
    case 'map-pin':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill={filled ? 'currentColor' : 'none'}
          stroke={filled ? 'none' : 'currentColor'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          {filled ? (
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
          ) : (
            <>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </>
          )}
        </svg>
      )
    case 'map':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
          <line x1="9" y1="3" x2="9" y2="18" />
          <line x1="15" y1="6" x2="15" y2="21" />
        </svg>
      )
    case 'trophy':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      )
    case 'sliders-horizontal':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="21" x2="14" y1="4" y2="4" />
          <line x1="10" x2="3" y1="4" y2="4" />
          <line x1="21" x2="12" y1="12" y2="12" />
          <line x1="8" x2="3" y1="12" y2="12" />
          <line x1="21" x2="16" y1="20" y2="20" />
          <line x1="12" x2="3" y1="20" y2="20" />
          <line x1="14" x2="14" y1="2" y2="6" />
          <line x1="8" x2="8" y1="10" y2="14" />
          <line x1="16" x2="16" y1="18" y2="22" />
        </svg>
      )
    case 'plus':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      )
    case 'minus':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M5 12h14" />
        </svg>
      )
    case 'navigation':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      )
    case 'search':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      )
    case 'menu':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      )
    case 'x':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )
    case 'sparkles':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
      )
    case 'help-circle':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      )
    case 'check-circle-2':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      )
    case 'lock':
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    default:
      return null
  }
}

function NusaBrandPinLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 40 44" className="w-10 h-10 drop-shadow-sm" aria-hidden>
          <path
            d="M20 2C10.6 2 3 9.6 3 19C3 31.2 20 42 20 42C20 42 37 31.2 37 19C37 9.6 29.4 2 20 2Z"
            fill="#E11D48"
          />
          <circle cx="20" cy="18" r="9.5" fill="#FFFFFF" />
          <path
            d="M14 19.5H26V21.5H14V19.5ZM15.5 16.5H24.5V18.5H15.5V16.5ZM17.5 13.5H22.5V15.5H17.5V13.5ZM19.5 11H20.5V13H19.5V11Z"
            fill="#E11D48"
          />
        </svg>
      </div>
      <div className="leading-tight text-left">
        <span className="font-extrabold text-[#0D5C46] text-lg tracking-tight block">Tapak</span>
        <span className="font-extrabold text-[#0D5C46] text-lg tracking-tight block -mt-1">
          Nusa
        </span>
      </div>
    </div>
  )
}

function SidebarPuraScene() {
  return (
    <div className="relative w-full flex-1 min-h-[300px] lg:min-h-[360px] max-h-[480px] mt-auto pointer-events-none select-none overflow-hidden flex items-end">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#F9FCFA] to-transparent z-10" />
      <svg
        viewBox="0 0 260 400"
        className="w-full h-full object-cover object-bottom"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="nusaSkyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F9FCFA" stopOpacity="0" />
            <stop offset="30%" stopColor="#E6F5F0" stopOpacity="0.55" />
            <stop offset="65%" stopColor="#CEEBE3" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#A3DDD2" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="nusaLakeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#AEE2D7" />
            <stop offset="100%" stopColor="#68B8A9" />
          </linearGradient>
          <linearGradient id="nusaMeruGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2F4440" />
            <stop offset="100%" stopColor="#1C2D2A" />
          </linearGradient>
          <linearGradient id="nusaMeruGrad2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3C5651" />
            <stop offset="100%" stopColor="#243834" />
          </linearGradient>
        </defs>

        {/* Sky Background */}
        <rect width="260" height="400" fill="url(#nusaSkyGrad)" />

        {/* Distant majestic misty mountains (High volcanic peak) */}
        <path
          d="M-20 220 Q40 85 110 145 T240 165 L280 185 L280 260 L-20 260 Z"
          fill="#C2E6DE"
          opacity="0.6"
        />
        <path
          d="M-20 240 Q75 130 160 185 T280 190 L280 270 L-20 270 Z"
          fill="#A3DCD0"
          opacity="0.68"
        />
        <path
          d="M-20 255 Q35 185 105 210 Q180 235 280 205 L280 280 L-20 280 Z"
          fill="#7FCAB8"
          opacity="0.75"
        />

        {/* Calm Lake Beratan */}
        <rect x="0" y="238" width="260" height="162" fill="url(#nusaLakeGrad)" />

        {/* Subtle Water Shimmers */}
        <g stroke="#EBF8F5" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
          <line x1="20" y1="265" x2="85" y2="265" />
          <line x1="125" y1="272" x2="210" y2="272" opacity="0.5" />
          <line x1="45" y1="288" x2="135" y2="288" strokeWidth="1.8" />
          <line x1="155" y1="298" x2="235" y2="298" opacity="0.5" />
          <line x1="25" y1="312" x2="110" y2="312" strokeWidth="1.4" />
        </g>

        {/* Water reflection of the temple roofs */}
        <path d="M60 270 L86 330 L112 270 Z" fill="#2E554D" opacity="0.22" />

        {/* Main Pura Ulun Danu Meru Tower (11 Tiers, vertical Balinese architecture) */}
        <g id="main-pura-meru">
          {/* Stone islet base & plinth */}
          <ellipse cx="86" cy="270" rx="56" ry="12" fill="#416C61" opacity="0.45" />
          <path d="M34 265 Q86 256 138 265 L132 274 L38 274 Z" fill="#3B6358" />
          <rect x="52" y="254" width="68" height="11" rx="1.5" fill="#88A39B" />
          <rect x="58" y="245" width="56" height="10" rx="1" fill="#ABC0BA" />
          <rect x="64" y="237" width="44" height="9" rx="1" fill="#DCE7E4" />

          {/* Wooden inner pavilion chamber */}
          <rect x="71" y="212" width="30" height="26" rx="1" fill="#784F32" />
          <rect x="80" y="220" width="12" height="18" fill="#301E13" />
          <line x1="73" y1="212" x2="73" y2="237" stroke="#DDA86C" strokeWidth="2.5" />
          <line x1="99" y1="212" x2="99" y2="237" stroke="#DDA86C" strokeWidth="2.5" />

          {/* 11 Tiers of Meru Thatched Roofs */}
          {/* Tier 1 */}
          <path d="M49 214 Q86 200 123 214 L116 205 Q86 208 56 205 Z" fill="url(#nusaMeruGrad1)" />
          <rect x="75" y="196" width="22" height="9" fill="#784F32" />

          {/* Tier 2 */}
          <path d="M53 199 Q86 186 119 199 L113 191 Q86 193 59 191 Z" fill="url(#nusaMeruGrad2)" />
          <rect x="76" y="183" width="20" height="8" fill="#784F32" />

          {/* Tier 3 */}
          <path d="M57 185 Q86 173 115 185 L110 177 Q86 180 62 177 Z" fill="url(#nusaMeruGrad1)" />
          <rect x="77" y="170" width="18" height="7" fill="#784F32" />

          {/* Tier 4 */}
          <path d="M60 172 Q86 161 112 172 L107 165 Q86 167 65 165 Z" fill="url(#nusaMeruGrad2)" />
          <rect x="78" y="158" width="16" height="7" fill="#784F32" />

          {/* Tier 5 */}
          <path d="M63 160 Q86 150 109 160 L105 153 Q86 155 67 153 Z" fill="url(#nusaMeruGrad1)" />
          <rect x="79" y="147" width="14" height="6" fill="#784F32" />

          {/* Tier 6 */}
          <path d="M66 149 Q86 140 106 149 L102 143 Q86 145 70 143 Z" fill="url(#nusaMeruGrad2)" />
          <rect x="80" y="137" width="12" height="6" fill="#784F32" />

          {/* Tier 7 */}
          <path d="M69 139 Q86 131 103 139 L100 133 Q86 135 72 133 Z" fill="url(#nusaMeruGrad1)" />
          <rect x="81" y="127" width="10" height="6" fill="#784F32" />

          {/* Tier 8 */}
          <path d="M72 129 Q86 122 100 129 L97 124 Q86 125 75 124 Z" fill="url(#nusaMeruGrad2)" />
          <rect x="82" y="119" width="8" height="5" fill="#784F32" />

          {/* Tier 9 */}
          <path d="M74.5 120 Q86 114 97.5 120 L95 115 Q86 116 77 115 Z" fill="url(#nusaMeruGrad1)" />
          <rect x="83" y="110" width="6" height="5" fill="#784F32" />

          {/* Tier 10 */}
          <path d="M77 111 Q86 106 95 111 L93 106 Q86 107 79 106 Z" fill="url(#nusaMeruGrad2)" />

          {/* Tier 11 (Top Peak Cap) */}
          <path d="M79 102 Q86 97 93 102 L86 91 Z" fill="url(#nusaMeruGrad1)" />

          {/* Needle Spire & Golden Finial */}
          <line x1="86" y1="72" x2="86" y2="92" stroke="#233935" strokeWidth="2" strokeLinecap="round" />
          <circle cx="86" cy="85" r="2.5" fill="#F59E0B" />
          <line x1="86" y1="62" x2="86" y2="72" stroke="#233935" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* Companion Small 3-Tier Shrine on the Left */}
        <g id="companion-shrine">
          <rect x="18" y="258" width="22" height="12" rx="1" fill="#88A39B" />
          <path d="M12 258 Q29 250 46 258 L42 251 Q29 253 16 251 Z" fill="#2B3F3B" />
          <path d="M15 251 Q29 244 43 251 L40 245 Q29 247 18 245 Z" fill="#364E4A" />
          <path d="M18 245 Q29 238 40 245 L29 233 Z" fill="#2B3F3B" />
          <line x1="29" y1="225" x2="29" y2="233" stroke="#2B3F3B" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Foreground Lush Rolling Hills & Tropical Foliage */}
        <path
          d="M-20 400 L-20 295 Q45 280 110 315 Q185 345 280 305 L280 400 Z"
          fill="#388D76"
        />
        <path
          d="M-20 400 L-20 318 Q55 300 130 338 Q205 360 280 328 L280 400 Z"
          fill="#226E58"
        />
        <path
          d="M-20 400 L-20 345 Q45 330 100 365 Q170 388 280 355 L280 400 Z"
          fill="#0D4836"
        />

        {/* Tropical Leaves Frame at Bottom-Left */}
        <g opacity="0.88">
          <ellipse cx="14" cy="335" rx="22" ry="7.5" transform="rotate(-38 14 335)" fill="#54BA97" />
          <ellipse cx="32" cy="350" rx="25" ry="8.5" transform="rotate(-20 32 350)" fill="#73CFA9" />
          <ellipse cx="12" cy="368" rx="24" ry="8" transform="rotate(-10 12 368)" fill="#3C9E7D" />
          <ellipse cx="38" cy="382" rx="26" ry="9" transform="rotate(15 38 382)" fill="#54BA97" />
        </g>
      </svg>
    </div>
  )
}

export default function NusaDashboard({
  provinces,
  adventures,
  alias,
  demoUser,
  xp,
  level,
  streakDays,
  dailyDone,
  dailyTarget,
  cleared,
  initialTab = 'beranda',
  selectedProvince,
  onSelectProvince,
  onReturnHome,
  onOpenAuth,
  onCompleteQuizQuestion,
}: NusaDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mapRegion, setMapRegion] = useState<MapRegion>('all')
  const [mapZoom, setMapZoom] = useState(1)
  const [showExtraLabels, setShowExtraLabels] = useState(false)
  const [timeframe, setTimeframe] = useState<'7days' | '30days'>('7days')
  const [selectedPointIdx, setSelectedPointIdx] = useState(4)
  const [koleksiSearch, setKoleksiSearch] = useState('')
  const [koleksiRegion, setKoleksiRegion] = useState<MapRegion>('all')
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([])

  // Modal state (Cultural intro + Picture Quiz)
  const [modalStep, setModalStep] = useState<'story' | 'quiz'>('story')
  const [cardIndex, setCardIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [verdict, setVerdict] = useState<{ correct: boolean; explanation: string } | null>(null)
  const [checking, setChecking] = useState(false)
  const [bonusPoints, setBonusPoints] = useState(0)

  const displayName = demoUser ? demoUser.name : alias
  const clearedCount = Object.keys(cleared).length
  const exploredDisplayCount = Math.max(12, clearedCount)
  const totalTopics = useMemo(
    () =>
      Math.max(
        152,
        Object.values(adventures).reduce((sum, adv) => sum + adv.cards.length, 0),
      ),
    [adventures],
  )
  const points = 675 + bonusPoints + Math.max(0, xp - 80) * 2
  const unlockedBadgesCount = ACHIEVEMENTS.filter((b) => b.unlocked).length
  const dailyRatio = Math.min(dailyDone / dailyTarget, 1)

  function pushToast(text: string) {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id))
    }, 3000)
  }

  function switchTab(tab: DashboardTab) {
    setActiveTab(tab)
    setMobileMenuOpen(false)
  }

  function openProvinceById(slug: string, startInQuiz = false) {
    const normalized = slug === 'yogyakarta' ? 'yogya' : slug
    const found =
      provinces.find((p) => p.id === normalized) ??
      provinces.find((p) => p.id === slug) ??
      provinces[0]
    if (!found) return
    onSelectProvince(found)
    setCardIndex(0)
    setQuizIndex(0)
    setSelectedChoice(null)
    setVerdict(null)
    setModalStep(startInQuiz ? 'quiz' : 'story')
  }

  function closeProvinceModal() {
    onSelectProvince(null)
    setModalStep('story')
    setSelectedChoice(null)
    setVerdict(null)
  }

  function openDailyMissionQuiz() {
    const candidates = ['aceh', 'sumbar', 'bali', 'jakarta', 'yogya']
    const pick = candidates[Math.floor(Math.random() * candidates.length)]
    openProvinceById(pick, true)
  }

  async function handleSelectOption(question: QuizQuestion, optionIdx: number) {
    if (checking || verdict?.correct) return
    setSelectedChoice(optionIdx)
    setChecking(true)
    setVerdict(null)
    try {
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ questionId: question.id, choice: optionIdx }),
      })
      const result = (await response.json()) as {
        correct?: boolean
        explanation?: string
      }
      const isCorrect = Boolean(result.correct)
      setVerdict({
        correct: isCorrect,
        explanation:
          result.explanation ||
          (isCorrect
            ? 'Jawabanmu tepat! Terus jelajahi kekayaan budaya Nusantara.'
            : 'Belum tepat, coba amati kembali petunjuk gambar dan konteks budayanya.'),
      })
      if (isCorrect && selectedProvince) {
        setBonusPoints((p) => p + 25)
        onCompleteQuizQuestion(selectedProvince.id, true)
        pushToast('Selamat! +15 XP & +25 Poin berhasil ditambahkan ke progresmu.')
      }
    } catch {
      setVerdict({
        correct: false,
        explanation: 'Gagal memeriksa jawaban. Periksa koneksi lalu coba lagi.',
      })
    } finally {
      setChecking(false)
    }
  }

  const topFiveProvinces = useMemo(() => {
    const order = [
      { id: 'aceh', fallbackName: 'Aceh', pct: 98 },
      { id: 'sumbar', fallbackName: 'Sumatera Barat', pct: 95 },
      { id: 'bali', fallbackName: 'Bali', pct: 92 },
      { id: 'jakarta', fallbackName: 'DKI Jakarta', pct: 90 },
      { id: 'yogya', fallbackName: 'Yogyakarta', pct: 88 },
    ]
    return order.map((item, idx) => {
      const prov = provinces.find((p) => p.id === item.id)
      const adv = adventures[item.id]
      const highlight = PROVINCE_HIGHLIGHTS[item.id]
      return {
        rank: idx + 1,
        id: item.id,
        name: item.id === 'yogya' ? 'Yogyakarta' : (prov?.name ?? item.fallbackName),
        image: highlight?.thumb || adv?.cards[0]?.image || '',
        pct: item.pct,
      }
    })
  }, [adventures, provinces])

  const filteredProvinces = useMemo(() => {
    const q = koleksiSearch.trim().toLowerCase()
    return provinces.filter((prov) => {
      const reg = regionForProvince(prov.id)
      if (koleksiRegion !== 'all' && reg !== koleksiRegion) return false
      if (!q) return true
      const adv = adventures[prov.id]
      const inName = prov.name.toLowerCase().includes(q) || prov.island.toLowerCase().includes(q)
      const inCards = adv?.cards.some(
        (c) => c.title.toLowerCase().includes(q) || c.label.toLowerCase().includes(q),
      )
      return inName || Boolean(inCards)
    })
  }, [adventures, koleksiRegion, koleksiSearch, provinces])

  const leaderboardRows = useMemo(() => {
    const base = [
      { name: 'Raka Pratama', city: 'Bandung', xp: 420, badge: '🥇', isUser: false },
      { name: 'Nadia Putri', city: 'Surabaya', xp: 315, badge: '🥈', isUser: false },
      { name: 'Dimas Aditya', city: 'Yogyakarta', xp: 240, badge: '🥉', isUser: false },
      {
        name: `${displayName} (Anda)`,
        city: 'Indonesia',
        xp,
        badge: '⭐',
        isUser: true,
      },
      { name: 'Siti Rahma', city: 'Padang', xp: 65, badge: '🌿', isUser: false },
    ].sort((a, b) => b.xp - a.xp)
    return base.map((row, idx) => ({
      ...row,
      badge: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : row.isUser ? '⭐' : '🌿',
    }))
  }, [displayName, xp])

  const currentPoints = CHART_DATA[timeframe]
  const activeChartPoint = currentPoints[Math.min(selectedPointIdx, currentPoints.length - 1)]

  const activeAdventure = selectedProvince ? adventures[selectedProvince.id] : null
  const activeHighlight = selectedProvince ? PROVINCE_HIGHLIGHTS[selectedProvince.id] : null
  const activeCard: CultureCard | undefined = activeAdventure?.cards[cardIndex]
  const activeQuestion: QuizQuestion | undefined = activeAdventure?.questions[quizIndex]

  return (
    <div className="nusa-dashboard min-h-screen flex flex-col lg:flex-row selection:bg-emerald-200 selection:text-emerald-900">
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="bg-[#0D5C46] text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all duration-300"
          >
            <LucideSvg name="check-circle-2" className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30">
        <button
          type="button"
          onClick={onReturnHome}
          className="flex items-center gap-2.5 text-left"
          aria-label="Kembali ke halaman depan Tapak Nusa"
        >
          <NusaBrandPinLogo />
        </button>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200/60">
            <LucideSvg name="flame" className="w-3.5 h-3.5 text-orange-500" filled /> {streakDays}{' '}
            hari
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="p-2 rounded-xl bg-[#F0F7F4] text-[#0D5C46] hover:bg-emerald-100 transition"
            aria-label="Buka menu navigasi"
          >
            <LucideSvg name="menu" className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-white via-[#F9FCFA] to-[#E6F2EE] border-r border-emerald-100/80 flex flex-col justify-between transform ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen transition-transform duration-300 ease-in-out overflow-hidden shrink-0`}
      >
        <div className="p-5 relative z-10">
          {/* Brand Logo */}
          <div className="flex items-center justify-between mb-8 px-1">
            <button
              type="button"
              onClick={onReturnHome}
              className="cursor-pointer hover:opacity-90 transition text-left"
              title="Kembali ke halaman depan Tapak Nusa"
            >
              <NusaBrandPinLogo />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              aria-label="Tutup menu"
            >
              <LucideSvg name="x" className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5" aria-label="Menu Dashboard">
            {(
              [
                ['beranda', 'home', 'Beranda'],
                ['koleksi', 'book-open', 'Koleksi'],
                ['peringkat', 'bar-chart-2', 'Peringkat'],
                ['profil', 'user', 'Profil'],
              ] as [DashboardTab, string, string][]
            ).map(([id, icon, label]) => {
              const isActive = activeTab === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchTab(id)}
                  className={
                    isActive
                      ? 'w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 bg-gradient-to-r from-[#DCF2EA] to-[#EBF7F3] text-[#0D5C46] shadow-xs'
                      : 'w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold text-slate-600 hover:bg-emerald-50/70 hover:text-[#0D5C46] transition-all duration-200'
                  }
                >
                  <LucideSvg
                    name={icon}
                    className={`w-5 h-5 ${isActive ? 'text-[#0D5C46]' : ''}`}
                  />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>

          {/* Misi Hari Ini Card */}
          <button
            type="button"
            onClick={openDailyMissionQuiz}
            className="w-full text-left mt-7 p-4 rounded-2xl bg-gradient-to-br from-[#FFF9E6] via-[#FEF3C7] to-[#FDE68A]/70 border border-amber-200/80 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
          >
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <LucideSvg name="star" className="w-4 h-4" filled />
              </div>
              <span className="text-xs font-bold text-amber-800">Misi hari ini</span>
            </div>
            <p className="text-sm font-extrabold text-slate-800 mb-2.5">
              Jawab {dailyTarget} soal budaya
            </p>

            <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden mb-2 p-0.5">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(dailyRatio * 100, dailyDone > 0 ? 33.33 : 6)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-500">
                {Math.min(dailyDone, dailyTarget)} dari {dailyTarget} selesai
              </span>
              <span className="text-orange-600 bg-white/70 px-2 py-0.5 rounded-full">
                {dailyRatio >= 1 ? 'Selesai' : '+15 XP'}
              </span>
            </div>
          </button>
        </div>

        {/* Bottom Scenic Illustration (Pura Bali) */}
        <SidebarPuraScene />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:px-8 lg:py-6 max-w-[1400px] mx-auto w-full space-y-6">
        {/* TOP HEADER STATUS BAR (Desktop & Tablet) */}
        <div className="flex flex-wrap items-center justify-end gap-2.5 sm:gap-3">
          {/* Streak Badge */}
          <div className="flex items-center gap-2.5 bg-white/90 px-3.5 py-2 rounded-2xl shadow-card border border-amber-100/80">
            <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center">
              <LucideSvg name="flame" className="w-4 h-4 text-orange-500" filled />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-extrabold text-slate-800 block">
                {streakDays} hari
              </span>
              <span className="text-[10px] font-medium text-slate-400 block">Api aktif</span>
            </div>
          </div>

          {/* XP & Level Badge */}
          <div className="flex items-center gap-2.5 bg-white/90 px-3.5 py-2 rounded-2xl shadow-card border border-emerald-100/80">
            <div className="w-7 h-7 rounded-full bg-emerald-100/80 flex items-center justify-center">
              <LucideSvg name="star" className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="leading-tight">
              <span className="text-xs font-extrabold text-slate-800 block">{xp} XP</span>
              <span className="text-[10px] font-medium text-slate-400 block">
                Peringkat Lv. {level.level}
              </span>
            </div>
          </div>

          {/* Google Login / Switch Button */}
          <button
            type="button"
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-2 bg-white hover:bg-slate-50 px-3.5 py-2 rounded-2xl shadow-card border border-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>{demoUser ? demoUser.email.split('@')[0] : 'Masuk (Ganti)'}</span>
          </button>

          {/* User Initial Avatar */}
          <button
            type="button"
            onClick={() => switchTab('profil')}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm hover:scale-105 transition cursor-pointer"
            aria-label="Buka profil"
          >
            {displayName.slice(0, 1).toUpperCase()}
          </button>
        </div>

        {/* TAB 1: BERANDA (MAIN DASHBOARD) */}
        {activeTab === 'beranda' && (
          <div className="space-y-6">
            {/* HERO SECTION */}
            <section className="relative lg:-mt-4">
              {/* Subtle Decorative Clover Watermark on Right */}
              <svg
                className="hidden xl:block absolute right-6 top-2 w-28 h-28 text-emerald-200/40 pointer-events-none"
                viewBox="0 0 100 100"
                fill="currentColor"
                aria-hidden
              >
                <circle cx="35" cy="35" r="22" />
                <circle cx="65" cy="35" r="22" />
                <circle cx="35" cy="65" r="22" />
                <circle cx="65" cy="65" r="22" />
              </svg>

              <div className="flex flex-col md:flex-row md:items-center gap-5 mb-6">
                {/* Circular User Avatar with Online Green Dot */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                  <div className="w-full h-full rounded-full p-1 bg-white shadow-soft">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                      alt={`Foto profil ${displayName}`}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <span
                    className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
                    title="Online"
                  />
                </div>

                {/* Greeting & Headline */}
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-1">
                    Selamat datang kembali{demoUser ? `, ${demoUser.name}` : ''}!
                  </p>
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0D5C46] tracking-tight leading-tight">
                    {provinces.length} provinsi, {provinces.length} pintu perjalanan.
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-xl leading-relaxed">
                    Pilih provinsi mana pun, pelajari tiap pengantar budayanya, lalu uji pemahaman
                    melalui kuis bergambar.
                  </p>
                </div>
              </div>

              {/* 4 STAT CARDS + PRIMARY CTA ROW */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5 items-stretch">
                {/* Stat 1: Provinsi */}
                <div className="rounded-2xl px-4 py-3.5 bg-gradient-to-br from-[#FFEAE6] via-[#FFF3F0] to-[#FFF9F8] border border-rose-100/80 shadow-card flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FFD2CB] text-[#E11D48] flex items-center justify-center shrink-0">
                    <LucideSvg name="map-pin" className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                      {provinces.length}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Provinsi</div>
                  </div>
                </div>

                {/* Stat 2: Topik Budaya */}
                <div className="rounded-2xl px-4 py-3.5 bg-gradient-to-br from-[#E2F5EC] via-[#EDF9F3] to-[#F6FCF9] border border-emerald-100/80 shadow-card flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#C4EAD8] text-[#0D5C46] flex items-center justify-center shrink-0">
                    <LucideSvg name="book-open" className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                      {totalTopics}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      Topik Budaya
                    </div>
                  </div>
                </div>

                {/* Stat 3: Pencapaian */}
                <div className="rounded-2xl px-4 py-3.5 bg-gradient-to-br from-[#EFE9FB] via-[#F5F1FD] to-[#FAF8FE] border border-purple-100/80 shadow-card flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#DDD2F8] text-amber-600 flex items-center justify-center shrink-0">
                    <LucideSvg name="trophy" className="w-5 h-5" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                      {unlockedBadgesCount}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      Pencapaian
                    </div>
                  </div>
                </div>

                {/* Stat 4: Poin */}
                <div className="rounded-2xl px-4 py-3.5 bg-gradient-to-br from-[#FFF3D6] via-[#FFF8E6] to-[#FFFDF5] border border-amber-100/90 shadow-card flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#FDE29F] text-amber-600 flex items-center justify-center shrink-0">
                    <LucideSvg name="star" className="w-5 h-5" filled />
                  </div>
                  <div className="leading-tight">
                    <div className="text-xl sm:text-2xl font-extrabold text-slate-800">
                      {points}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">Poin</div>
                  </div>
                </div>

                {/* Primary CTA Button: Lanjut Belajar -> */}
                <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-center relative">
                  <svg
                    className="absolute -top-2.5 -right-1.5 w-6 h-6 text-amber-400 pointer-events-none z-10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <line x1="6" y1="12" x2="12" y2="4" />
                    <line x1="12" y1="15" x2="20" y2="10" />
                    <line x1="14" y1="20" x2="22" y2="19" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => openProvinceById('aceh')}
                    className="w-full h-full min-h-[56px] bg-gradient-to-r from-[#0D5C46] to-[#117257] hover:from-[#094333] hover:to-[#0D5C46] text-white font-bold text-sm px-6 py-3.5 rounded-full shadow-float flex items-center justify-center gap-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Lanjut Belajar</span>
                    <LucideSvg name="arrow-right" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* INTERACTIVE MAP CARD: PETA EKSPLORASI INDONESIA */}
            <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-emerald-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#0D5C46] flex items-center justify-center shrink-0 mt-0.5">
                    <LucideSvg name="map" className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-800">
                      Peta Eksplorasi Indonesia
                    </h2>
                    <p className="text-xs text-slate-500">
                      Klik provinsi untuk melihat detail budaya dan tantangannya.
                    </p>
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
                    {(
                      [
                        ['all', 'Semua'],
                        ['barat', 'Barat'],
                        ['tengah', 'Tengah'],
                        ['timur', 'Timur'],
                      ] as [MapRegion, string][]
                    ).map(([reg, label]) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setMapRegion(reg)}
                        className={
                          mapRegion === reg
                            ? 'px-4 py-1.5 rounded-full text-xs font-bold bg-[#0D5C46] text-white shadow-xs transition cursor-pointer'
                            : 'px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:bg-white transition cursor-pointer'
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExtraLabels((v) => !v)
                      pushToast(
                        !showExtraLabels
                          ? 'Menampilkan pin wilayah tambahan'
                          : 'Tampilan peta ringkas aktif',
                      )
                    }}
                    title="Tampilkan/Sembunyikan Semua Label"
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${
                      showExtraLabels
                        ? 'border-[#0D5C46] bg-emerald-50 text-[#0D5C46]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <LucideSvg name="sliders-horizontal" className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Interactive Map Canvas Container */}
              <div className="relative w-full h-[340px] sm:h-[400px] lg:h-[430px] rounded-2xl overflow-hidden map-ocean border border-cyan-200/60 select-none">
                <div
                  className="w-full h-full transition-transform duration-300 ease-out origin-center relative"
                  style={{ transform: `scale(${mapZoom})` }}
                >
                  <svg
                    viewBox="0 0 1000 420"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                    aria-label="Peta Kepulauan Indonesia"
                  >
                    {/* Subtle Ocean Latitude/Longitude Grid */}
                    <g stroke="#FFFFFF" strokeWidth="0.6" strokeDasharray="4 4" opacity="0.35">
                      <line x1="0" y1="105" x2="1000" y2="105" />
                      <line x1="0" y1="210" x2="1000" y2="210" />
                      <line x1="0" y1="315" x2="1000" y2="315" />
                      <line x1="250" y1="0" x2="250" y2="420" />
                      <line x1="500" y1="0" x2="500" y2="420" />
                      <line x1="750" y1="0" x2="750" y2="420" />
                    </g>

                    {/* WILAYAH BARAT: SUMATERA & JAWA */}
                    <g
                      style={{ opacity: mapRegion === 'all' || mapRegion === 'barat' ? 1 : 0.35 }}
                      className="transition-opacity duration-300"
                    >
                      {/* Sumatera */}
                      <path
                        d="M68 78 L96 68 L134 94 L172 132 L212 174 L246 218 L266 254 L250 272 L218 252 L182 212 L142 172 L102 128 L74 96 Z"
                        className={`island-land ${mapRegion === 'barat' ? 'island-highlight' : ''}`}
                      />
                      {/* Nias, Mentawai, Kepri, Bangka, Belitung */}
                      <circle cx="96" cy="144" r="5" className="island-land" />
                      <circle cx="132" cy="192" r="5.5" className="island-land" />
                      <circle cx="238" cy="166" r="5.5" className="island-land" />
                      <ellipse cx="272" cy="218" rx="11" ry="7" className="island-land" />
                      <circle cx="296" cy="226" r="6" className="island-land" />

                      {/* Jawa & Madura */}
                      <path
                        d="M272 288 L318 282 L368 288 L418 294 L468 298 L482 308 L468 318 L412 316 L354 310 L294 304 L270 296 Z"
                        className={`island-land ${mapRegion === 'barat' ? 'island-highlight' : ''}`}
                      />
                      <ellipse cx="462" cy="290" rx="12" ry="4" className="island-land" />
                    </g>

                    {/* WILAYAH TENGAH: KALIMANTAN, SULAWESI, BALI & NUSA TENGGARA */}
                    <g
                      style={{ opacity: mapRegion === 'all' || mapRegion === 'tengah' ? 1 : 0.35 }}
                      className="transition-opacity duration-300"
                    >
                      {/* Kalimantan */}
                      <path
                        d="M342 152 L374 128 L418 112 L456 84 L486 96 L496 132 L488 166 L472 204 L444 228 L398 226 L358 216 L336 184 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />

                      {/* Sulawesi */}
                      <path
                        d="M542 146 L576 132 L626 126 L634 138 L584 148 L572 168 L612 178 L606 192 L574 186 L588 224 L574 236 L558 206 L544 234 L530 228 L538 182 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />

                      {/* Bali, Lombok, Sumbawa, Flores, Sumba, Timor */}
                      <ellipse
                        cx="498"
                        cy="310"
                        rx="9"
                        ry="5.5"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                      <ellipse
                        cx="522"
                        cy="312"
                        rx="8"
                        ry="5"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                      <path
                        d="M536 308 L572 307 L575 318 L538 319 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                      <path
                        d="M584 309 L638 307 L642 317 L586 319 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                      <path
                        d="M566 330 L594 333 L590 344 L564 340 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                      <path
                        d="M634 334 L680 320 L686 332 L638 346 Z"
                        className={`island-land ${mapRegion === 'tengah' ? 'island-highlight' : ''}`}
                      />
                    </g>

                    {/* WILAYAH TIMUR: MALUKU & PAPUA */}
                    <g
                      style={{ opacity: mapRegion === 'all' || mapRegion === 'timur' ? 1 : 0.35 }}
                      className="transition-opacity duration-300"
                    >
                      {/* Halmahera, Buru, Seram */}
                      <path
                        d="M676 126 L696 118 L702 152 L682 162 Z"
                        className={`island-land ${mapRegion === 'timur' ? 'island-highlight' : ''}`}
                      />
                      <ellipse cx="662" cy="198" rx="11" ry="6" className="island-land" />
                      <path
                        d="M682 192 L726 190 L730 203 L684 204 Z"
                        className={`island-land ${mapRegion === 'timur' ? 'island-highlight' : ''}`}
                      />
                      {/* Papua */}
                      <path
                        d="M754 166 L792 154 L816 172 L838 168 L888 184 L952 198 L958 274 L912 272 L884 246 L842 234 L812 204 L762 190 Z"
                        className={`island-land ${mapRegion === 'timur' ? 'island-highlight' : ''}`}
                      />
                    </g>
                  </svg>

                  {/* Interactive 38-Province Exploration Dots */}
                  {provinces.map((prov, index) => {
                    const reg = regionForProvince(prov.id)
                    const dimmed = mapRegion !== 'all' && mapRegion !== reg
                    const isChallenge = index % 6 === 3
                    return (
                      <button
                        key={prov.id}
                        type="button"
                        onClick={() => openProvinceById(prov.id)}
                        title={`${prov.name} (${prov.island})`}
                        aria-label={`Jelajahi ${prov.name}`}
                        style={{
                          left: `${prov.x}%`,
                          top: `${prov.y}%`,
                          opacity: dimmed ? 0.2 : 0.9,
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white/80 shadow-xs transition-transform hover:scale-150 cursor-pointer z-10 ${
                          cleared[prov.id] !== undefined
                            ? 'bg-emerald-600'
                            : isChallenge
                              ? 'bg-amber-500'
                              : 'bg-[#22A06B]'
                        }`}
                      />
                    )
                  })}

                  {/* INTERACTIVE PROVINCE CALLOUT PINS (Matching Screenshot) */}

                  {/* 1. ACEH (Featured Active Card Popup) */}
                  {(mapRegion === 'all' || mapRegion === 'barat') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('aceh')}
                      className="absolute left-[4%] sm:left-[6%] top-[6%] sm:top-[8%] z-20 cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md p-2 pr-4 rounded-2xl shadow-float border border-emerald-100 group-hover:scale-105 transition-transform">
                        <img
                          src={PROVINCE_HIGHLIGHTS.aceh.thumb}
                          alt="Aceh"
                          className="w-11 h-11 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-800">
                            Aceh
                          </div>
                          <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <span>Pelajari budaya Aceh</span>
                            <LucideSvg name="arrow-right" className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                      <div className="mt-1.5 ml-6 relative w-7 h-7 flex items-center justify-center text-orange-500 pin-pulse">
                        <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md relative z-10">
                          <LucideSvg name="map-pin" className="w-4 h-4" filled />
                        </div>
                      </div>
                    </button>
                  )}

                  {/* 2. SUMATERA BARAT */}
                  {(mapRegion === 'all' || mapRegion === 'barat') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('sumbar')}
                      className="absolute left-[13%] sm:left-[16%] top-[41%] sm:top-[42%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3.5 rounded-full shadow-md border border-slate-100 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.sumbar.thumb}
                          alt="Sumatera Barat"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          Sumatera Barat
                        </span>
                      </div>
                    </button>
                  )}

                  {/* 3. DKI JAKARTA */}
                  {(mapRegion === 'all' || mapRegion === 'barat') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('jakarta')}
                      className="absolute left-[26%] sm:left-[29%] top-[62%] sm:top-[63%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3.5 rounded-full shadow-md border border-slate-100 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.jakarta.thumb}
                          alt="DKI Jakarta"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          DKI Jakarta
                        </span>
                      </div>
                    </button>
                  )}

                  {/* 4. YOGYAKARTA (shown when extra labels or Barat filter) */}
                  {(showExtraLabels || mapRegion === 'barat') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('yogya')}
                      className="hidden sm:flex absolute left-[38%] top-[74%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3 rounded-full shadow-md border border-slate-100 group-hover:scale-105 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.yogya.thumb}
                          alt="DI Yogyakarta"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          DI Yogyakarta
                        </span>
                      </div>
                    </button>
                  )}

                  {/* 5. BALI */}
                  {(mapRegion === 'all' || mapRegion === 'tengah') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('bali')}
                      className="absolute left-[46%] sm:left-[48%] top-[68%] sm:top-[70%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3.5 rounded-full shadow-md border border-slate-100 group-hover:scale-105 group-hover:border-emerald-300 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.bali.thumb}
                          alt="Bali"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          Bali
                        </span>
                      </div>
                    </button>
                  )}

                  {/* 6. SULAWESI SELATAN (shown on Tengah filter or extra labels) */}
                  {(showExtraLabels || mapRegion === 'tengah') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('sulsel')}
                      className="absolute left-[56%] top-[44%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3 rounded-full shadow-md border border-slate-100 group-hover:scale-105 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.sulsel.thumb}
                          alt="Sulawesi Selatan"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          Sulawesi Selatan
                        </span>
                      </div>
                    </button>
                  )}

                  {/* 7. PAPUA (shown on Timur filter or extra labels) */}
                  {(showExtraLabels || mapRegion === 'timur') && (
                    <button
                      type="button"
                      onClick={() => openProvinceById('papua')}
                      className="absolute left-[79%] top-[45%] z-20 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 pr-3 rounded-full shadow-md border border-slate-100 group-hover:scale-105 transition-all">
                        <img
                          src={PROVINCE_HIGHLIGHTS.papua.thumb}
                          alt="Papua"
                          className="w-7 h-7 rounded-full object-cover shrink-0"
                        />
                        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">
                          Papua
                        </span>
                      </div>
                    </button>
                  )}
                </div>

                {/* Map Controls: Zoom (+/-) Top Right */}
                <div className="absolute top-3.5 right-3.5 flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden z-30">
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.min(1.6, +(z + 0.15).toFixed(2)))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold border-b border-slate-100 transition cursor-pointer"
                    title="Perbesar"
                    aria-label="Perbesar peta"
                  >
                    <LucideSvg name="plus" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapZoom((z) => Math.max(0.85, +(z - 0.15).toFixed(2)))}
                    className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-50 font-bold transition cursor-pointer"
                    title="Perkecil"
                    aria-label="Perkecil peta"
                  >
                    <LucideSvg name="minus" className="w-4 h-4" />
                  </button>
                </div>

                {/* Map Control: Reset Compass Bottom Left */}
                <button
                  type="button"
                  onClick={() => {
                    setMapZoom(1)
                    setMapRegion('all')
                  }}
                  title="Reset Posisi Peta"
                  aria-label="Reset posisi peta"
                  className="absolute bottom-3.5 left-3.5 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow-md flex items-center justify-center z-30 transition cursor-pointer"
                >
                  <LucideSvg name="navigation" className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* BOTTOM 2-COLUMN SECTION */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT COLUMN: TOP 5 PROVINSI PALING AKTIF */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-emerald-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center">
                        <LucideSvg name="trophy" className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-extrabold text-slate-800">
                        Top 5 Provinsi Paling Aktif
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => switchTab('koleksi')}
                      className="text-xs font-bold text-[#0D5C46] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Lihat Semua</span>
                      <LucideSvg name="arrow-right" className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    {topFiveProvinces.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openProvinceById(item.id)}
                        className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-emerald-50/60 cursor-pointer transition group text-left"
                      >
                        <span className="w-6 h-6 rounded-full bg-emerald-50 text-[#0D5C46] font-extrabold text-xs flex items-center justify-center shrink-0">
                          {item.rank}.
                        </span>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-8 rounded-full object-cover shrink-0 shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0D5C46] truncate block mb-1.5">
                            {item.name}
                          </span>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#0D5C46] to-[#14B8A6] rounded-full"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-700 pl-2 shrink-0">
                          {item.pct}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: PROGRES BELAJAR ANDA */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-emerald-50 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                      <LucideSvg name="bar-chart-3" className="w-4 h-4" />
                    </div>
                    <h2 className="text-base font-extrabold text-slate-800">
                      Progres Belajar Anda
                    </h2>
                  </div>

                  <select
                    value={timeframe}
                    onChange={(e) => {
                      const next = e.target.value as '7days' | '30days'
                      setTimeframe(next)
                      setSelectedPointIdx(next === '7days' ? 4 : 2)
                      pushToast(
                        next === '30days'
                          ? 'Menampilkan statistik belajar 30 hari terakhir'
                          : 'Menampilkan statistik belajar 7 hari terakhir',
                      )
                    }}
                    aria-label="Rentang waktu progres belajar"
                    className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl px-3 py-1.5 outline-none cursor-pointer transition"
                  >
                    <option value="7days">7 Hari Terakhir</option>
                    <option value="30days">30 Hari Terakhir</option>
                  </select>
                </div>

                {/* Smooth Spline Line & Area Chart */}
                <div className="relative w-full h-64 sm:h-72 mt-2">
                  <svg viewBox="0 0 600 250" className="w-full h-full overflow-visible">
                    <defs>
                      <linearGradient id="nusaAreaTealGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14B8A6" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Subtle Vertical Grid Lines */}
                    <g stroke="#F1F5F9" strokeWidth="1.5">
                      {currentPoints.map((pt) => (
                        <line key={pt.day} x1={pt.x} y1="30" x2={pt.x} y2="210" />
                      ))}
                    </g>

                    {timeframe === '7days' ? (
                      <>
                        <path
                          d="M 50 155 C 90 150, 105 144, 133 138 C 165 130, 185 114, 216 110 C 250 105, 270 104, 300 96 C 335 86, 355 64, 383 64 C 415 64, 438 86, 466 94 C 500 104, 525 104, 550 100 L 550 210 L 50 210 Z"
                          fill="url(#nusaAreaTealGrad)"
                        />
                        <path
                          d="M 50 155 C 90 150, 105 144, 133 138 C 165 130, 185 114, 216 110 C 250 105, 270 104, 300 96 C 335 86, 355 64, 383 64 C 415 64, 438 86, 466 94 C 500 104, 525 104, 550 100"
                          fill="none"
                          stroke="#14B8A6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </>
                    ) : (
                      <>
                        <path
                          d="M 50 148 C 100 140, 135 128, 175 120 C 225 108, 260 86, 300 82 C 350 78, 385 98, 425 96 C 475 94, 515 76, 550 68 L 550 210 L 50 210 Z"
                          fill="url(#nusaAreaTealGrad)"
                        />
                        <path
                          d="M 50 148 C 100 140, 135 128, 175 120 C 225 108, 260 86, 300 82 C 350 78, 385 98, 425 96 C 475 94, 515 76, 550 68"
                          fill="none"
                          stroke="#14B8A6"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {/* Interactive Data Points */}
                    <g>
                      {currentPoints.map((pt, idx) => {
                        const isPeak = pt.day === activeChartPoint.day
                        return (
                          <g
                            key={pt.day}
                            className="cursor-pointer"
                            onClick={() => setSelectedPointIdx(idx)}
                          >
                            {isPeak && (
                              <circle cx={pt.x} cy={pt.y} r="11" fill="#F59E0B" opacity="0.22" />
                            )}
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r={isPeak ? 6 : 5}
                              fill={isPeak ? '#F59E0B' : '#FFFFFF'}
                              stroke={isPeak ? '#FFFFFF' : '#14B8A6'}
                              strokeWidth={isPeak ? 2.5 : 3}
                            />
                          </g>
                        )
                      })}
                    </g>

                    {/* Floating Tooltip Pill */}
                    <g
                      transform={`translate(${activeChartPoint.x}, ${activeChartPoint.y - 36})`}
                      className="transition-transform duration-300"
                    >
                      <rect
                        x="-36"
                        y="-14"
                        width="72"
                        height="26"
                        rx="13"
                        fill="#FFFFFF"
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill="#1E293B"
                        fontSize="11"
                        fontWeight="800"
                      >
                        {activeChartPoint.label}
                      </text>
                    </g>

                    {/* X-Axis Labels */}
                    <g fill="#94A3B8" fontSize="11" fontWeight="600" textAnchor="middle">
                      {currentPoints.map((pt) => (
                        <text
                          key={pt.day}
                          x={pt.x}
                          y="232"
                          fill={pt.day === activeChartPoint.day ? '#475569' : '#94A3B8'}
                          fontWeight={pt.day === activeChartPoint.day ? '700' : '600'}
                        >
                          {pt.day}
                        </text>
                      ))}
                    </g>
                  </svg>
                </div>
              </div>
            </section>

            {/* BOTTOM ACHIEVEMENT BANNER */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#E6F4F1] via-[#FBF7EB] to-[#FEF3C7]/80 border border-amber-200/60 shadow-soft">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 sm:px-8 sm:py-5 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Left Scenic Temple Illustration */}
                  <div className="hidden sm:block w-32 h-20 rounded-2xl overflow-hidden shrink-0 relative bg-[#CBE7E2]">
                    <svg viewBox="0 0 160 100" className="w-full h-full object-cover" aria-hidden>
                      <rect width="160" height="100" fill="#D8EFEA" />
                      <path
                        d="M0 64 Q45 44 95 58 T160 52 L160 100 L0 100 Z"
                        fill="#9AD3C8"
                      />
                      <g transform="translate(42, 8)">
                        <rect x="14" y="64" width="32" height="12" fill="#2D4A46" />
                        <path d="M8 64 L30 55 L52 64 Z" fill="#1E3532" />
                        <path d="M11 55 L30 46 L49 55 Z" fill="#253F3C" />
                        <path d="M14 46 L30 37 L46 46 Z" fill="#1E3532" />
                        <path d="M17 37 L30 29 L43 37 Z" fill="#253F3C" />
                        <path d="M20 29 L30 21 L40 29 Z" fill="#1E3532" />
                        <line x1="30" y1="13" x2="30" y2="21" stroke="#1E3532" strokeWidth="2" />
                      </g>
                      <g transform="translate(92, 34)">
                        <rect x="6" y="40" width="16" height="8" fill="#2D4A46" />
                        <path d="M2 40 L14 34 L26 40 Z" fill="#1E3532" />
                        <path d="M5 34 L14 28 L23 34 Z" fill="#253F3C" />
                      </g>
                      <path
                        d="M0 100 L0 74 Q42 68 78 88 L160 82 L160 100 Z"
                        fill="#2A7560"
                      />
                    </svg>
                  </div>

                  {/* Circular Gold Star Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shrink-0 animate-float">
                    <LucideSvg name="star" className="w-6 h-6 sm:w-7 sm:h-7" filled />
                  </div>

                  {/* Motivational Copy */}
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                      Hebat sekali!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Kamu sudah menjelajahi{' '}
                      <span className="font-bold text-[#0D5C46]">
                        {exploredDisplayCount} provinsi
                      </span>{' '}
                      sejauh ini! Terus belajar untuk membuka lebih banyak cerita Indonesia.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => switchTab('profil')}
                  className="w-full md:w-auto shrink-0 bg-[#0D5C46] hover:bg-[#094333] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.02] cursor-pointer"
                >
                  <span>Lihat Pencapaian</span>
                  <LucideSvg name="arrow-right" className="w-4 h-4" />
                </button>
              </div>
            </section>
          </div>
        )}

        {/* TAB 2: KOLEKSI BUDAYA */}
        {activeTab === 'koleksi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-emerald-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0D5C46]">
                    Koleksi Budaya Nusantara
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Jelajahi ensiklopedia mini rumah adat, pakaian tradisional, musik, dan kuliner
                    khas {provinces.length} provinsi.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-full border border-slate-100">
                    {(
                      [
                        ['all', 'Semua'],
                        ['barat', 'Barat'],
                        ['tengah', 'Tengah'],
                        ['timur', 'Timur'],
                      ] as [MapRegion, string][]
                    ).map(([reg, label]) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setKoleksiRegion(reg)}
                        className={
                          koleksiRegion === reg
                            ? 'px-3 py-1 rounded-full text-xs font-bold bg-[#0D5C46] text-white'
                            : 'px-3 py-1 rounded-full text-xs font-semibold text-slate-600 hover:bg-white'
                        }
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <div className="relative flex-1 sm:flex-none">
                    <span className="text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                      <LucideSvg name="search" className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={koleksiSearch}
                      onChange={(e) => setKoleksiSearch(e.target.value)}
                      placeholder="Cari provinsi atau budaya..."
                      className="pl-9 pr-4 py-2 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium outline-none focus:border-[#0D5C46] w-full sm:w-60"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProvinces.map((prov) => {
                  const adv = adventures[prov.id]
                  const firstCard = adv?.cards[0]
                  const secondCard = adv?.cards[1]
                  const reg = regionForProvince(prov.id)
                  const isDone = cleared[prov.id] !== undefined
                  return (
                    <button
                      key={prov.id}
                      type="button"
                      onClick={() => openProvinceById(prov.id)}
                      className="text-left rounded-2xl border border-slate-100 overflow-hidden bg-slate-50/40 hover:bg-white hover:shadow-md transition cursor-pointer group flex flex-col"
                    >
                      <div className="h-40 overflow-hidden relative w-full bg-emerald-950/10">
                        <img
                          src={firstCard?.image}
                          alt={firstCard?.alt || prov.name}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/90 text-[#0D5C46] text-[10px] font-extrabold">
                          {regionLabelFor(reg)}
                        </span>
                        {isDone && (
                          <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold">
                            Tuntas
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between w-full">
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm mb-1">
                            {prov.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-3">{adv?.intro}</p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] font-bold text-[#0D5C46] gap-2">
                          <span className="truncate">
                            {firstCard?.title}
                            {secondCard ? ` • ${secondCard.title}` : ''}
                          </span>
                          <span className="shrink-0">Pelajari →</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PERINGKAT (LEADERBOARD) */}
        {activeTab === 'peringkat' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-emerald-50">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0D5C46]">
                    Papan Peringkat Penjelajah
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Kumpulkan XP dari kuis budaya untuk naik ke Liga Nusantara Emas!
                  </p>
                </div>
                <span className="px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-extrabold">
                  Musim Aktif 2026
                </span>
              </div>

              <div className="space-y-3">
                {leaderboardRows.map((u) => (
                  <div
                    key={u.name}
                    className={`flex items-center justify-between p-3.5 rounded-2xl ${
                      u.isUser
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'bg-slate-50/70 border border-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-7 text-center font-extrabold text-base text-slate-600">
                        {u.badge}
                      </span>
                      <div>
                        <div className="text-sm font-extrabold text-slate-800">{u.name}</div>
                        <div className="text-[11px] text-slate-500">Penjelajah dari {u.city}</div>
                      </div>
                    </div>
                    <span className="px-3.5 py-1 rounded-full bg-white text-[#0D5C46] font-extrabold text-xs shadow-xs">
                      {u.xp} XP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFIL & PENCAPAIAN */}
        {activeTab === 'profil' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-emerald-50">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 pb-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80"
                    alt={displayName}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-emerald-100"
                  />
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-extrabold text-slate-800">{displayName}</h2>
                    <p className="text-xs text-slate-500 mb-2.5">
                      {level.title} Tingkat {level.level} •{' '}
                      {demoUser ? demoUser.email : 'Bergabung sejak 2026'}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#0D5C46] text-xs font-bold">
                        {exploredDisplayCount}/{provinces.length} Provinsi Terbuka
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                        {unlockedBadgesCount} Lencana Diraih
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {xp} XP • {points} Poin
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-4 py-2.5 rounded-full border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100 text-[#0D5C46] text-xs font-extrabold transition cursor-pointer shrink-0"
                >
                  {demoUser ? 'Kelola Akun' : 'Hubungkan Gmail'}
                </button>
              </div>

              <h3 className="text-base font-extrabold text-slate-800 mt-6 mb-4">
                Lencana Pencapaian Anda ({unlockedBadgesCount}/{ACHIEVEMENTS.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACHIEVEMENTS.map((b) => (
                  <div
                    key={b.title}
                    className={`p-4 rounded-2xl border text-center transition ${
                      b.unlocked
                        ? 'bg-gradient-to-br from-amber-50 to-white border-amber-100'
                        : 'bg-slate-50/70 border-slate-200/70 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-xs ${
                        b.unlocked ? 'bg-amber-400 text-white' : 'bg-slate-300 text-white'
                      }`}
                    >
                      <LucideSvg name={b.icon} className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-extrabold text-slate-800 mb-1">{b.title}</div>
                    <div className="text-[11px] text-slate-500">{b.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* INTERACTIVE PROVINCE & PICTURE QUIZ MODAL */}
      {selectedProvince && activeAdventure && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
          onMouseDown={closeProvinceModal}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-100 transform transition-all"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-44 sm:h-52 bg-emerald-900">
              <img
                src={
                  modalStep === 'quiz' && activeQuestion?.image
                    ? activeQuestion.image
                    : activeCard?.image || activeHighlight?.thumb || ''
                }
                alt={selectedProvince.name}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent" />

              <button
                type="button"
                onClick={closeProvinceModal}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                aria-label="Tutup modal"
              >
                <LucideSvg name="x" className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                  {regionLabelFor(regionForProvince(selectedProvince.id))} •{' '}
                  {selectedProvince.island}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold">
                  Provinsi {selectedProvince.name}
                </h3>
                <p className="text-xs text-emerald-100 line-clamp-1">
                  {activeHighlight?.tagline ||
                    activeAdventure.cards.map((c) => c.title).join(' • ')}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {modalStep === 'story' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0D5C46]">
                      <LucideSvg name="sparkles" className="w-4 h-4" />
                      <span>
                        Pengantar Budaya ({cardIndex + 1}/{activeAdventure.cards.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {activeAdventure.cards.map((c, idx) => (
                        <button
                          key={c.title}
                          type="button"
                          onClick={() => setCardIndex(idx)}
                          className={`h-1.5 rounded-full transition-all cursor-pointer ${
                            idx === cardIndex ? 'w-6 bg-[#0D5C46]' : 'w-2 bg-slate-200'
                          }`}
                          aria-label={`Materi ${idx + 1}: ${c.title}`}
                        />
                      ))}
                    </div>
                  </div>

                  {activeCard && (
                    <div className="mb-4">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        {activeCard.label}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-800 mt-0.5 mb-1.5">
                        {activeCard.title}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{activeCard.text}</p>
                      <p className="text-[11px] text-slate-400 mt-2">Sumber: {activeCard.source}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2.5 mb-6">
                    {activeAdventure.cards.slice(0, 3).map((c, idx) => (
                      <button
                        key={c.title}
                        type="button"
                        onClick={() => setCardIndex(idx)}
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                          cardIndex === idx
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-slate-50 border-slate-100 hover:bg-slate-100/70'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-slate-400 uppercase block truncate">
                          {c.label}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 mt-0.5 block truncate">
                          {c.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {cardIndex < activeAdventure.cards.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCardIndex((i) => i + 1)}
                        className="px-5 py-2.5 rounded-full text-xs font-bold text-[#0D5C46] bg-emerald-50 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        Cerita Berikutnya →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={closeProvinceModal}
                        className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Tutup
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setModalStep('quiz')
                        setQuizIndex(0)
                        setSelectedChoice(null)
                        setVerdict(null)
                      }}
                      className="flex-1 bg-gradient-to-r from-[#0D5C46] to-[#117257] hover:from-[#094333] hover:to-[#0D5C46] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <LucideSvg name="help-circle" className="w-4 h-4" />
                      <span>Uji Pemahaman (Kuis +15 XP)</span>
                    </button>
                  </div>
                </div>
              ) : activeQuestion ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      Kuis Budaya Bergambar ({quizIndex + 1}/{activeAdventure.questions.length})
                    </span>
                    <span className="text-xs font-bold text-slate-400">+15 XP & +25 Poin</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-800 mb-4">
                    {activeQuestion.q}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    {activeQuestion.options.map((opt, idx) => {
                      const isChosen = selectedChoice === idx
                      const stateClass =
                        isChosen && verdict
                          ? verdict.correct
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                            : 'border-rose-400 bg-rose-50 text-rose-800'
                          : 'border-slate-100 hover:border-[#0D5C46] bg-slate-50/70 hover:bg-emerald-50/50 text-slate-700'

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => void handleSelectOption(activeQuestion, idx)}
                          className={`p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition flex items-center gap-2.5 cursor-pointer ${stateClass}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-500 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </button>
                      )
                    })}
                  </div>

                  {checking && (
                    <div className="p-3 rounded-2xl text-xs font-bold mb-3 bg-slate-100 text-slate-600">
                      Memeriksa jawaban...
                    </div>
                  )}

                  {verdict && (
                    <div
                      className={`p-3.5 rounded-2xl text-xs font-bold mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${
                        verdict.correct
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span>
                        {verdict.correct ? '🎉 Tepat sekali! ' : ''}
                        {verdict.explanation}
                      </span>
                      {verdict.correct && (
                        <div className="flex items-center gap-2 shrink-0">
                          {quizIndex < activeAdventure.questions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => {
                                setQuizIndex((i) => i + 1)
                                setSelectedChoice(null)
                                setVerdict(null)
                              }}
                              className="px-3.5 py-1.5 rounded-full bg-[#0D5C46] text-white cursor-pointer"
                            >
                              Soal Berikutnya →
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={closeProvinceModal}
                              className="px-3.5 py-1.5 rounded-full bg-[#0D5C46] text-white cursor-pointer"
                            >
                              Selesai
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setModalStep('story')}
                      className="text-xs font-bold text-slate-500 hover:text-[#0D5C46] cursor-pointer"
                    >
                      ← Kembali ke Pengantar Budaya
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
