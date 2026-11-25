'use client'

import Script from 'next/script'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  musicCardImages,
  musicDistractors,
  musicEntries,
  musicQuizImages,
} from '../../data/music-content'

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
type Province = {
  id: string
  name: string
  island: string
  x: number
  y: number
  tone: string
  status: 'done' | 'open' | 'locked'
  score?: number
}
type CultureCard = {
  label: string
  title: string
  text: string
  source: string
  image: string
  alt: string
  credit: string
}
type QuizQuestion = {
  q: string
  options: string[]
  answer: number
  why: string
  image: string
  alt: string
  credit: string
}
type Adventure = {
  province: string
  intro: string
  cards: CultureCard[]
  questions: QuizQuestion[]
}

type DemoUser = {
  email: string
  name: string
}

const coreProvinces: Province[] = [
  {
    id: 'aceh',
    name: 'Aceh',
    island: 'Sumatra',
    x: 7,
    y: 27,
    tone: '#ee7f42',
    status: 'done',
    score: 5,
  },
  {
    id: 'sumbar',
    name: 'Sumatera Barat',
    island: 'Sumatra',
    x: 12,
    y: 46,
    tone: '#edb63f',
    status: 'open',
  },
  {
    id: 'jakarta',
    name: 'DKI Jakarta',
    island: 'Jawa',
    x: 28,
    y: 67,
    tone: '#66b695',
    status: 'open',
  },
  {
    id: 'yogya',
    name: 'DI Yogyakarta',
    island: 'Jawa',
    x: 36,
    y: 76,
    tone: '#638fb0',
    status: 'open',
  },
  {
    id: 'bali',
    name: 'Bali',
    island: 'Nusa Tenggara',
    x: 44,
    y: 70,
    tone: '#b86f7a',
    status: 'open',
  },
]

const sumbarCards: CultureCard[] = [
  {
    label: 'Arsitektur',
    title: 'Rumah Gadang',
    text: 'Atap gonjongnya menjulang seperti tanduk kerbau. Rumah komunal Minangkabau ini menjadi ruang hidup, musyawarah, dan pewarisan nilai.',
    source: 'Kemendikbud RI',
    image:
      'https://images.unsplash.com/photo-1599466610297-aaced28a8a1c?auto=format&fit=crop&w=1400&q=88',
    alt: 'Bangunan Rumah Gadang beratap gonjong di Sumatera Barat',
    credit: 'Foto: Erlia Abdul Hak / Unsplash',
  },
  {
    label: 'Tradisi tutur',
    title: 'Petatah-petitih',
    text: 'Ungkapan adat menjadi pedoman hidup masyarakat Minangkabau. Pesan disampaikan dengan perumpamaan yang dekat dengan alam.',
    source: 'Warisan Budaya Takbenda Indonesia',
    image:
      'https://images.unsplash.com/photo-1561812938-f6e60cbf95e3?auto=format&fit=crop&w=1400&q=88',
    alt: 'Detail tulisan tangan pada lembar manuskrip lama',
    credit: 'Foto ilustrasi manuskrip: Alessio Fiorentino / Unsplash',
  },
  {
    label: 'Kuliner',
    title: 'Rendang',
    text: 'Proses memasak perlahan mencerminkan kesabaran dan kebersamaan. Rendang hadir dalam berbagai upacara dan perayaan.',
    source: 'Indonesia.go.id',
    image:
      'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&w=1400&q=88',
    alt: 'Hidangan rempah berkuah disajikan dalam mangkuk tradisional',
    credit: 'Foto kuliner: Agnieszka Stankiewicz / Unsplash',
  },
]

const sumbarQuestions: QuizQuestion[] = [
  {
    q: 'Apa fungsi utama Rumah Gadang dalam masyarakat Minangkabau?',
    options: [
      'Tempat penyimpanan padi',
      'Rumah komunal dan ruang musyawarah',
      'Benteng pertahanan',
      'Tempat pertunjukan',
    ],
    answer: 1,
    why: 'Rumah Gadang bukan sekadar tempat tinggal. Ia menjadi ruang komunal keluarga matrilineal, tempat bermusyawarah, dan mewariskan nilai adat.',
    image:
      'https://images.unsplash.com/photo-1599466610297-aaced28a8a1c?auto=format&fit=crop&w=1200&q=88',
    alt: 'Rumah Gadang dengan bentuk atap gonjong yang khas',
    credit: 'Erlia Abdul Hak / Unsplash',
  },
  {
    q: 'Bentuk gonjong pada atap Rumah Gadang sering diibaratkan sebagai apa?',
    options: ['Sayap burung', 'Ombak laut', 'Tanduk kerbau', 'Puncak gunung'],
    answer: 2,
    why: 'Gonjong yang melengkung tajam dikenal luas menyerupai tanduk kerbau, simbol yang lekat dengan kisah dan identitas Minangkabau.',
    image:
      'https://images.unsplash.com/photo-1692507212128-eb5d1a2c7e48?auto=format&fit=crop&w=1200&q=88',
    alt: 'Tampak dekat atap gonjong pada arsitektur Minangkabau',
    credit: 'Kevin Hansen / Unsplash',
  },
  {
    q: 'Bagaimana petatah-petitih menyampaikan nasihat adat?',
    options: [
      'Melalui perumpamaan alam',
      'Melalui angka',
      'Melalui gambar saja',
      'Melalui bahasa asing',
    ],
    answer: 0,
    why: 'Petatah-petitih memakai kiasan dan perumpamaan, sering kali bersumber dari pengamatan alam dan kehidupan sehari-hari.',
    image:
      'https://images.unsplash.com/photo-1561812938-f6e60cbf95e3?auto=format&fit=crop&w=1200&q=88',
    alt: 'Tulisan tangan sebagai ilustrasi tradisi tutur dan sastra',
    credit: 'Alessio Fiorentino / Unsplash · foto ilustrasi',
  },
  {
    q: 'Nilai apa yang tercermin dalam proses memasak rendang?',
    options: ['Kecepatan', 'Kesabaran dan kebersamaan', 'Persaingan', 'Kesendirian'],
    answer: 1,
    why: 'Rendang dimasak perlahan dan sering disiapkan bersama. Proses ini mencerminkan kesabaran, ketekunan, dan gotong royong.',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=88',
    alt: 'Aneka rempah yang menjadi dasar masakan tradisional',
    credit: 'Ratul Ghosh / Unsplash',
  },
  {
    q: 'Dalam sistem kekerabatan Minangkabau, garis keturunan mengikuti pihak?',
    options: ['Ayah', 'Ibu', 'Tetua kampung', 'Keduanya tanpa aturan'],
    answer: 1,
    why: 'Masyarakat Minangkabau dikenal menganut sistem matrilineal, yaitu garis keturunan dan pusaka diwariskan melalui pihak ibu.',
    image:
      'https://images.unsplash.com/photo-1699445463429-40c12f984e9f?auto=format&fit=crop&w=1200&q=88',
    alt: 'Perempuan dan anak berdiri di lanskap Sumatera Barat',
    credit: 'Styvo Putra Sid / Unsplash',
  },
]

const quizAlternatives = {
  attire: ['Ulee Balang', 'Kebaya Encim', 'Payas Agung', 'Baju Bodo'],
  song: ['Bungong Jeumpa', 'Kicir-Kicir', 'Rasa Sayange', 'Anging Mammiri'],
  food: ['Rendang', 'Kerak Telor', 'Gudeg', 'Ayam Betutu'],
}

function optionsFor(correct: string, alternatives: string[], answer: number) {
  const options = alternatives.filter((item) => item !== correct).slice(0, 3)
  options.splice(answer, 0, correct)
  return options
}

type PricingPlan = {
  id: 'monthly' | 'quarterly' | 'lifetime'
  name: string
  price: string
  per: string
  note: string
  badge: string | null
}

// Mayar membership checkout URL (product id 9932249f-3141-44b7-be71-9aee57ba22a6).
const mayarCheckoutUrl = 'https://id-map.myr.id/Tapak-Nusa-Premium'

const pricingPlans: PricingPlan[] = [
  {
    id: 'monthly',
    name: 'Bulanan',
    price: 'Rp19.000',
    per: '/bulan',
    note: 'Akses penuh selama satu bulan',
    badge: null,
  },
  {
    id: 'quarterly',
    name: '3 Bulan',
    price: 'Rp59.000',
    per: '/3 bulan',
    note: 'Akses penuh selama tiga bulan',
    badge: null,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 'Rp99.000',
    per: '',
    note: 'Sekali bayar, akses penuh selamanya',
    badge: 'Paling hemat',
  },
]

