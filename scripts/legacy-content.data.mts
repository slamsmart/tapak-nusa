// Archived Tapak Nusa content extracted from the pre-Payload single-file UI.
// Source of record for the D1/R2 content migration in ./migrate-content.mts.


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
    cards: acehCards,
    questions: buildQuestions('Aceh', acehCards),
  },
  sumbar: {
    province: 'Sumatera Barat',
    intro:
      'Di antara pegunungan dan lembah, tradisi tumbuh dari cara masyarakat hidup bersama dan membaca alam.',
    cards: sumbarCards,
    questions: sumbarQuestions,
  },
  jakarta: {
    province: 'DKI Jakarta',
    intro:
      'Budaya Betawi tumbuh dari perjumpaan panjang masyarakat pelabuhan, kampung kota, bahasa, seni, dan rasa.',
    cards: jakartaCards,
    questions: buildQuestions('DKI Jakarta', jakartaCards),
  },
  yogya: {
    province: 'DI Yogyakarta',
    intro:
      'Yogyakarta mempertemukan warisan keraton, ruang hidup masyarakat, seni pertunjukan, kerajinan, dan kuliner.',
    cards: yogyaCards,
    questions: buildQuestions('DI Yogyakarta', yogyaCards),
  },
  bali: {
    province: 'Bali',
    intro:
      'Di Bali, seni, upacara, ruang, dan keseharian saling terhubung dalam praktik budaya yang terus hidup.',
    cards: baliCards,
    questions: buildQuestions('Bali', baliCards),
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
  ]

  return {
    province: row.name,
    intro: `Mulai perjalanan di ${row.name} melalui busana, lagu, dan makanan lokal yang hidup bersama masyarakatnya.`,
    cards,
    questions: buildQuestions(row.name, cards, true),
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
export { provinces, adventures, collectionCards, ranking, additionalProvinceRows }