function buildQuestions(
  province: string,
  cards: CultureCard[],
  provincialCategories = false,
): QuizQuestion[] {
  const provinceOptions = ['Aceh', 'Sumatera Barat', 'DKI Jakarta', 'DI Yogyakarta', 'Bali']
    .filter((item) => item !== province)
    .slice(0, 3)
  const imageQuestion = (
    index: number,
    prompt: string,
    options: string[],
    answer: number,
    why: string,
  ) => ({
    q: prompt,
    options,
    answer,
    why,
    image: cards[index].image,
    alt: cards[index].alt,
    credit: cards[index].credit,
  })

  return [
    imageQuestion(
      0,
      provincialCategories
        ? `Busana adat dari ${province} yang dipelajari bersama dokumentasi visual ini adalah?`
        : `Budaya apa yang ditampilkan pada gambar dari ${province} ini?`,
      provincialCategories
        ? optionsFor(cards[0].title, quizAlternatives.attire, 0)
        : [cards[0].title, cards[1].title, quizAlternatives.attire[0], quizAlternatives.food[0]],
      0,
      `${cards[0].title} merupakan bagian dari ${cards[0].label.toLowerCase()} ${province}. ${cards[0].text}`,
    ),
    imageQuestion(
      1,
      provincialCategories
        ? `Lagu daerah dari ${province} yang dipelajari bersama foto konteks wilayah ini adalah?`
        : `Manakah nama yang tepat untuk materi ${cards[1].label.toLowerCase()} ini?`,
      provincialCategories
        ? optionsFor(cards[1].title, quizAlternatives.song, 1)
        : [quizAlternatives.attire[1], cards[1].title, cards[2].title, quizAlternatives.song[0]],
      1,
      `${cards[1].title} dipelajari bersama konteks wilayah ${province}, bahasa, lirik, dan fungsi sosialnya.`,
    ),
    imageQuestion(
      2,
      provincialCategories
        ? `Hidangan khas ${province} yang dipelajari bersama foto kuliner ini adalah?`
        : `Apa nama budaya lokal yang berkaitan dengan gambar ini?`,
      provincialCategories
        ? optionsFor(cards[2].title, quizAlternatives.food, 2)
        : [quizAlternatives.attire[0], quizAlternatives.song[0], cards[2].title, cards[0].title],
      2,
      `${cards[2].title} dikenal dalam konteks kuliner ${province}. Variasi bahan dan penyajian dapat ditemukan antarkeluarga atau wilayah.`,
    ),
    imageQuestion(
      0,
      'Foto wilayah dan ketiga materi yang baru kamu baca berasal dari perjalanan provinsi mana?',
      [...provinceOptions, province],
      3,
      `Rangkaian materi ini menjadi pengantar untuk mengenal ${province}. Budaya dapat melintasi batas wilayah, sehingga konteks komunitas tetap penting.`,
    ),
    imageQuestion(
      1,
      'Saat mengamati dokumentasi budaya seperti pada foto, apa cara belajar yang paling tepat?',
      [
        'Menganggap semua daerah sama',
        'Hanya menghafal namanya',
        'Membaca konteks, sumber, dan suara komunitasnya',
        'Menilai dari satu gambar saja',
      ],
      2,
      'Belajar budaya perlu konteks, sumber yang dapat diperiksa, dan penghormatan kepada komunitas yang menjaga tradisi tersebut.',
    ),
  ]
}

/**
 * Traditional music culture card for a province from the researched dataset.
 * Shared shape across 38 provinces: 33 generated adventures plus the five
 * core adventures.
 */
function musicCardFor(provinceId: string): CultureCard {
  const entry = musicEntries[provinceId]
  return {
    label: 'Alat musik',
    title: entry.instrument,
    text: entry.text,
    source: entry.source,
    image: musicCardImages[provinceId],
    alt: entry.alt,
    credit: entry.credit,
  }
}

/**
 * Music quiz questions for a province: one image-identification question from
 * the shared instrument pool plus one fact question from the researched
 * dataset.
 */
function musicQuestionsFor(provinceId: string, provinceName: string): QuizQuestion[] {
  const entry = musicEntries[provinceId]
  const identifyOptions = [entry.instrument, ...musicDistractors(provinceId)]
  return [
    {
      q: `Alat musik apa yang ditampilkan pada gambar dari ${provinceName} ini?`,
      options: identifyOptions,
      answer: 0,
      why: entry.text,
      image: musicQuizImages[provinceId],
      alt: entry.alt,
      credit: entry.credit,
    },
    {
      q: entry.fact.q,
      options: entry.fact.options,
      answer: entry.fact.answer,
      why: entry.fact.why,
      image: musicQuizImages[provinceId],
      alt: entry.alt,
      credit: entry.credit,
    },
  ]
}

const acehCards: CultureCard[] = [
  {
    label: 'Seni pertunjukan',
    title: 'Tari Saman',
    text: 'Tradisi Gayo ini dikenal melalui gerak duduk yang rapat, tepukan tubuh, dan syair yang dibawakan serempak.',
    source: 'UNESCO ICH · Kemendikbud RI',
    image:
      'https://images.unsplash.com/photo-1642100091126-f02217207faa?auto=format&fit=crop&w=1400&q=88',
    alt: 'Kelompok masyarakat Aceh berkumpul di lanskap hijau',
    credit: 'Foto konteks Aceh: Umar Ben / Unsplash',
  },
  {
    label: 'Pakaian adat',
    title: 'Ulee Balang',
    text: 'Busana Ulee Balang berkaitan dengan sejarah kesultanan Aceh dan kini dikenakan dalam upacara serta perayaan budaya.',
    source: 'Referensi budaya Pemerintah Aceh',
    image:
      'https://images.unsplash.com/photo-1642099398179-35e87bd3520b?auto=format&fit=crop&w=1400&q=88',
    alt: 'Perempuan Aceh mengenakan busana dan perhiasan tradisional',
    credit: 'Foto: Umar Ben / Unsplash',
  },
  {
    label: 'Kuliner',
    title: 'Mie Aceh',
    text: 'Mie tebal dengan bumbu rempah ini disajikan dalam versi goreng atau berkuah, dengan variasi isian di berbagai tempat.',
    source: 'Indonesia.go.id · referensi kuliner Aceh',
    image:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Aceh_fried_noodles.JPG/1920px-Aceh_fried_noodles.JPG',
    alt: 'Mi goreng khas Aceh dengan emping, mentimun, acar bawang, dan taburan bawang goreng',
    credit: 'Foto: Ayie7791 / Wikimedia Commons · CC BY-SA 4.0',
  },
]

const jakartaCards: CultureCard[] = [
  {
    label: 'Seni pertunjukan',
    title: 'Ondel-ondel',
    text: 'Boneka besar Betawi ini memiliki sejarah sebagai bagian dari tradisi masyarakat dan kini hadir dalam berbagai perayaan kota.',
    source: 'Dinas Kebudayaan DKI Jakarta',
    image:
      'https://images.unsplash.com/photo-1574936924661-23374e86f1a8?auto=format&fit=crop&w=1400&q=88',
    alt: 'Keramaian budaya di jalanan Jakarta',
    credit: 'Foto konteks Jakarta: Bagir Bahana / Unsplash',
  },
  {
    label: 'Pakaian adat',
    title: 'Kebaya Encim',
    text: 'Kebaya Encim berkembang dalam budaya Betawi dan mencerminkan perjumpaan beragam pengaruh di kota pelabuhan.',
    source: 'Dinas Kebudayaan DKI Jakarta',
    image:
      'https://images.unsplash.com/photo-1586319826907-1ff4aadbaddc?auto=format&fit=crop&w=1400&q=88',
    alt: 'Perempuan mengenakan busana bermotif tradisional Indonesia',
    credit: 'Foto ilustrasi busana: Camille Bismonte / Unsplash',
  },
  {
    label: 'Kuliner',
    title: 'Kerak Telor',
    text: 'Jajanan Betawi ini dimasak di wajan dengan beras ketan, telur, dan taburan kelapa berbumbu.',
    source: 'Jakarta Tourism · referensi kuliner Betawi',
    image:
      'https://images.unsplash.com/photo-1641224286624-8b87abc6bc49?auto=format&fit=crop&w=1400&q=88',
    alt: 'Pedagang memasak makanan langsung di atas panggangan',
    credit: 'Foto konteks memasak: Pradamas Gifarry / Unsplash',
  },
]

const yogyaCards: CultureCard[] = [
  {
    label: 'Arsitektur',
    title: 'Candi Prambanan',
    text: 'Kompleks candi Hindu ini menjadi ruang sejarah, relief, arsitektur, serta pertunjukan yang terus dipelajari.',
    source: 'UNESCO World Heritage Centre',
    image:
      'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?auto=format&fit=crop&w=1400&q=88',
    alt: 'Menara batu kompleks Candi Prambanan',
    credit: 'Foto: Eugenia Clara / Unsplash',
  },
  {
    label: 'Kerajinan',
    title: 'Batik Yogyakarta',
    text: 'Motif batik Yogyakarta berkembang di lingkungan keraton dan masyarakat, dengan makna serta aturan pakai yang beragam.',
    source: 'UNESCO ICH · Kemendikbud RI',
    image:
      'https://images.unsplash.com/photo-1604973104381-870c92f10343?auto=format&fit=crop&w=1400&q=88',
    alt: 'Perajin mengerjakan kain batik dengan alat tradisional',
    credit: 'Foto: Mahmur Marganti / Unsplash',
  },
  {
    label: 'Kuliner',
    title: 'Gudeg',
    text: 'Olahan nangka muda ini dimasak perlahan dan lazim disajikan bersama nasi serta lauk pendamping.',
    source: 'Portal Pemerintah DI Yogyakarta',
    image:
      'https://images.unsplash.com/photo-1707529332935-bfa3925f15ac?auto=format&fit=crop&w=1400&q=88',
    alt: 'Hidangan gudeg dan lauk disajikan di atas daun pisang',
    credit: 'Foto: Inna Safa / Unsplash',
  },
]

const baliCards: CultureCard[] = [
  {
    label: 'Seni pertunjukan',
    title: 'Tari Kecak',
    text: 'Pertunjukan ini menonjolkan paduan suara ritmis banyak penari yang duduk melingkar dan membangun struktur dramatik.',
    source: 'Warisan Budaya Takbenda Indonesia',
    image:
      'https://images.unsplash.com/photo-1542897643-8158da5b4607?auto=format&fit=crop&w=1400&q=88',
    alt: 'Prosesi dan pertunjukan budaya Bali',
    credit: 'Foto konteks budaya Bali: Ruben Hutabarat / Unsplash',
  },
  {
    label: 'Pakaian & upacara',
    title: 'Payas Agung',
    text: 'Busana seremonial Bali ini memiliki susunan kain, hiasan kepala, dan aksesori yang dikenakan dalam konteks khusus.',
    source: 'Dinas Kebudayaan Provinsi Bali',
    image:
      'https://images.unsplash.com/photo-1542897644-e04428948020?auto=format&fit=crop&w=1400&q=88',
    alt: 'Perempuan Bali dalam busana upacara membawa persembahan',
    credit: 'Foto: Ruben Hutabarat / Unsplash',
  },
  {
    label: 'Kuliner',
    title: 'Ayam Betutu',
    text: 'Ayam Betutu dimasak dengan bumbu rempah yang meresap melalui proses panjang dan memiliki variasi penyajian lokal.',
    source: 'Indonesia.go.id · referensi kuliner Bali',
    image:
      'https://images.unsplash.com/photo-1600015835779-c6b36ddeac1f?auto=format&fit=crop&w=1400&q=88',
    alt: 'Hidangan ayam berbumbu disajikan dengan nasi',
    credit: 'Foto kuliner: Faisal / Unsplash',
  },
]

const coreAdventures: Record<string, Adventure> = {
  aceh: {
    province: 'Aceh',
    intro:
      'Dari dataran tinggi Gayo hingga kota pesisir, Aceh menyimpan tradisi gerak, busana, rasa, dan cerita yang berlapis.',
    cards: [...acehCards, musicCardFor('aceh')],
    questions: [...buildQuestions('Aceh', acehCards), ...musicQuestionsFor('aceh', 'Aceh')],
  },
  sumbar: {
    province: 'Sumatera Barat',
    intro:
      'Di antara pegunungan dan lembah, tradisi tumbuh dari cara masyarakat hidup bersama dan membaca alam.',
    cards: [...sumbarCards, musicCardFor('sumbar')],
    questions: [...sumbarQuestions, ...musicQuestionsFor('sumbar', 'Sumatera Barat')],
  },
  jakarta: {
    province: 'DKI Jakarta',
    intro:
      'Budaya Betawi tumbuh dari perjumpaan panjang masyarakat pelabuhan, kampung kota, bahasa, seni, dan rasa.',
    cards: [...jakartaCards, musicCardFor('jakarta')],
    questions: [...buildQuestions('DKI Jakarta', jakartaCards), ...musicQuestionsFor('jakarta', 'DKI Jakarta')],
  },
  yogya: {
    province: 'DI Yogyakarta',
    intro:
      'Yogyakarta mempertemukan warisan keraton, ruang hidup masyarakat, seni pertunjukan, kerajinan, dan kuliner.',
    cards: [...yogyaCards, musicCardFor('yogya')],
    questions: [...buildQuestions('DI Yogyakarta', yogyaCards), ...musicQuestionsFor('yogya', 'DI Yogyakarta')],
  },
  bali: {
    province: 'Bali',
    intro:
      'Di Bali, seni, upacara, ruang, dan keseharian saling terhubung dalam praktik budaya yang terus hidup.',
    cards: [...baliCards, musicCardFor('bali')],
    questions: [...buildQuestions('Bali', baliCards), ...musicQuestionsFor('bali', 'Bali')],
  },
}

type ProvinceRow = {
  id: string
  name: string
  island: string
  x: number
  y: number
  tone: string
  attire: string
  song: string
  food: string
  region: 'sumatra' | 'java' | 'kalimantan' | 'sulawesi' | 'nusa' | 'maluku' | 'papua'
}

type ProvinceVisual = readonly [image: string, alt: string, credit: string]

const provinceVisuals: Record<string, readonly [ProvinceVisual, ProvinceVisual, ProvinceVisual]> = {
  sumut: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Ceremonial_cloth_%28ulos%29_from_Batak%2C_Indonesia%2C_Honolulu_Museum_of_Art%2C_5099.1.JPG/1920px-Ceremonial_cloth_%28ulos%29_from_Batak%2C_Indonesia%2C_Honolulu_Museum_of_Art%2C_5099.1.JPG',
      'Visual realistis pendamping materi Ulos dan Busana Batak dari Sumatera Utara',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/e/e9/Istana_Maimun_Kota_Medan.jpg',
      'Lanskap atau penanda wilayah Sumatera Utara sebagai konteks lagu Butet',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f3/Arsik_Ikan_Mas_2.jpg/1920px-Arsik_Ikan_Mas_2.jpg',
      'Visual kuliner pendamping materi Arsik dari Sumatera Utara',
      'Wikimedia Commons',
    ],
  ],
  riau: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8c/Baju_kurung_of_Tengku_Embong_Fatimah_and_Sultan_Abdul_Rahman_at_the_Malay_Heritage_Centre%2C_Singapore.jpg/1920px-Baju_kurung_of_Tengku_Embong_Fatimah_and_Sultan_Abdul_Rahman_at_the_Malay_Heritage_Centre%2C_Singapore.jpg',
      'Visual realistis pendamping materi Teluk Belanga dari Riau',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/f/f8/Istana_Rokan.jpg',
      'Lanskap atau penanda wilayah Riau sebagai konteks lagu Soleram',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2a/Gulai_Ikan_Patin_203932.jpg/1920px-Gulai_Ikan_Patin_203932.jpg',
      'Visual kuliner pendamping materi Gulai Ikan Patin dari Riau',
      'Wikimedia Commons',
    ],
  ],
  kepri: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/9/95/Baju_Melayu_SMKN.jpg',
      'Visual realistis pendamping materi Teluk Belanga Kepulauan Riau dari Kepulauan Riau',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/Barelang_Bridge_in_Indonesia.jpg/1920px-Barelang_Bridge_in_Indonesia.jpg',
      'Lanskap atau penanda wilayah Kepulauan Riau sebagai konteks lagu Pulau Bintan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/63/Otak-otak.jpg/1920px-Otak-otak.jpg',
      'Visual kuliner pendamping materi Otak-otak dari Kepulauan Riau',
      'Wikimedia Commons',
    ],
  ],
  jambi: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/c/ca/Wury_Estu_Handayani.jpg',
      'Visual realistis pendamping materi Baju Kurung Tanggung dari Jambi',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/ba/Gerbang_menuju_Candi_Muaro_Jambi.jpg/1920px-Gerbang_menuju_Candi_Muaro_Jambi.jpg',
      'Lanskap atau penanda wilayah Jambi sebagai konteks lagu Batanghari',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/da/Tempoyak_Ikan_Patin_2.JPG/1920px-Tempoyak_Ikan_Patin_2.JPG',
      'Visual kuliner pendamping materi Tempoyak dari Jambi',
      'Wikimedia Commons',
    ],
  ],
  sumsel: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/5/5c/Aesan_Gede_Songket_Palembang.jpg',
      'Visual realistis pendamping materi Aesan Gede dari Sumatera Selatan',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/2/2b/Ampera_Bridge_%2838288140454%29.jpg',
      'Lanskap atau penanda wilayah Sumatera Selatan sebagai konteks lagu Dek Sangke',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Pempek_Kuah_Cuko.jpg/1920px-Pempek_Kuah_Cuko.jpg',
      'Visual kuliner pendamping materi Pempek dari Sumatera Selatan',
      'Wikimedia Commons',
    ],
  ],
  babel: [
    [
      'https://images.unsplash.com/photo-1524341661047-3a38ae8987f9?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Paksian dari Kep. Bangka Belitung',
      'Cok Wisnu / Unsplash',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/b/b0/Berlayar_di_Semenanjung_Belitung.jpg',
      'Lanskap atau penanda wilayah Kep. Bangka Belitung sebagai konteks lagu Miakku Sayang',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2c/Lempah_kuning.JPG/1920px-Lempah_kuning.JPG',
      'Visual kuliner pendamping materi Lempah Kuning dari Kep. Bangka Belitung',
      'Wikimedia Commons',
    ],
  ],
  bengkulu: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7a/Rejang_Adat.jpg/1920px-Rejang_Adat.jpg',
      'Visual realistis pendamping materi Busana Rejang Lebong dari Bengkulu',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b5/Umeak_Potong_Jang.jpg/1920px-Umeak_Potong_Jang.jpg',
      'Lanskap atau penanda wilayah Bengkulu sebagai konteks lagu Sungai Suci',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Pendap_from_Bengkulu_-_IMG_20220210_181317_298.jpg/1920px-Pendap_from_Bengkulu_-_IMG_20220210_181317_298.jpg',
      'Visual kuliner pendamping materi Pendap dari Bengkulu',
      'Wikimedia Commons',
    ],
  ],
  lampung: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c4/Tari_Kebagh%2C_2017.jpg/1920px-Tari_Kebagh%2C_2017.jpg',
      'Visual realistis pendamping materi Tulang Bawang dari Lampung',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9e/Tugu_Siger.jpg/1920px-Tugu_Siger.jpg',
      'Lanskap atau penanda wilayah Lampung sebagai konteks lagu Sang Bumi Ruwa Jurai',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Sambal_seruit_dan_ikan_bakar.jpg/1920px-Sambal_seruit_dan_ikan_bakar.jpg',
      'Visual kuliner pendamping materi Seruit dari Lampung',
      'Wikimedia Commons',
    ],
  ],
  banten: [
    [
      'https://images.unsplash.com/photo-1650377509488-724221735c19?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Pangsi Banten dari Banten',
      'Galuh Hari Setiawan / Unsplash',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/e/ee/Kanekes_village%2C_Banten.jpg',
      'Lanskap atau penanda wilayah Banten sebagai konteks lagu Dayung Sampan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/31/Sate_Bandeng_1.jpg/1920px-Sate_Bandeng_1.jpg',
      'Visual kuliner pendamping materi Sate Bandeng dari Banten',
      'Wikimedia Commons',
    ],
  ],
  jabar: [
    [
      'https://images.unsplash.com/photo-1554785007-399e80f5cb72?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Kebaya Sunda dan Pangsi dari Jawa Barat',
      'Anggit Rizkianto / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Gedung_Sate_Oktober_2024_-_Rahmatdenas.jpg/1920px-Gedung_Sate_Oktober_2024_-_Rahmatdenas.jpg',
      'Lanskap atau penanda wilayah Jawa Barat sebagai konteks lagu Manuk Dadali',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/6/6a/Karedok_platter.JPG',
      'Visual kuliner pendamping materi Karedok dari Jawa Barat',
      'Wikimedia Commons',
    ],
  ],
  jateng: [
    [
      'https://images.unsplash.com/photo-1585704123905-b89826d5daa6?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Jawi Jangkep dan Kebaya dari Jawa Tengah',
      'Eyestetix Studio / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/53/Borobudur%2C_Java%2C_Indonesia%2C_20220817_1016_8757.jpg/1920px-Borobudur%2C_Java%2C_Indonesia%2C_20220817_1016_8757.jpg',
      'Lanskap atau penanda wilayah Jawa Tengah sebagai konteks lagu Gundul-Gundul Pacul',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Loenpia_Semarang_with_sauce.JPG/1920px-Loenpia_Semarang_with_sauce.JPG',
      'Visual kuliner pendamping materi Lumpia Semarang dari Jawa Tengah',
      'Wikimedia Commons',
    ],
  ],
  jatim: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/a/a6/Pakaian_Adat_Jawa_Timur_-_Suku_Madura.jpg',
      'Visual realistis pendamping materi Pesa’an Madura dari Jawa Timur',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b8/Bromo_yang_menakjubkan.jpg/1920px-Bromo_yang_menakjubkan.jpg',
      'Lanskap atau penanda wilayah Jawa Timur sebagai konteks lagu Rek Ayo Rek',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7e/Rawon_Setan.jpg/1920px-Rawon_Setan.jpg',
      'Visual kuliner pendamping materi Rawon dari Jawa Timur',
      'Wikimedia Commons',
    ],
  ],
  ntb: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Pakaian_Kain_Tenun_Tradisional_Sasak_Bayan%2C_Fetung_Bayan_Artshop.jpg/1920px-Pakaian_Kain_Tenun_Tradisional_Sasak_Bayan%2C_Fetung_Bayan_Artshop.jpg',
      'Visual realistis pendamping materi Lambung dan Pegon Sasak/Sumbawa dari Nusa Tenggara Barat',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Lombok_Island_and_Mount_Rinjani_from_Gili_Meno_Island%2C_Indonesia.jpg/1920px-Lombok_Island_and_Mount_Rinjani_from_Gili_Meno_Island%2C_Indonesia.jpg',
      'Lanskap atau penanda wilayah Nusa Tenggara Barat sebagai konteks lagu Inak Tegining Amak Teganang',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4c/Ayam_bakar_khas_Taliwang_2.JPG/1920px-Ayam_bakar_khas_Taliwang_2.JPG',
      'Visual kuliner pendamping materi Ayam Taliwang dari Nusa Tenggara Barat',
      'Wikimedia Commons',
    ],
  ],
  ntt: [
    [
      'https://images.unsplash.com/photo-1542897842-85aaec89ba6f?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Busana Adat Rote dari Nusa Tenggara Timur',
      'Ruben Hutabarat / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Padar_Island.jpg/1920px-Padar_Island.jpg',
      'Lanskap atau penanda wilayah Nusa Tenggara Timur sebagai konteks lagu Anak Kambing Saya',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Se%27i_Babi_1.JPG/1920px-Se%27i_Babi_1.JPG',
      'Visual kuliner pendamping materi Se’i dari Nusa Tenggara Timur',
      'Wikimedia Commons',
    ],
  ],
  kalbar: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/c/cc/COLLECTIE_TROPENMUSEUM_Portret_van_Iban_Dajaks_waarvan_de_man_in_krijgskleding_in_de_garnizoensplaats_Long_Nawan_TMnr_60034030.jpg',
      'Visual realistis pendamping materi King Baba dan King Bibinge dari Kalimantan Barat',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1f/Equator_Pontianak_Monument.jpg/1920px-Equator_Pontianak_Monument.jpg',
      'Lanskap atau penanda wilayah Kalimantan Barat sebagai konteks lagu Cik Cik Periuk',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/4/4d/Bubur_100618-4100_sbs.jpg',
      'Visual kuliner pendamping materi Bubur Pedas dari Kalimantan Barat',
      'Wikimedia Commons',
    ],
  ],
  kalteng: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/85/Baju_Sangkarut.jpg/1920px-Baju_Sangkarut.jpg',
      'Visual realistis pendamping materi Sangkarut dari Kalimantan Tengah',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/24/Wikiearth-Orang_utan_Taman_Nasional_Tanjung_Puting.jpg/1920px-Wikiearth-Orang_utan_Taman_Nasional_Tanjung_Puting.jpg',
      'Lanskap atau penanda wilayah Kalimantan Tengah sebagai konteks lagu Tumpi Wayu',
      'Wikimedia Commons',
    ],
    [
      'https://images.unsplash.com/photo-1655740247333-a044983d729d?auto=format&fit=crop&w=1400&q=86',
      'Visual kuliner pendamping materi Juhu Singkah dari Kalimantan Tengah',
      'Abror Alifiano / Unsplash',
    ],
  ],
  kalsel: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Baju_adat_banjar_fz.jpg/1920px-Baju_adat_banjar_fz.jpg',
      'Visual realistis pendamping materi Baamar Galung Pancar Matahari dari Kalimantan Selatan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Jukung_Teratai.jpg/1920px-Jukung_Teratai.jpg',
      'Lanskap atau penanda wilayah Kalimantan Selatan sebagai konteks lagu Ampar-Ampar Pisang',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Soto_Banjar_ketupat.jpg/1920px-Soto_Banjar_ketupat.jpg',
      'Visual kuliner pendamping materi Soto Banjar dari Kalimantan Selatan',
      'Wikimedia Commons',
    ],
  ],
  kaltim: [
    [
      'https://images.unsplash.com/photo-1662962913155-9e6548038a43?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Kustin dari Kalimantan Timur',
      'Krisna Azie / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3c/Kapal_Tongkang_Batubara_melintas_Sungai_Mahakam.jpg/1920px-Kapal_Tongkang_Batubara_melintas_Sungai_Mahakam.jpg',
      'Lanskap atau penanda wilayah Kalimantan Timur sebagai konteks lagu Indung-Indung',
      'Wikimedia Commons',
    ],
    [
      'https://images.unsplash.com/photo-1569058242252-623df46b5025?auto=format&fit=crop&w=1400&q=86',
      'Visual kuliner pendamping materi Nasi Bekepor dari Kalimantan Timur',
      'Kevin / Unsplash',
    ],
  ],
  kaltara: [
    [
      'https://images.unsplash.com/photo-1667133000547-36edda79f81d?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Ta’a dan Sapei Sapaq dari Kalimantan Utara',
      'Polina Kuzovkova / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Museum_Kesultanan_Bulungan.JPG/1920px-Museum_Kesultanan_Bulungan.JPG',
      'Lanskap atau penanda wilayah Kalimantan Utara sebagai konteks lagu Bebilin',
      'Wikimedia Commons',
    ],
    [
      'https://images.unsplash.com/photo-1625980319455-985e5442c5ae?auto=format&fit=crop&w=1400&q=86',
      'Visual kuliner pendamping materi Nasi Subut dari Kalimantan Utara',
      'Chanhee Lee / Unsplash',
    ],
  ],
  sulut: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/6/6d/Baju_Adat_Suku_Sangihe._Laku_Tepu%2C_foto_-_alffian_walukow.jpg',
      'Visual realistis pendamping materi Laku Tepu dari Sulawesi Utara',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/51/Yesus_Kase_Berkat_Manado.jpg/1920px-Yesus_Kase_Berkat_Manado.jpg',
      'Lanskap atau penanda wilayah Sulawesi Utara sebagai konteks lagu O Ina Ni Keke',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/93/Tinutuan_bubur_Manado.JPG/1920px-Tinutuan_bubur_Manado.JPG',
      'Visual kuliner pendamping materi Tinutuan dari Sulawesi Utara',
      'Wikimedia Commons',
    ],
  ],
  gorontalo: [
    [
      'https://images.unsplash.com/photo-1679141435935-7d8ff9659c9a?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Biliu dan Makuta dari Gorontalo',
      'Polina Kuzovkova / Unsplash',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/1/1f/Masjid_Agung_Gorontalo.jpg',
      'Lanskap atau penanda wilayah Gorontalo sebagai konteks lagu Hulondalo Lipu’u',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5d/Binte_Biluhuta.jpg/1920px-Binte_Biluhuta.jpg',
      'Visual kuliner pendamping materi Binte Biluhuta dari Gorontalo',
      'Wikimedia Commons',
    ],
  ],
  sulteng: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8f/Beine_baju_adat.jpg/1920px-Beine_baju_adat.jpg',
      'Visual realistis pendamping materi Nggembe dari Sulawesi Tengah',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fe/Megalitikum_Lore_Lindu.jpg/1920px-Megalitikum_Lore_Lindu.jpg',
      'Lanskap atau penanda wilayah Sulawesi Tengah sebagai konteks lagu Tondok Kadadingku',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/bb/Sup_Kaledo.jpg/1920px-Sup_Kaledo.jpg',
      'Visual kuliner pendamping materi Kaledo dari Sulawesi Tengah',
      'Wikimedia Commons',
    ],
  ],
  sulbar: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/14/Folks_from_Mandar.jpg/1920px-Folks_from_Mandar.jpg',
      'Visual realistis pendamping materi Pattuqduq Towaine dari Sulawesi Barat',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Karampuang.jpg/1920px-Karampuang.jpg',
      'Lanskap atau penanda wilayah Sulawesi Barat sebagai konteks lagu Tenggang-Tenggang Lopi',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2f/Jepa_Saluan.jpg/1920px-Jepa_Saluan.jpg',
      'Visual kuliner pendamping materi Jepa dari Sulawesi Barat',
      'Wikimedia Commons',
    ],
  ],
  sulsel: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/d/da/Baju_Bodo.jpg',
      'Visual realistis pendamping materi Baju Bodo dari Sulawesi Selatan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/28/Makassar_2022_Bennylin_71.jpg/1920px-Makassar_2022_Bennylin_71.jpg',
      'Lanskap atau penanda wilayah Sulawesi Selatan sebagai konteks lagu Anging Mammiri',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c8/Kuliner_Coto_Makassar.jpg/960px-Kuliner_Coto_Makassar.jpg',
      'Visual kuliner pendamping materi Coto Makassar dari Sulawesi Selatan',
      'Wikimedia Commons',
    ],
  ],
  sultra: [
    [
      'https://images.unsplash.com/photo-1765812926500-3118f54d65dc?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Kinawo dari Sulawesi Tenggara',
      'Aditya Enggar Perdana / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d9/Wakatobi_beach_2006.jpg/1920px-Wakatobi_beach_2006.jpg',
      'Lanskap atau penanda wilayah Sulawesi Tenggara sebagai konteks lagu Tana Wolio',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Sinonggi.jpg',
      'Visual kuliner pendamping materi Sinonggi dari Sulawesi Tenggara',
      'Wikimedia Commons',
    ],
  ],
  maluku: [
    [
      'https://images.unsplash.com/photo-1752760023169-c0147e0aca57?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Baju Cele dari Maluku',
      'Maximus Beaumont / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e2/Bukit_Desa_Kaibobo.jpg/1920px-Bukit_Desa_Kaibobo.jpg',
      'Lanskap atau penanda wilayah Maluku sebagai konteks lagu Rasa Sayange',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/6/68/Papeda%2C_Kuah_Kuning%2C_Ikan_Tude_Bakar_1.jpg',
      'Visual kuliner pendamping materi Papeda dan Ikan Kuah Kuning dari Maluku',
      'Wikimedia Commons',
    ],
  ],
  malut: [
    [
      'https://images.unsplash.com/photo-1760236226073-507c7310dc8f?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Manteren Lamo dari Maluku Utara',
      'Loid Forger / Unsplash',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/4/46/Surga_rempah_rempah.jpg',
      'Lanskap atau penanda wilayah Maluku Utara sebagai konteks lagu Borero',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Gohu_Ikan.jpg/1920px-Gohu_Ikan.jpg',
      'Visual kuliner pendamping materi Gohu Ikan dari Maluku Utara',
      'Wikimedia Commons',
    ],
  ],
  papua: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5a/Koteka_Adalah_Pakaian_Adat_Khas_Papua.jpg/1920px-Koteka_Adalah_Pakaian_Adat_Khas_Papua.jpg',
      'Visual realistis pendamping materi Rok Rumbai Papua dari Papua',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/c/cd/Jembatan_Youtefa_2.jpg',
      'Lanskap atau penanda wilayah Papua sebagai konteks lagu Apuse',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/0/01/Papeda%2C_Kuah_Kuning%2C_Ikan_Tude_Bakar_2.jpg',
      'Visual kuliner pendamping materi Papeda dari Papua',
      'Wikimedia Commons',
    ],
  ],
  papuabarat: [
    [
      'https://images.unsplash.com/photo-1667133196212-eba96a31539f?auto=format&fit=crop&w=1400&q=86',
      'Visual realistis pendamping materi Ewer dari Papua Barat',
      'Polina Kuzovkova / Unsplash',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Pulau_Triton.jpg/1920px-Pulau_Triton.jpg',
      'Lanskap atau penanda wilayah Papua Barat sebagai konteks lagu Yamko Rambe Yamko',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/13/Ikan_kakap_bakar_madu.JPG/1920px-Ikan_kakap_bakar_madu.JPG',
      'Visual kuliner pendamping materi Ikan Bakar Manokwari dari Papua Barat',
      'Wikimedia Commons',
    ],
  ],
  papuaselatan: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/22/Marind-Anim%2C_KITLV_500540.tiff/lossy-page1-1920px-Marind-Anim%2C_KITLV_500540.tiff.jpg',
      'Visual realistis pendamping materi Busana Marind dari Papua Selatan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/af/Taman_0_Kilometer_Merauke_-_Sabang.jpg/1920px-Taman_0_Kilometer_Merauke_-_Sabang.jpg',
      'Lanskap atau penanda wilayah Papua Selatan sebagai konteks lagu E Mambo Simbo',
      'Wikimedia Commons',
    ],
    [
      'https://images.unsplash.com/photo-1627035537727-96e5d592bbb6?auto=format&fit=crop&w=1400&q=86',
      'Visual kuliner pendamping materi Sagu Sep dari Papua Selatan',
      'VD Photography / Unsplash',
    ],
  ],
  papuatengah: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Koteka_2.jpg',
      'Visual realistis pendamping materi Koteka dan Sali dari Papua Tengah',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/5/54/Kota_Timika.jpg',
      'Lanskap atau penanda wilayah Papua Tengah sebagai konteks lagu Akai Bipa Mare',
      'Wikimedia Commons',
    ],
    [
      'https://images.unsplash.com/photo-1707995546402-5057206e5161?auto=format&fit=crop&w=1400&q=86',
      'Visual kuliner pendamping materi Udang Selingkuh dari Papua Tengah',
      'Monika Borys / Unsplash',
    ],
  ],
  papuapegunungan: [
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/80/Festival_Lembah_Baliem_03.jpg/1920px-Festival_Lembah_Baliem_03.jpg',
      'Visual realistis pendamping materi Busana Lembah Baliem dari Papua Pegunungan',
      'Wikimedia Commons',
    ],
    [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/Puncak_Trikora_from_north._main_summit_%28center_left%29_and_west_ridge_by_Christian_Stangl_flickr.jpg/1920px-Puncak_Trikora_from_north._main_summit_%28center_left%29_and_west_ridge_by_Christian_Stangl_flickr.jpg',
      'Lanskap atau penanda wilayah Papua Pegunungan sebagai konteks lagu Wen Atoware',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/8/8b/Traditional_Method_of_Cooking.jpg',
      'Visual kuliner pendamping materi Ubi Jalar Bakar Batu dari Papua Pegunungan',
      'Wikimedia Commons',
    ],
  ],
  papuabaratdaya: [
    [
      'https://upload.wikimedia.org/wikipedia/commons/c/c1/Buka_Sasi_Sorong.jpg',
      'Visual realistis pendamping materi Busana Moi dari Papua Barat Daya',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/9/99/View_of_the_western_most_bay_aken_from_top_of_Mount_Pindito%2C_Bird%27s_Head_Seascape_-_Wayag_Islands.jpg',
      'Lanskap atau penanda wilayah Papua Barat Daya sebagai konteks lagu Sajojo',
      'Wikimedia Commons',
    ],
    [
      'https://upload.wikimedia.org/wikipedia/commons/6/68/Papeda%2C_Kuah_Kuning%2C_Ikan_Tude_Bakar_1.jpg',
      'Visual kuliner pendamping materi Papeda dan Ikan Kuah Kuning dari Papua Barat Daya',
      'Wikimedia Commons',
    ],
  ],
}

const additionalProvinceRows: ProvinceRow[] = [
  {
    id: 'sumut',
    name: 'Sumatera Utara',
    island: 'Sumatra',
    x: 9,
    y: 35,
    tone: '#cc7650',
    attire: 'Ulos dan Busana Batak',
    song: 'Butet',
    food: 'Arsik',
    region: 'sumatra',
  },
  {
    id: 'riau',
    name: 'Riau',
    island: 'Sumatra',
    x: 14,
    y: 49,
    tone: '#c88646',
    attire: 'Teluk Belanga',
    song: 'Soleram',
    food: 'Gulai Ikan Patin',
    region: 'sumatra',
  },
  {
    id: 'kepri',
    name: 'Kepulauan Riau',
    island: 'Sumatra',
    x: 19,
    y: 47,
    tone: '#bd8c49',
    attire: 'Teluk Belanga Kepulauan Riau',
    song: 'Pulau Bintan',
    food: 'Otak-otak',
    region: 'sumatra',
  },
  {
    id: 'jambi',
    name: 'Jambi',
    island: 'Sumatra',
    x: 16,
    y: 56,
    tone: '#b98b4f',
    attire: 'Baju Kurung Tanggung',
    song: 'Batanghari',
    food: 'Tempoyak',
    region: 'sumatra',
  },
  {
    id: 'sumsel',
    name: 'Sumatera Selatan',
    island: 'Sumatra',
    x: 19,
    y: 62,
    tone: '#af8d52',
    attire: 'Aesan Gede',
    song: 'Dek Sangke',
    food: 'Pempek',
    region: 'sumatra',
  },
  {
    id: 'babel',
    name: 'Kep. Bangka Belitung',
    island: 'Sumatra',
    x: 24,
    y: 58,
    tone: '#a68e57',
    attire: 'Paksian',
    song: 'Miakku Sayang',
    food: 'Lempah Kuning',
    region: 'sumatra',
  },
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    island: 'Sumatra',
    x: 15,
    y: 64,
    tone: '#9c8958',
    attire: 'Busana Rejang Lebong',
    song: 'Sungai Suci',
    food: 'Pendap',
    region: 'sumatra',
  },
  {
    id: 'lampung',
    name: 'Lampung',
    island: 'Sumatra',
    x: 22,
    y: 69,
    tone: '#96835a',
    attire: 'Tulang Bawang',
    song: 'Sang Bumi Ruwa Jurai',
    food: 'Seruit',
    region: 'sumatra',
  },
  {
    id: 'banten',
    name: 'Banten',
    island: 'Jawa',
    x: 27,
    y: 70,
    tone: '#5d9a78',
    attire: 'Pangsi Banten',
    song: 'Dayung Sampan',
    food: 'Sate Bandeng',
    region: 'java',
  },
  {
    id: 'jabar',
    name: 'Jawa Barat',
    island: 'Jawa',
    x: 31,
    y: 72,
    tone: '#589278',
    attire: 'Kebaya Sunda dan Pangsi',
    song: 'Manuk Dadali',
    food: 'Karedok',
    region: 'java',
  },
  {
    id: 'jateng',
    name: 'Jawa Tengah',
    island: 'Jawa',
    x: 35,
    y: 70,
    tone: '#568b79',
    attire: 'Jawi Jangkep dan Kebaya',
    song: 'Gundul-Gundul Pacul',
    food: 'Lumpia Semarang',
    region: 'java',
  },
  {
    id: 'jatim',
    name: 'Jawa Timur',
    island: 'Jawa',
    x: 40,
    y: 73,
    tone: '#54847b',
    attire: 'Pesa’an Madura',
    song: 'Rek Ayo Rek',
    food: 'Rawon',
    region: 'java',
  },
  {
    id: 'ntb',
    name: 'Nusa Tenggara Barat',
    island: 'Nusa Tenggara',
    x: 48,
    y: 72,
    tone: '#9e6679',
    attire: 'Lambung dan Pegon Sasak/Sumbawa',
    song: 'Inak Tegining Amak Teganang',
    food: 'Ayam Taliwang',
    region: 'nusa',
  },
  {
    id: 'ntt',
    name: 'Nusa Tenggara Timur',
    island: 'Nusa Tenggara',
    x: 55,
    y: 74,
    tone: '#996c78',
    attire: 'Busana Adat Rote',
    song: 'Anak Kambing Saya',
    food: 'Se’i',
    region: 'nusa',
  },
  {
    id: 'kalbar',
    name: 'Kalimantan Barat',
    island: 'Kalimantan',
    x: 32,
    y: 48,
    tone: '#337a62',
    attire: 'King Baba dan King Bibinge',
    song: 'Cik Cik Periuk',
    food: 'Bubur Pedas',
    region: 'kalimantan',
  },
  {
    id: 'kalteng',
    name: 'Kalimantan Tengah',
    island: 'Kalimantan',
    x: 38,
    y: 49,
    tone: '#38745f',
    attire: 'Sangkarut',
    song: 'Tumpi Wayu',
    food: 'Juhu Singkah',
    region: 'kalimantan',
  },
  {
    id: 'kalsel',
    name: 'Kalimantan Selatan',
    island: 'Kalimantan',
    x: 41,
    y: 58,
    tone: '#3d6f5d',
    attire: 'Baamar Galung Pancar Matahari',
    song: 'Ampar-Ampar Pisang',
    food: 'Soto Banjar',
    region: 'kalimantan',
  },
  {
    id: 'kaltim',
    name: 'Kalimantan Timur',
    island: 'Kalimantan',
    x: 45,
    y: 49,
    tone: '#426b5c',
    attire: 'Kustin',
    song: 'Indung-Indung',
    food: 'Nasi Bekepor',
    region: 'kalimantan',
  },
  {
    id: 'kaltara',
    name: 'Kalimantan Utara',
    island: 'Kalimantan',
    x: 44,
    y: 38,
    tone: '#46665a',
    attire: 'Ta’a dan Sapei Sapaq',
    song: 'Bebilin',
    food: 'Nasi Subut',
    region: 'kalimantan',
  },
  {
    id: 'sulut',
    name: 'Sulawesi Utara',
    island: 'Sulawesi',
    x: 61,
    y: 42,
    tone: '#477c9a',
    attire: 'Laku Tepu',
    song: 'O Ina Ni Keke',
    food: 'Tinutuan',
    region: 'sulawesi',
  },
  {
    id: 'gorontalo',
    name: 'Gorontalo',
    island: 'Sulawesi',
    x: 57,
    y: 46,
    tone: '#4b7695',
    attire: 'Biliu dan Makuta',
    song: 'Hulondalo Lipu’u',
    food: 'Binte Biluhuta',
    region: 'sulawesi',
  },
  {
    id: 'sulteng',
    name: 'Sulawesi Tengah',
    island: 'Sulawesi',
    x: 55,
    y: 52,
    tone: '#4e7190',
    attire: 'Nggembe',
    song: 'Tondok Kadadingku',
    food: 'Kaledo',
    region: 'sulawesi',
  },
  {
    id: 'sulbar',
    name: 'Sulawesi Barat',
    island: 'Sulawesi',
    x: 51,
    y: 57,
    tone: '#526c8a',
    attire: 'Pattuqduq Towaine',
    song: 'Tenggang-Tenggang Lopi',
    food: 'Jepa',
    region: 'sulawesi',
  },
  {
    id: 'sulsel',
    name: 'Sulawesi Selatan',
    island: 'Sulawesi',
    x: 54,
    y: 64,
    tone: '#576786',
    attire: 'Baju Bodo',
    song: 'Anging Mammiri',
    food: 'Coto Makassar',
    region: 'sulawesi',
  },
  {
    id: 'sultra',
    name: 'Sulawesi Tenggara',
    island: 'Sulawesi',
    x: 60,
    y: 60,
    tone: '#5b6380',
    attire: 'Kinawo',
    song: 'Tana Wolio',
    food: 'Sinonggi',
    region: 'sulawesi',
  },
  {
    id: 'maluku',
    name: 'Maluku',
    island: 'Maluku',
    x: 69,
    y: 59,
    tone: '#756ba0',
    attire: 'Baju Cele',
    song: 'Rasa Sayange',
    food: 'Papeda dan Ikan Kuah Kuning',
    region: 'maluku',
  },
  {
    id: 'malut',
    name: 'Maluku Utara',
    island: 'Maluku',
    x: 68,
    y: 48,
    tone: '#71679a',
    attire: 'Manteren Lamo',
    song: 'Borero',
    food: 'Gohu Ikan',
    region: 'maluku',
  },
  {
    id: 'papua',
    name: 'Papua',
    island: 'Papua',
    x: 88,
    y: 55,
    tone: '#765d48',
    attire: 'Rok Rumbai Papua',
    song: 'Apuse',
    food: 'Papeda',
    region: 'papua',
  },
  {
    id: 'papuabarat',
    name: 'Papua Barat',
    island: 'Papua',
    x: 80,
    y: 52,
    tone: '#80654d',
    attire: 'Ewer',
    song: 'Yamko Rambe Yamko',
    food: 'Ikan Bakar Manokwari',
    region: 'papua',
  },
  {
    id: 'papuaselatan',
    name: 'Papua Selatan',
    island: 'Papua',
    x: 88,
    y: 67,
    tone: '#876b51',
    attire: 'Busana Marind',
    song: 'E Mambo Simbo',
    food: 'Sagu Sep',
    region: 'papua',
  },
  {
    id: 'papuatengah',
    name: 'Papua Tengah',
    island: 'Papua',
    x: 85,
    y: 57,
    tone: '#8e7156',
    attire: 'Koteka dan Sali',
    song: 'Akai Bipa Mare',
    food: 'Udang Selingkuh',
    region: 'papua',
  },
  {
    id: 'papuapegunungan',
    name: 'Papua Pegunungan',
    island: 'Papua',
    x: 91,
    y: 53,
    tone: '#95785b',
    attire: 'Busana Lembah Baliem',
    song: 'Wen Atoware',
    food: 'Ubi Jalar Bakar Batu',
    region: 'papua',
  },
  {
    id: 'papuabaratdaya',
    name: 'Papua Barat Daya',
    island: 'Papua',
    x: 76,
    y: 47,
    tone: '#9b7e60',
    attire: 'Busana Moi',
    song: 'Sajojo',
    food: 'Papeda dan Ikan Kuah Kuning',
    region: 'papua',
  },
]

function buildProvinceAdventure(row: ProvinceRow): Adventure {
  const visuals = provinceVisuals[row.id]
  const cards: CultureCard[] = [
    {
      label: 'Pakaian adat',
      title: row.attire,
      text: `${row.attire} diperkenalkan sebagai salah satu busana tradisi dari ${row.name}. Bagian, bahan, dan aturan pemakaiannya perlu dipahami sesuai komunitas dan upacara.`,
      source: 'Katalog Tapak Nusa · referensi awal Kemendikbud dan pemerintah daerah',
      image: visuals[0][0],
      alt: visuals[0][1],
      credit: visuals[0][2],
    },
    {
      label: 'Lagu daerah',
      title: row.song,
      text: `${row.song} dikenal sebagai salah satu lagu yang dikaitkan dengan ${row.name}. Bahasa, lirik, pencipta, dan fungsi sosialnya menjadi bagian penting untuk dipelajari.`,
      source: 'Katalog Tapak Nusa · referensi awal lagu daerah',
      image: visuals[1][0],
      alt: visuals[1][1],
      credit: visuals[1][2],
    },
    {
      label: 'Makanan lokal',
      title: row.food,
      text: `${row.food} menjadi salah satu pintu masuk mengenal rasa lokal ${row.name}. Bahan dan penyajiannya dapat memiliki variasi di tiap keluarga atau wilayah.`,
      source: 'Katalog Tapak Nusa · referensi awal kuliner daerah',
      image: visuals[2][0],
      alt: visuals[2][1],
      credit: visuals[2][2],
    },
    musicCardFor(row.id),
  ]

  return {
    province: row.name,
    intro: `Mulai perjalanan di ${row.name} melalui busana, lagu, dan makanan lokal yang hidup bersama masyarakatnya.`,
    cards,
    questions: [...buildQuestions(row.name, cards, true), ...musicQuestionsFor(row.id, row.name)],
  }
}

const provinces: Province[] = [
  ...coreProvinces,
  ...additionalProvinceRows.map((row) => ({
    id: row.id,
    name: row.name,
    island: row.island,
    x: row.x,
    y: row.y,
    tone: row.tone,
    status: 'open' as const,
  })),
]

const adventures: Record<string, Adventure> = {
  ...coreAdventures,
  ...Object.fromEntries(additionalProvinceRows.map((row) => [row.id, buildProvinceAdventure(row)])),
}

const collectionCards = provinces.map((province, index) => {
  const provinceAdventure = adventures[province.id]
  return {
    id: province.id,
    province: province.name.toLocaleUpperCase('id'),
    card: provinceAdventure.cards[index % provinceAdventure.cards.length],
  }
})

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
  authModal,
  onBack,
  onDashboard,
}: {
  page: PublicPage
  authModal: React.ReactNode
  onBack: () => void
  onDashboard: () => void
}) {
  const content = {
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
      title: '38 provinsi, satu perjalanan Nusantara.',
      text: 'Lihat cakupan provinsi yang tersedia, lalu masuk ke peta interaktif untuk memilih materi dan memulai petualangan.',
      action: 'Buka peta interaktif',
    },
  }[page]
  const previewCards =
    page === 'culture'
      ? [
          { province: 'Aceh', card: acehCards[0] },
          { province: 'Sumatera Barat', card: sumbarCards[0] },
          { province: 'Bali', card: baliCards[2] },
        ]
      : [
          { province: 'DI Yogyakarta', card: yogyaCards[1] },
          { province: 'DKI Jakarta', card: jakartaCards[0] },
          { province: 'Aceh', card: acehCards[2] },
        ]

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
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.text}</p>
          <button className="about-primary" onClick={onDashboard}>
            {content.action} <Icon name="arrow" size={15} />
          </button>
          <small>
            <Icon name="lock" size={12} /> Sign-in baru diperlukan ketika memulai kuis.
          </small>
        </div>
        <aside>
          <span>
            <b>38</b>
            <small>Provinsi</small>
          </span>
          <span>
            <b>152</b>
            <small>Cerita pengantar</small>
          </span>
          <span>
            <b>5</b>
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
            {provinces.map((province, index) => (
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

export default function TapakNusa() {
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
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [xp, setXp] = useState(80)
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [pendingQuiz, setPendingQuiz] = useState(false)
  const [restored, setRestored] = useState(false)
  const adventure = adventures[selected?.id ?? 'sumbar']

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
        }
        setStarted(Boolean(data.started))
        setAlias(restoredUser?.name || data.alias || 'Kelana')
        setXp(typeof data.xp === 'number' ? data.xp : 80)
      } catch {
        localStorage.removeItem('nusantara-quest-player')
      }
    } else if (restoredUser) {
      setAlias(restoredUser.name)
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    localStorage.setItem('nusantara-quest-player', JSON.stringify({ started, alias, xp }))
  }, [alias, restored, started, xp])

  const score = useMemo(
    () =>
      answers.reduce(
        (sum, answer, i) => sum + Number(answer === adventure.questions[i]?.answer),
        0,
      ),
    [answers, adventure.questions],
  )

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

  function requestQuiz() {
    setLearn(null)
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
    setAnswers([])
    setShowResult(false)
  }

  function nextQuestion() {
    if (choice === null) return
    const updated = [...answers, choice]
    setAnswers(updated)
    if (qIndex === adventure.questions.length - 1) {
      const finalScore = updated.reduce(
        (sum, answer, i) => sum + Number(answer === adventure.questions[i].answer),
        0,
      )
      setXp((old) => old + finalScore * 10 + (finalScore >= 4 ? 30 : 0))
      setShowResult(true)
    } else {
      setQIndex((i) => i + 1)
      setChoice(null)
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
            <button onClick={openProfile} aria-label="Buka profil penjelajah">
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
          <img src={sumbarCards[0].image} alt={sumbarCards[0].alt} />
          <span>
            <small>Arsitektur</small>
            <b>Rumah Gadang</b>
            <em>Sumatera Barat</em>
          </span>
          <i>
            <Icon name="arrow" size={15} />
          </i>
        </button>
        <button className="home-story-card story-dance" onClick={() => openProvince('bali')}>
          <img src={baliCards[0].image} alt={baliCards[0].alt} />
          <span>
            <small>Seni pertunjukan</small>
            <b>Tari Kecak</b>
            <em>Bali</em>
          </span>
          <i>
            <Icon name="arrow" size={15} />
          </i>
        </button>
        <button className="home-story-card story-food" onClick={() => openProvince('sumbar')}>
          <img src={sumbarCards[2].image} alt={sumbarCards[2].alt} />
          <span>
            <small>Kuliner</small>
            <b>Rendang</b>
            <em>Sumatera Barat</em>
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
        {pricingOpen && <PricingModal onClose={() => setPricingOpen(false)} />}
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button
          className="dashboard-home-link"
          onClick={returnHome}
          aria-label="Kembali ke homepage Tapak Nusa"
          title="Kembali ke homepage"
        >
          <Logo />
        </button>
        <div className="stats">
          <div>
            <span className="stat-icon amber">
              <Icon name="flame" />
            </span>
            <p>
              <b>4 hari</b>
              <small>Nyala obor</small>
            </p>
          </div>
          <div>
            <span className="stat-icon blue">
              <Icon name="star" />
            </span>
            <p>
              <b>{xp} XP</b>
              <small>Penjelajah Lv. 2</small>
            </p>
          </div>
          <button className="demo-auth-chip" onClick={() => setAuthOpen(true)}>
            <span>G</span>
            {demoUser ? demoUser.email.split('@')[0] : 'Masuk Gmail'}
          </button>
          <button className="avatar" onClick={openProfile} aria-label="Buka profil">
            {alias.slice(0, 1).toUpperCase()}
          </button>
        </div>
      </header>

      <div className="app-layout">
        <aside className="sidebar">
          <nav>
            {(
              [
                ['map', 'map', 'Petualangan'],
                ['collection', 'book', 'Koleksi'],
                ['rank', 'rank', 'Peringkat'],
                ['profile', 'user', 'Profil'],
              ] as [View, string, string][]
            ).map(([id, icon, label]) => (
              <button
                key={id}
                onClick={() => (id === 'profile' ? openProfile() : setView(id))}
                className={view === id ? 'active' : ''}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="mission-card">
            <div className="mission-top">
              <span>
                <Icon name="star" size={15} />
              </span>
              <small>Misi hari ini</small>
            </div>
            <b>Jawab 3 soal budaya</b>
            <div className="meter">
              <i style={{ width: '33%' }} />
            </div>
            <p>
              1 dari 3 selesai <strong>+15 XP</strong>
            </p>
          </div>
          <div className="sidebar-note">
            <span className="mini-mascot">N</span>
            <p>
              <b>Nara bilang,</b>
              <br />
              Setiap daerah punya cerita. Mari dengarkan dengan rasa ingin tahu.
            </p>
          </div>
        </aside>

        <section className="content">
          {view === 'map' && (
            <>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Peta petualangan</p>
                  <h1>38 provinsi, 38 pintu perjalanan.</h1>
                  <p>
                    Pilih provinsi mana pun, pelajari tiga pengantar budayanya, lalu uji pemahaman
                    melalui kuis bergambar.
                  </p>
                </div>
                <div className="progress-orbit">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="33" />
                    <circle className="done" cx="40" cy="40" r="33" />
                  </svg>
                  <span>
                    <b>1</b>
                    <small>dari 38</small>
                  </span>
                </div>
              </div>
              <div className="map-card">
                <iframe
                  className="osm-map"
                  title="Peta OpenStreetMap Indonesia"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=94%2C-12%2C142%2C8&layer=mapnik"
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
                <div className="map-wash" aria-hidden />
                <div className="map-title">
                  <small>PETA EKSPLORASI</small>
                  <strong>Indonesia</strong>
                  <span>Geser dan perbesar peta untuk menjelajah</span>
                </div>
                {provinces.map((p, i) => (
                  <button
                    key={p.id}
                    data-province={p.id}
                    className={`pin ${p.status} ${i >= coreProvinces.length ? 'dense' : ''}`}
                    style={
                      { left: `${p.x}%`, top: `${p.y}%`, '--pin': p.tone } as React.CSSProperties
                    }
                    onClick={() => p.status !== 'locked' && setSelected(p)}
                    aria-label={`${p.name}, ${p.status}`}
                  >
                    <span>
                      {p.status === 'done' ? (
                        <Icon name="check" size={14} />
                      ) : p.status === 'locked' ? (
                        <Icon name="lock" size={13} />
                      ) : i < coreProvinces.length ? (
                        i + 1
                      ) : null}
                    </span>
                    <b>{p.name}</b>
                  </button>
                ))}
                <div className="map-legend">
                  <span>
                    <i className="lg done" />
                    Selesai
                  </span>
                  <span>
                    <i className="lg open" />
                    Terbuka
                  </span>
                  <span>
                    <i className="lg all" />
                    38 provinsi aktif
                  </span>
                </div>
                <a
                  className="map-attribution"
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  © OpenStreetMap contributors
                </a>
              </div>
              <div className="province-list">
                {provinces.map((province, index) => (
                  <button key={province.id} onClick={() => setSelected(province)}>
                    <span className="number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="province-glyph" style={{ background: province.tone }}>
                      {province.name.slice(0, 1)}
                    </span>
                    <p>
                      <small>
                        {province.status === 'done' ? 'SELESAI · MAINKAN LAGI' : 'TERBUKA'}
                      </small>
                      <b>{province.name}</b>
                      <em>
                        {province.status === 'done'
                          ? `Skor terbaik ${province.score}/5`
                          : '3 cerita · 5 soal bergambar'}
                      </em>
                    </p>
                    <i className={province.status === 'done' ? 'complete' : 'go'}>
                      <Icon name={province.status === 'done' ? 'check' : 'arrow'} size={15} />
                    </i>
                  </button>
                ))}
              </div>
            </>
          )}

          {view === 'collection' && <Collection onOpenProvince={openProvince} />}
          {view === 'rank' && <Leaderboard alias={alias} />}
          {view === 'profile' && <Profile alias={alias} xp={xp} />}
        </section>
      </div>

      {selected && !quiz && learn === null && (
        <ProvinceModal
          province={selected}
          adventure={adventure}
          onClose={() => setSelected(null)}
          onLearn={() => setLearn(0)}
          onQuiz={requestQuiz}
        />
      )}
      {learn !== null && (
        <LearnModal
          index={learn}
          adventure={adventure}
          onClose={() => setLearn(null)}
          onNext={() => (learn < adventure.cards.length - 1 ? setLearn(learn + 1) : requestQuiz())}
        />
      )}
      {quiz && (
        <QuizModal
          qIndex={qIndex}
          adventure={adventure}
          choice={choice}
          onChoice={setChoice}
          onNext={nextQuestion}
          onClose={() => {
            resetQuiz()
            setSelected(null)
          }}
          result={showResult}
          score={score}
          xp={xp}
        />
      )}
      {authModal}
    </main>
  )
}

function PricingModal({ onClose }: { onClose: () => void }) {
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
        <p className="eyebrow">Berlangganan Tapak Nusa</p>
        <h2>Pilih paket langganan.</h2>
        <p className="auth-intro">
          Akses penuh materi budaya, kuis bergambar, dan koleksi di seluruh 38 provinsi.
        </p>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
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
              <a
                className={mayarCheckoutUrl ? 'pricing-cta' : 'pricing-cta is-pending'}
                href={mayarCheckoutUrl || undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={mayarCheckoutUrl ? undefined : true}
              >
                {mayarCheckoutUrl ? 'Berlangganan' : 'Segera dibuka'}
              </a>
            </article>
          ))}
        </div>
        <p className="pricing-footnote">
          Pembayaran aman diproses oleh Mayar. Langganan bisa berhenti kapan saja, kecuali paket
          Lifetime yang berlaku selamanya.
        </p>
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
              <b>{score}/5</b>
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
                className={
                  choice === i
                    ? i === q.answer
                      ? 'correct'
                      : 'wrong'
                    : answered && i === q.answer
                      ? 'correct'
                      : ''
                }
              >
                <span>{String.fromCharCode(65 + i)}</span>
                {o}
                {answered && i === q.answer && <Icon name="check" size={18} />}
              </button>
            ))}
          </div>
          {answered && (
            <div className={`feedback ${choice === q.answer ? 'yes' : 'no'}`}>
              <b>{choice === q.answer ? 'Tepat sekali.' : 'Belum tepat.'}</b>
              <p>{q.why}</p>
              <small>Sumber materi: referensi pada kartu pembelajaran {adventure.province}</small>
            </div>
          )}
          <button className="primary next" disabled={!answered} onClick={onNext}>
            {qIndex === adventure.questions.length - 1 ? 'Lihat hasil' : 'Lanjutkan'}{' '}
            <Icon name="arrow" size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

function Collection({ onOpenProvince }: { onOpenProvince: (provinceId: string) => void }) {
  return (
    <>
      <div className="section-heading simple">
        <div>
          <p className="eyebrow">Koleksi budaya</p>
          <h1>38 cerita pembuka dari Nusantara.</h1>
          <p>
            Jelajahi satu kartu pilihan dari setiap provinsi dan buka kembali materi perjalananmu.
          </p>
        </div>
        <span className="collection-count">
          <b>{collectionCards.length}</b> provinsi tersedia
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
          <article key={id}>
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

function Leaderboard({ alias }: { alias: string }) {
  return (
    <>
      <div className="section-heading simple">
        <div>
          <p className="eyebrow">Peringkat mingguan</p>
          <h1>Belajar bersama para penjelajah.</h1>
          <p>Peringkat berdasarkan XP minggu ini. Minggu baru dimulai Senin pukul 00.00 WIB.</p>
        </div>
        <div className="week-chip">12–18 Agustus</div>
      </div>
      <div className="rank-layout">
        <div className="leaderboard">
          {ranking.map((r, i) => (
            <div key={r[1]} className={i < 3 ? 'top' : ''}>
              <span className="place">{r[0]}</span>
              <span className="rank-avatar">{r[1].slice(0, 1)}</span>
              <p>
                <b>{r[1]}</b>
                <small>{i < 3 ? 'Pendekar Budaya' : 'Penjelajah'}</small>
              </p>
              <strong>{r[2]} XP</strong>
            </div>
          ))}
          <div className="you">
            <span className="place">18</span>
            <span className="rank-avatar">{alias[0]}</span>
            <p>
              <b>
                {alias} <em>Kamu</em>
              </b>
              <small>Penjelajah</small>
            </p>
            <strong>320 XP</strong>
          </div>
        </div>
        <aside className="rank-aside">
          <Icon name="trophy" size={32} />
          <h3>Tetap penasaran.</h3>
          <p>
            Peringkat bukan tujuan akhir. Setiap cerita yang kamu pahami adalah kemajuan yang
            sesungguhnya.
          </p>
          <div className="rank-stat">
            <b>#18</b>
            <small>Peringkatmu minggu ini</small>
          </div>
          <div className="rank-stat">
            <b>120 XP</b>
            <small>Untuk naik 5 peringkat</small>
          </div>
        </aside>
      </div>
    </>
  )
}

function Profile({ alias, xp }: { alias: string; xp: number }) {
  return (
    <>
      <div className="profile-hero">
        <div className="big-avatar">{alias[0]}</div>
        <div>
          <p className="eyebrow">Profil penjelajah</p>
          <h1>{alias}</h1>
          <p>Penjelajah · Level 2</p>
        </div>
        <button className="secondary">Ubah profil</button>
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
              <b>4</b>
              <small>Nyala obor</small>
            </span>
            <span>
              <b>1</b>
              <small>Daerah selesai</small>
            </span>
          </div>
          <div className="level-line">
            <p>
              <b>Menuju Pujangga</b>
              <small>{xp} / 250 XP</small>
            </p>
            <div className="meter">
              <i style={{ width: `${Math.min(xp / 2.5, 100)}%` }} />
            </div>
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
