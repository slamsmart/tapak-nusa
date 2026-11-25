/**
 * Research-backed traditional music instruments for every Indonesian province.
 *
 * Content is grounded in sources scraped 2026-11-14: Indonesian Wikipedia
 * articles, detikEdu's 38-province instrument list (built from Akhmalul
 * Khuluq's _Alat Musik Tradisional Nusantara_ and Tegar Utama's _Ensiklopedia
 * Mini Alat Musik Tradisional_), Kompas.com Skola, indonesia.travel, ANTARA,
 * and KPU Papua Pegunungan's Papua instrument guide.
 *
 * Images come from Wikimedia Commons with recorded author and license. The
 * card image is generated at 1024px and the quiz image at 640px to keep quiz
 * loading light.
 */

export type MusicEntry = {
  /** Instrument name shown on the card and used as the correct quiz answer. */
  instrument: string
  /** Two-sentence card text for children. */
  text: string
  /** Alt text describing the image honestly (instrument or its context). */
  alt: string
  /** "Author / Commons · License" attribution line. */
  credit: string
  /** Publisher credited for the text. */
  source: string
  /** Human-readable source title. */
  sourceTitle: string
  /** Canonical source URL. */
  sourceURL: string
  /** Wikimedia Commons file name (without the File: prefix). */
  commonsFile: string
  /** `/wikipedia/commons/` hash path of the original upload. */
  hashPath: string
  /** Second quiz question about the instrument's facts. */
  fact: {
    q: string
    options: string[]
    answer: number
    why: string
  }
}

export const musicEntries: Record<string, MusicEntry> = {
  aceh: {
    instrument: 'Rapai',
    text: 'Rapai adalah gendang bundar kecil khas Aceh yang dipukul dengan telapak tangan. Ia mengiringi zikir dan tarian seperti Rapai Geleng yang penuh gerak bersama.',
    alt: 'Rapai Pase, gendang bundar dari Aceh yang dimainkan berkelompok',
    credit: 'Ishak Mutiara / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Kementerian Pariwisata RI · Wikipedia',
    sourceTitle: 'Rapai',
    sourceURL: 'https://id.wikipedia.org/wiki/Rapai',
    commonsFile: 'Rapai_Pase.jpg',
    hashPath: 'b/b9/',
    fact: {
      q: 'Rapai dari Aceh dimainkan dengan cara…',
      options: ['Dipukul dengan tangan', 'Digesek dengan busur', 'Ditiup dengan mulut', 'Digetarkan di tangan'],
      answer: 0,
      why: 'Rapai adalah gendang bundar berbunyi dari getaran membran kulit yang dipukul dengan tangan.',
    },
  },
  sumut: {
    instrument: 'Gordang Sambilan',
    text: 'Gordang Sambilan dari Mandailing, Sumatera Utara, berisi sembilan gendang bertingkat yang dimainkan bersama. Ia mengiringi upacara adat hingga tarian Margondang.',
    alt: 'Sembilan gendang Gordang Sambilan milik masyarakat Mandailing',
    credit: 'Nasution007 / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Gordang Sambilan',
    sourceURL: 'https://id.wikipedia.org/wiki/Gordang_Sambilan',
    commonsFile: 'Gendang_sambilan_tampak_dari_samping.jpg',
    hashPath: 'b/b8/',
    fact: {
      q: 'Berapa banyak gendang dalam Gordang Sambilan?',
      options: ['Sembilan', 'Lima', 'Tiga', 'Sebelas'],
      answer: 0,
      why: 'Nama sambilan berarti sembilan; setiap gendang punya ukuran dan nada yang berbeda.',
    },
  },
  sumbar: {
    instrument: 'Talempong',
    text: 'Talempong adalah gong kecil Minangkabau dengan diameter sekitar 15-17,5 sentimeter. Dimainkan berkelompok, ia mengiringi tari Pasambahan dan prosesi adat.',
    alt: 'Talempong gong kecil dari Sumatera Barat',
    credit: 'Wilma prima / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Talempong',
    sourceURL: 'https://id.wikipedia.org/wiki/Talempong',
    commonsFile: 'Talempong_-_Sumatra_Barat.jpg',
    hashPath: '6/66/',
    fact: {
      q: 'Talempong dimainkan dengan cara…',
      options: ['Dipukul', 'Ditiup', 'Digesek', 'Dihentakkan pada lantai'],
      answer: 0,
      why: 'Talempong adalah gong kecil yang dipukul sehingga bunyinya bersahutan.',
    },
  },
  riau: {
    instrument: 'Gambus',
    text: 'Gambus adalah alat musik petik Melayu yang tumbuh di Riau dan mengiringi tarian Zapin. Bentuknya seperti mandolin dengan bunyi yang hangat.',
    alt: 'Prangko Gambus Riau dari seri alat musik tradisional Indonesia',
    credit: 'Pos Indonesia / Wikimedia Commons · Domain Publik',
    source: 'Wikipedia',
    sourceTitle: 'Gambus',
    sourceURL: 'https://id.wikipedia.org/wiki/Gambus',
    commonsFile: 'Stamp_of_Indonesia_-_2013_-_Colnect_666537_-_Gambus_Riau.jpeg',
    hashPath: '1/14/',
    fact: {
      q: 'Tarian Melayu yang biasanya diiringi gambus adalah…',
      options: ['Zapin', 'Saman', 'Kecak', 'Beluk'],
      answer: 0,
      why: 'Gambus menjadi musik pengiring tarian Zapin pada berbagai hajatan Melayu.',
    },
  },
  kepri: {
    instrument: 'Gendang Panjang',
    text: 'Gendang panjang adalah gendang bertubuh panjang khas Kepulauan Riau yang ditepuk dengan telapak tangan. Ia mengiringi lagu Melayu serta upacara adat.',
    alt: 'Prangko Gendang Panjang Kepulauan Riau dari seri alat musik tradisional Indonesia',
    credit: 'Pos Indonesia / Wikimedia Commons · Domain Publik',
    source: 'Wikipedia · Kompas.com Skola',
    sourceTitle: 'Gendang panjang',
    sourceURL: 'https://id.wikipedia.org/wiki/Gendang_panjang',
    commonsFile: 'Stamp_of_Indonesia_-_2014_-_Colnect_591166_-_Long_drum_Kepulauan_Riau.jpeg',
    hashPath: 'c/c2/',
    fact: {
      q: 'Gendang panjang dimainkan dengan cara…',
      options: ['Ditepuk dengan telapak tangan', 'Ditiup', 'Dipetik', 'Digoyangkan'],
      answer: 0,
      why: 'Gendang panjang termasuk membranofon yang ditepuk tepat agar bunyinya pas.',
    },
  },
  jambi: {
    instrument: 'Serangko',
    text: 'Serangko dari Kerinci, Jambi, adalah terompet dari tanduk kerbau sepanjang hingga 1,5 meter. Dahulu dipakai sebagai tanda perang atau kabar musibah.',
    alt: 'Lanskap Gunung Kerinci di Jambi, kampung halaman serangko',
    credit: 'Attomy / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Budaya Indonesia · detikEdu',
    sourceTitle: 'Serangko',
    sourceURL: 'https://budaya-indonesia.org/Serangko-1',
    commonsFile: 'Gunung_kerinci_-_Jambi.jpg',
    hashPath: 'a/aa/',
    fact: {
      q: 'Serangko Kerinci dibuat dari…',
      options: ['Tanduk kerbau', 'Bambu hijau', 'Kulit kambing', 'Kayu pinus'],
      answer: 0,
      why: 'Serangko terbuat dari tanduk kerbau berpanjang hingga 1,5 meter dan dimainkan dengan cara ditiup.',
    },
  },
  bengkulu: {
    instrument: 'Dol',
    text: 'Dol dari Bengkulu berbentuk seperti bedug kecil dengan membran kulit sapi. Ia mengiringi Festival Tabut yang digelar setiap 1-10 Muharam.',
    alt: 'Tokok dol, pukulan pada gendang dol khas Bengkulu',
    credit: 'Muhammad Ikhsan / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Kementerian Pariwisata RI · Wikipedia',
    sourceTitle: 'Dol',
    sourceURL: 'https://id.wikipedia.org/wiki/Dol',
    commonsFile: 'Tokok_Dol.jpg',
    hashPath: '1/1e/',
    fact: {
      q: 'Festival yang diiringi dol di Bengkulu adalah…',
      options: ['Tabut', 'Tabuik', 'Sekaten', 'Bau Nyale'],
      answer: 0,
      why: 'Dol menjadi musik pengiring Festival Tabut di Bengkulu setiap 1-10 Muharam.',
    },
  },
  sumsel: {
    instrument: 'Genggong Besemah',
    text: 'Genggong Besemah dari Pagaralam, Sumatera Selatan, berbunyi nyaring seperti harmonika. Petani dahulu memainkannya sambil menjaga sawah dan kebun.',
    alt: 'Genggong, harpa mulut bambu khas Besemah Sumatera Selatan',
    credit: 'Kementerian Pendidikan dan Kebudayaan / Wikimedia Commons · Domain Publik',
    source: 'detikSumbagsel',
    sourceTitle: '10 Alat Musik Khas Palembang dan Berbagai Daerah Lain di Sumsel',
    sourceURL: 'https://www.detik.com/sumbagsel/budaya/d-8108642/10-alat-musik-khas-palembang-dan-berbagai-daerah-lain-di-sumsel',
    commonsFile: 'Genggong_1.jpg',
    hashPath: '0/0d/',
    fact: {
      q: 'Bunyi genggong paling mirip alat musik…',
      options: ['Harmonika', 'Gitar', 'Bedug', 'Kecapi'],
      answer: 0,
      why: 'Genggong ditempelkan pada bibir dan lidah bambunya digerakkan sehingga berbunyi seperti harmonika.',
    },
  },
  lampung: {
    instrument: 'Gamolan',
    text: 'Gamolan Pekhing dari Lampung adalah alat musik pukul berbahan bambu yang dikenal pula sebagai cetik. Bunyinya menemani tradisi musik masyarakat Lampung.',
    alt: 'Gamolan, xilofon bambu dari Lampung',
    credit: 'Ahmad suro / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Gamolan Pekhing',
    sourceURL: 'https://id.wikipedia.org/wiki/Gamolan_Pekhing',
    commonsFile: 'Gamolan_Kepaksian_Sekala_Brak.jpg',
    hashPath: 'e/ef/',
    fact: {
      q: 'Gamolan dibuat dari…',
      options: ['Bambu', 'Kuningan', 'Tanah liat', 'Kulit kerbau'],
      answer: 0,
      why: 'Gamolan Pekhing termasuk alat musik berbilah yang terbuat dari bambu dan dimainkan dipukul.',
    },
  },
  babel: {
    instrument: 'Dambus',
    text: 'Dambus dari Bangka Belitung adalah alat musik petik Melayu dengan senar ganda. Ujungnya diukir bentuk kepala rusa atau kijang.',
    alt: 'Dambus, alat musik petik khas Bangka Belitung dengan ukiran kepala rusa',
    credit: 'Puji Hastuti / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia · Kompas.com Skola',
    sourceTitle: 'Dambus',
    sourceURL: 'https://id.wikipedia.org/wiki/Dambus',
    commonsFile: 'Alat_Musik_Dambus.jpg',
    hashPath: 'f/fb/',
    fact: {
      q: 'Ujung dambus sering diukir bentuk…',
      options: ['Kepala rusa atau kijang', 'Bintang laut', 'Sayap elang', 'Cakar harimau'],
      answer: 0,
      why: 'Menurut Warisan Budaya Takbenda, dambus berujung ukiran kepala rusa atau kijang.',
    },
  },
  banten: {
    instrument: 'Dogdog Lojor',
    text: 'Dogdog lojor dari Banten adalah gendang tabung bambu dengan satu membran yang dipukul berpasangan. Ia mengiringi permainan rakyat dan upacara adat.',
    alt: 'Prangko Dogdog Lojor Banten dari seri alat musik tradisional Indonesia',
    credit: 'Pos Indonesia / Wikimedia Commons · Domain Publik',
    source: 'Wikipedia',
    sourceTitle: 'Dogdog Lojor',
    sourceURL: 'https://id.wikipedia.org/wiki/Dogdog_Lojor',
    commonsFile: 'Stamp_of_Indonesia_-_2014_-_Colnect_591162_-_Dogdog_lojor_Banten.jpeg',
    hashPath: '8/8a/',
    fact: {
      q: 'Dogdog dimainkan dengan cara…',
      options: ['Dipukul', 'Digesek', 'Ditiup', 'Dipetik'],
      answer: 0,
      why: 'Dogdog adalah gendang silinder berbunyi dari pukulan pada membrannya.',
    },
  },
  jakarta: {
    instrument: 'Gambang Kromong',
    text: 'Gambang kromong adalah orkes Betawi yang memadukan gamelan dan musik Tionghoa. Ia mengiringi tari Cokek serta berbagai perayaan kota.',
    alt: 'Penabuh gambang kromong Betawi di Jakarta',
    credit: 'Tumanisme / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Gambang keromong',
    sourceURL: 'https://id.wikipedia.org/wiki/Gambang_keromong',
    commonsFile: 'Gambang_Kromong.jpg',
    hashPath: '7/7d/',
    fact: {
      q: 'Gambang kromong adalah kesenian khas etnis…',
      options: ['Betawi', 'Batak', 'Dayak', 'Asmat'],
      answer: 0,
      why: 'Gambang kromong tumbuh di kampung Betawi dengan perpaduan gamelan dan musik Tionghoa.',
    },
  },
  jabar: {
    instrument: 'Angklung',
    text: 'Angklung dari Jawa Barat terbuat dari bambu dan digetarkan agar bunyinya berpadu. UNESCO menetapkannya sebagai Warisan Budaya Takbenda pada 2011.',
    alt: 'Alat angklung bambu Sunda yang digetarkan untuk berbunyi',
    credit: 'Putri siska / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Angklung',
    sourceURL: 'https://id.wikipedia.org/wiki/Angklung',
    commonsFile: 'Indonesianbamboomusicangklung.jpg',
    hashPath: '8/87/',
    fact: {
      q: 'Angklung terbuat dari…',
      options: ['Bambu', 'Logam', 'Kerang', 'Kulit kerbau'],
      answer: 0,
      why: 'Angklung adalah alat musik multitonal dari bambu yang bunyinya muncul saat digetarkan.',
    },
  },
  jateng: {
    instrument: 'Gamelan Jawa',
    text: 'Gamelan Jawa Tengah adalah ansambel gong dan tabuh yang mengiringi wayang serta upacara adat. Suaranya menjadi ruang bersama masyarakat Jawa.',
    alt: 'Perangkat gamelan Jawa tersusun lengkap di lantai',
    credit: 'fir0002 / Flagstaffotos / Wikimedia Commons · GFDL 1.2',
    source: 'Wikipedia',
    sourceTitle: 'Gamelan',
    sourceURL: 'https://id.wikipedia.org/wiki/Gamelan',
    commonsFile: 'Traditional_indonesian_instruments02.jpg',
    hashPath: '2/26/',
    fact: {
      q: 'Gamelan biasa mengiringi pertunjukan…',
      options: ['Wayang', 'Debus', 'Tabuik', 'Yospan'],
      answer: 0,
      why: 'Gamelan adalah musik pengiring wayang, tari, dan upacara adat Jawa.',
    },
  },
  yogya: {
    instrument: 'Gamelan Kraton',
    text: 'Gamelan Kraton Yogyakarta adalah warisan pusaka yang dimainkan dalam upacara keraton dan wayang wong. Setiap perangkatnya memiliki nama dan jatah istimewa.',
    alt: 'Gamelan warisan kraton Yogyakarta tersusun di paviliun keraton',
    credit: 'Michael Gunther / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Gamelan',
    sourceURL: 'https://id.wikipedia.org/wiki/Gamelan',
    commonsFile: 'Gamelan_in_the_Yogyakarta_Kraton,_Java_1124.jpg',
    hashPath: 'b/b6/',
    fact: {
      q: 'Gamelan kraton Yogyakarta dimainkan untuk…',
      options: ['Upacara keraton dan wayang', 'Balapan motor', 'Pertandingan bola', 'Arak-arakan sepeda'],
      answer: 0,
      why: 'Gamelan kraton menjadi musik upacara kerajaan, wayang wong, dan perayaan istana.',
    },
  },
  jatim: {
    instrument: 'Saronen',
    text: 'Saronen adalah musik rakyat Madura, Jawa Timur, yang ritmis dan meriah. Ia mengiringi upacara adat serta perayaan masyarakat Madura.',
    alt: 'Kelompok musik saronen Madura tengah bermain bersama',
    credit: 'Ayie7791 / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Saronen',
    sourceURL: 'https://id.wikipedia.org/wiki/Saronen',
    commonsFile: 'Saronen_Madura_Traditional_Music.jpg',
    hashPath: '5/5a/',
    fact: {
      q: 'Saronen berkembang di pulau…',
      options: ['Madura', 'Sulawesi', 'Bangka', 'Bali'],
      answer: 0,
      why: 'Saronen adalah musik rakyat yang tumbuh dan berkembang di Madura.',
    },
  },
  kalbar: {
    instrument: 'Sampe',
    text: 'Sampe atau sape adalah kecapi Dayak dari Kalimantan Barat. Petikannya menemani upacara adat dan perayaan Gawai.',
    alt: 'Sape Dayak dilihat dari sisi depan dan belakang',
    credit: 'Emma dusepo / Wikimedia Commons · CC0',
    source: 'Wikipedia',
    sourceTitle: 'Sape',
    sourceURL: 'https://id.wikipedia.org/wiki/Sape',
    commonsFile: 'Sape_front_side_back.jpg',
    hashPath: '5/5c/',
    fact: {
      q: 'Sampe dimainkan dengan cara…',
      options: ['Dipetik', 'Dipukul', 'Ditiup', 'Digesek'],
      answer: 0,
      why: 'Sampe adalah alat musik petik Dayak yang dimainkan dengan jari atau pemukul kecil.',
    },
  },
  kalteng: {
    instrument: 'Garantung',
    text: 'Garantung Dayak Ngaju dari Kalimantan Tengah adalah gong bertingkat dari campuran besi, kuningan, dan perunggu. Nada muncul saat dipukul satu per satu.',
    alt: 'Deretan gong garantung Dayak Ngaju dari Kalimantan Tengah',
    credit: 'Martini Rahman / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Kompas.com Skola · Wikimedia Commons',
    sourceTitle: 'Garantung',
    sourceURL: 'https://id.wikipedia.org/wiki/Garantung',
    commonsFile: 'Gong_Garantung.jpg',
    hashPath: 'f/f1/',
    fact: {
      q: 'Garantung Dayak Ngaju terbuat dari campuran…',
      options: ['Besi, kuningan, dan perunggu', 'Bambu dan daun lontar', 'Kayu dan kulit kerbau', 'Tanah liat dan pasir'],
      answer: 0,
      why: 'Garantung Kalteng adalah perkusi logam campuran yang dipukul menghasilkan nada bertingkat.',
    },
  },
  kalsel: {
    instrument: 'Panting',
    text: 'Panting adalah kecapi kecil Banjar dari Kalimantan Selatan. Dalam Musik Panting, beberapa pemain berpetik bersama dengan irama yang rapi.',
    alt: 'Grup Musik Panting Banjar dari Kalimantan Selatan',
    credit: 'Marwan Mohamad / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Musik Panting',
    sourceURL: 'https://id.wikipedia.org/wiki/Musik_Panting',
    commonsFile: 'Grup_Musik_Panting.jpg',
    hashPath: 'b/bc/',
    fact: {
      q: 'Musik Panting berasal dari suku…',
      options: ['Banjar', 'Mentawai', 'Tengger', 'Nias'],
      answer: 0,
      why: 'Musik Panting adalah kesenian asli Suku Banjar di Kalimantan Selatan.',
    },
  },
  kaltim: {
    instrument: 'Sampek',
    text: 'Sampek adalah kecapi Dayak dari Kalimantan Timur yang dikenal lewat Festival Erau di Tenggarong. Dawai dan badan kayunya diukir dengan motif khas.',
    alt: 'Sapeh Dayak dari Tenggarong, Kalimantan Timur',
    credit: 'Unknown photographer / Wikimedia Commons · CC BY-SA 3.0',
    source: 'Wikipedia',
    sourceTitle: 'Sape',
    sourceURL: 'https://id.wikipedia.org/wiki/Sape',
    commonsFile: 'Dayak_Sapeh,_Tenggarong,_Kalimantan,_early_20th_century.jpg',
    hashPath: '5/55/',
    fact: {
      q: 'Festival adat Dayak di Tenggarong, Kalimantan Timur adalah…',
      options: ['Erau', 'Gawai', 'Tabuik', 'Sekaten'],
      answer: 0,
      why: 'Festival Erau menjadi panggung kesenian Dayak Kutai termasuk musik sampek.',
    },
  },
  kaltara: {
    instrument: 'Jatung Utang',
    text: 'Jatung utang adalah gamelan bambu Suku Dayak Kenyah di Kalimantan Utara. Bilah bambunya dipukul dengan nada bertingkat.',
    alt: 'Jatung Utang, xilofon bambu Dayak Kenyah',
    credit: 'Ezagren / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Jatung Utang',
    sourceURL: 'https://id.wikipedia.org/wiki/Jatung_Utang',
    commonsFile: 'Jatung_Utang.JPG',
    hashPath: 'd/d8/',
    fact: {
      q: 'Jatung Utang dimainkan dengan cara…',
      options: ['Dipukul', 'Ditiup', 'Digesek', 'Digoyangkan'],
      answer: 0,
      why: 'Jatung utang termasuk xilofon yang bunyinya muncul saat bilah bambunya dipukul.',
    },
  },
  bali: {
    instrument: 'Gong Kebyar',
    text: 'Gong kebyar adalah gamelan Bali yang cepat dan dinamis. Nama kebyar berarti memancar, seperti ledakan tempo dan suaranya.',
    alt: 'Penabuh gamelan gong kebyar Bali dalam pameran budaya',
    credit: 'Benjamin Hollis / Wikimedia Commons · CC BY 2.0',
    source: 'Wikipedia',
    sourceTitle: 'Gong kebyar',
    sourceURL: 'https://en.wikipedia.org/wiki/Gamelan_gong_kebyar',
    commonsFile: "Women's_Gamelan_Gong_Kebyar_Exhibition.jpg",
    hashPath: '7/74/',
    fact: {
      q: 'Arti kata kebyar dalam bahasa Bali adalah…',
      options: ['Memancar', 'Melembut', 'Melambai', 'Menggema'],
      answer: 0,
      why: 'Kebyar berarti memancar atau meledak, merujuk pada perubahan tempo dan dinamika yang cepat.',
    },
  },
  ntb: {
    instrument: 'Gendang Beleq',
    text: 'Gendang beleq dari Lombok, NTB, adalah pasangan gendang besar yang dibawa dua pemain. Mereka bergerak sambil memukul irama yang rancak.',
    alt: 'Dua pemain gendang beleq besar dalam perayaan di Lombok',
    credit: 'RaiyaniM / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Gendang beleq',
    sourceURL: 'https://id.wikipedia.org/wiki/Gendang_beleq',
    commonsFile: 'Raiyani_Muharramah_Gendang_beleq_DSCF8502a.jpg',
    hashPath: '7/71/',
    fact: {
      q: 'Gendang beleq dibawa oleh…',
      options: ['Dua pemain besar', 'Sepasang kecil bersayap', 'Sepuluh penyanyi', 'Seekor kerbau'],
      answer: 0,
      why: 'Beleq berarti besar; setiap gendang dibawa seorang pemain sehingga butuh dua orang.',
    },
  },
  ntt: {
    instrument: 'Sasando',
    text: 'Sasando dari Rote, NTT, menyimpan dawai di tabung bambu dengan wadah gema dari anyaman daun lontar. Petikannya lembut dan berlapis.',
    alt: 'Sasando Rote Nusa Tenggara Timur di Museum der Kulturen Basel',
    credit: 'Vassil / Wikimedia Commons · CC0',
    source: 'Wikipedia',
    sourceTitle: 'Sasando',
    sourceURL: 'https://id.wikipedia.org/wiki/Sasando',
    commonsFile: 'Basel_Museum_der_Kulturen_Sasando_West_Timor_25102013.jpg',
    hashPath: 'c/c5/',
    fact: {
      q: 'Wadah resonansi sasando dibuat dari…',
      options: ['Anyaman daun lontar', 'Kulit kerang', 'Tanah liat', 'Kuningan'],
      answer: 0,
      why: 'Tabung sasando dibungkus wadah resonansi dari anyaman daun lontar yang disebut haik.',
    },
  },
  gorontalo: {
    instrument: 'Polopalo',
    text: 'Polopalo adalah alat musik pukul khas Gorontalo dari bilah bambu. Bunyinya berdengung saat bilah-bilahnya dipukul berurutan.',
    alt: 'Bilah polopalo Gorontalo siap dipukul',
    credit: 'Supardisahabu / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Polopalo',
    sourceURL: 'https://id.wikipedia.org/wiki/Polopalo',
    commonsFile: 'Alat_Musik_Polopalo.jpg',
    hashPath: '5/51/',
    fact: {
      q: 'Polopalo termasuk kelompok alat musik…',
      options: ['Idiofon yang dipukul', 'Aerofon yang ditiup', 'Kordofon yang dipetik', 'Membranofon yang digesek'],
      answer: 0,
      why: 'Polopalo adalah idiofon: sumber bunyinya adalah badan bambunya sendiri saat dipukul.',
    },
  },
  sulbar: {
    instrument: 'Keke',
    text: 'Keke adalah seruling kecil bambu suku Mandar di Sulawesi Barat dengan ujung daun lontar seperti terompet. Petani memainkannya sambil menunggu di ladang.',
    alt: 'Suasana tradisi masyarakat Mandar di Sulawesi Barat',
    credit: 'Firmansyah Syamsuddin / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Detik Sulawesi Barat · Warisan Budaya Takbenda',
    sourceTitle: '9 Alat Musik Sulawesi Barat Beserta Penjelasannya',
    sourceURL: 'https://www.detik.com/jabar/berita/d-6192415/9-alat-musik-sulawesi-barat-beserta-penjelasannya',
    commonsFile: 'Tradision_of_mandar_culture.jpg',
    hashPath: 'd/d3/',
    fact: {
      q: 'Ujung keke Mandar dililit dengan…',
      options: ['Daun lontar', 'Kain batik', 'Kulit kambing', 'Benang merah'],
      answer: 0,
      why: 'Keke berbahan bambu kecil dengan lilitan daun lontar yang berfungsi seperti corong terompet.',
    },
  },
  sulteng: {
    instrument: 'Lalove',
    text: 'Lalove adalah seruling bambu Suku Kaili di Sulawesi Tengah. Nada nyaringnya dihasilkan dengan cara ditiup sambil menutup lubang-lubangnya.',
    alt: 'Prangko Lalove Sulawesi Tengah dari seri alat musik tradisional Indonesia',
    credit: 'Pos Indonesia / Wikimedia Commons · Domain Publik',
    source: 'Wikipedia',
    sourceTitle: 'Lalove',
    sourceURL: 'https://id.wikipedia.org/wiki/Lalove',
    commonsFile: 'Stamp_of_Indonesia_-_2014_-_Colnect_591170_-_Lalove_Sulawesi_Tengah.jpg',
    hashPath: 'a/ab/',
    fact: {
      q: 'Lalove adalah alat musik tiup dari suku…',
      options: ['Kaili', 'Karo', 'Sasak', 'Bajo'],
      answer: 0,
      why: 'Lalove merupakan alat musik tiup tradisional Suku Kaili di Sulawesi Tengah.',
    },
  },
  sulut: {
    instrument: 'Kolintang',
    text: 'Kolintang Minahasa dari Sulawesi Utara tersusun dari bilah kayu yang dipukul dengan nada bertingkat. Bunyinya melengkung hangat saat berkelompok.',
    alt: 'Kolintang Minahasa dengan bilah kayu bertingkat',
    credit: 'Sakurai Midori / Wikimedia Commons · CC BY-SA 3.0',
    source: 'Wikipedia',
    sourceTitle: 'Kolintang',
    sourceURL: 'https://id.wikipedia.org/wiki/Kolintang',
    commonsFile: 'Kolintang.JPG',
    hashPath: 'f/fb/',
    fact: {
      q: 'Kolintang dimainkan dengan cara…',
      options: ['Dipukul', 'Dipetik', 'Ditiup', 'Digesek'],
      answer: 0,
      why: 'Kolintang adalah alat musik pukul: bilah kayunya menghasilkan nada bertingkat.',
    },
  },
  sulsel: {
    instrument: 'Kacaping',
    text: 'Kacaping adalah kecapi masyarakat Bugis-Makassar di Sulawesi Selatan. Ia dipetik sambil membawakan pantun belo-belo.',
    alt: 'Prangko Kacapi Sulawesi Selatan dari seri alat musik tradisional Indonesia',
    credit: 'Pos Indonesia / Wikimedia Commons · Domain Publik',
    source: 'KabarMakassar · detikEdu',
    sourceTitle: 'Kacaping',
    sourceURL: 'https://id.wikipedia.org/wiki/Kacaping',
    commonsFile: 'Stamp_of_Indonesia_-_2015_-_Colnect_667018_-_Kacapi_Sulawesi_Selatan.jpeg',
    hashPath: '2/25/',
    fact: {
      q: 'Kacaping dimainkan dengan cara…',
      options: ['Dipetik', 'Dipukul', 'Ditiup', 'Digesek'],
      answer: 0,
      why: 'Kacaping adalah alat musik petik Bugis-Makassar yang sering mengiringi belo-belo.',
    },
  },
  sultra: {
    instrument: 'Ladolado',
    text: 'Ladolado dari Sulawesi Tenggara adalah alat musik petik empat senar yang dibentuk seperti gambus. Ia mengiringi upacara adat masyarakat Tolaki dan Buton.',
    alt: 'Monumen Jam Kendari, Sulawesi Tenggara, kampung halaman ladolado',
    credit: 'Salmiah La Suma / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Kompas.com Skola · Kemendikbud',
    sourceTitle: 'Ladolado, Alat Musik Khas Sulawesi Tenggara',
    sourceURL: 'https://www.kompas.com/skola/read/2021/05/17/100000569/ladolado-alat-musik-khas-sulawesi-tenggara',
    commonsFile: 'Clock_Monument_in_Mandonga,_Kendari,_South_East_Sulawesi.jpg',
    hashPath: '9/93/',
    fact: {
      q: 'Berapa jumlah senar ladolado?',
      options: ['Empat', 'Satu', 'Sepuluh', 'Dua puluh'],
      answer: 0,
      why: 'Ladolado dilengkapi empat senar dawai yang dikencangkan dengan pemutar kayu di kepalanya.',
    },
  },
  maluku: {
    instrument: 'Totobuang',
    text: 'Totobuang dari Maluku adalah deretan gong kecil bertingkat yang dipukul bersama tifa. Paduannya menjadi musik penyambutan di Ambon.',
    alt: 'Pemusik totobuang dan tifa di Amahusu, Ambon',
    credit: 'H.W. van Rinsum / Tropenmuseum / Wikimedia Commons · CC BY-SA 3.0',
    source: 'detikEdu · Tropenmuseum',
    sourceTitle: 'Tifa Totobuang',
    sourceURL: 'https://www.detik.com/jogja/budaya/d-7761408/daftar-alat-musik-tradisional-38-provinsi-di-indonesia-dan-cara-memainkannya',
    commonsFile: 'COLLECTIE_TROPENMUSEUM_Muzikanten_tijdens_het_bespelen_van_een_totobuang_en_trommen_Amahusu_TMnr_20018272.jpg',
    hashPath: 'f/f3/',
    fact: {
      q: 'Totobuang biasanya dipukul bersama…',
      options: ['Tifa', 'Angklung', 'Gitar', 'Suling ghaib'],
      answer: 0,
      why: 'Musik totobuang memadukan deretan gong kecil dengan tabuhan tifa.',
    },
  },
  malut: {
    instrument: 'Togal',
    text: 'Musik togal dari Bokimiake, Halmahera Selatan, memadukan biola, gambus, gong, dan tifa. Ia memeriahkan pernikahan dengan tarian yang ramai.',
    alt: 'Pemandangan Kota Ternate di Maluku Utara',
    credit: 'Tom Weinz / U.S. Foreign Service / Wikimedia Commons · Domain Publik',
    source: 'ANTARA News · Wikipedia',
    sourceTitle: 'Tari Togal',
    sourceURL: 'https://id.wikipedia.org/wiki/Tari_Togal',
    commonsFile: 'Ternate_(City),_Indonesia_(2010).jpg',
    hashPath: '1/1c/',
    fact: {
      q: 'Instrumen paling dominan dalam musik togal adalah…',
      options: ['Biola (fiyol)', 'Trompet', 'Harmonika', 'Tuts'],
      answer: 0,
      why: 'Alunan biola atau fiyol menjadi pengatur irama gerak para penari togal.',
    },
  },
  papua: {
    instrument: 'Tifa',
    text: 'Tifa adalah gendang kayu Papua yang dilubangi di tengah dan ditutup kulit rusa. Ia dipukul dengan tangan dalam upacara adat.',
    alt: 'Penari memainkan tifa di Papua',
    credit: 'Michael tanur / Wikimedia Commons · CC BY-SA 4.0',
    source: 'Wikipedia',
    sourceTitle: 'Tifa',
    sourceURL: 'https://id.wikipedia.org/wiki/Tifa',
    commonsFile: 'Penari_tifa_papua.jpg',
    hashPath: 'd/d4/',
    fact: {
      q: 'Tifa dimainkan dengan cara…',
      options: ['Dipukul dengan tangan', 'Ditiup', 'Dipetik', 'Digetarkan'],
      answer: 0,
      why: 'Tifa berbentuk tabung kayu dengan satu ujung kulit hewan yang dipukul tangan.',
    },
  },
  papuabarat: {
    instrument: 'Guoto',
    text: 'Guoto dari Manokwari dan Fakfak, Papua Barat, dipetik seperti kecapi. Senarnya dari rotan atau kawat dengan wadah gema setengah lingkaran.',
    alt: 'Pantai Inggandi di Teluk Manokwari, Papua Barat',
    credit: 'Elton Airori / Wikimedia Commons · CC BY-SA 4.0',
    source: 'KPU Papua Pegunungan · Budaya Indonesia',
    sourceTitle: 'Alat Musik Guoto',
    sourceURL: 'https://budaya-indonesia.org/Alat-Musik-Guoto',
    commonsFile: 'Pantai_Inggandi_di_pesisir_Teluk_Manokwari,_Kabupaten_Manokwari_Provinsi_Papua_Barat.jpg',
    hashPath: '8/8c/',
    fact: {
      q: 'Senar guoto dibuat dari…',
      options: ['Rotan atau kawat', 'Tali tambora', 'Serat melon', 'Rambut kelapa'],
      answer: 0,
      why: 'Guoto memiliki wadah resonansi setengah lingkaran dengan senar dari rotan atau kawat.',
    },
  },
  papuaselatan: {
    instrument: 'Tifa Merauke',
    text: 'Tifa adalah gendang kayu Merauke, Papua Selatan. Piagam hak cipta historisnya bahkan diserahkan pemerintah Belanda kepada Merauke pada 2022.',
    alt: 'Tupai tifa dari Festival Budaya Lima Raja Merauke',
    credit: 'MC Kabupaten Merauke / Infopublik.id / Wikimedia Commons · Domain Publik',
    source: 'Pemerintah Kabupaten Merauke · KPU Papua Pegunungan',
    sourceTitle: 'Pemerintah Belanda Serahkan Piagam Hak Cipta Tifa Sebagai Alat Musik Tradisional Merauke',
    sourceURL: 'https://setda.merauke.go.id/news/11/pemerintah-belanda-serahkan-piagam-hak-cipta-tifa-sebagai-alat-musik-tradisional-merauke',
    commonsFile: 'Festifal_Budaya_Lima_Raja_Tifa.webp',
    hashPath: 'e/ef/',
    fact: {
      q: 'Alat musik yang dihormati Merauke dengan piagam hak cipta adalah…',
      options: ['Tifa', 'Sasando', 'Togal', 'Rindik'],
      answer: 0,
      why: 'Tifa menjadi alat musik tradisional Merauke yang diakui melalui piagam hak cipta.',
    },
  },
  papuatengah: {
    instrument: 'Yi',
    text: 'Yi adalah seruling tebal dari Papua Tengah yang ditiup untuk mengiringi tarian buru dan menyampaikan pesan adat.',
    alt: 'Pemandangan Kota Timika di Papua Tengah',
    credit: 'Davidelit / Wikimedia Commons · CC0',
    source: 'KPU Papua Pegunungan',
    sourceTitle: 'Mengenal Alat Musik Papua: Jenis, Asal Provinsi, dan Cara Memainkannya',
    sourceURL: 'https://papuapegunungan.kpu.go.id/blog/read/2393_mengenal-alat-musik-papua-jenis-asal-provinsi-dan-cara-memainkannya',
    commonsFile: 'TimikaPapua.jpg',
    hashPath: '3/38/',
    fact: {
      q: 'Yi dimainkan dengan cara…',
      options: ['Ditiup', 'Dipukul', 'Dipetik', 'Dihentakkan'],
      answer: 0,
      why: 'Yi mirip suling namun lebih tebal dan ditiup dengan lubang angin yang lebih besar.',
    },
  },
  papuapegunungan: {
    instrument: 'Pikon',
    text: 'Pikon dari Lembah Baliem, Papua Pegunungan, adalah seruling bambu kecil dengan tali rotan. Saat ditarik, suaranya menyerupai kicau burung.',
    alt: 'Pemain pikon Papua memegang seruling bambu kecilnya',
    credit: 'Nurul Ichlasiah / Wikimedia Commons · CC BY-SA 4.0',
    source: 'KPU Papua Pegunungan · Wikipedia',
    sourceTitle: 'Pikono',
    sourceURL: 'https://id.wikipedia.org/wiki/Pikono',
    commonsFile: 'The_man_is_playing_Pikon,_Papuan_traditional_music_instrument.jpg',
    hashPath: '6/60/',
    fact: {
      q: 'Suara pikon menyerupai…',
      options: ['Kicau burung', 'Guntur', 'Deburan ombak', 'Bising mesin'],
      answer: 0,
      why: 'Pikon ditiup sambil menarik tali resonansinya sehingga terdengar seperti dengungan atau kicau burung.',
    },
  },
  papuabaratdaya: {
    instrument: 'Triton',
    text: 'Triton dari Papua Barat Daya adalah kerang besar yang ditiup seperti terompet. Dahulu menjadi alat kabar antar suku di pesisir.',
    alt: 'Kerang triton dari koleksi Wereldmuseum Rotterdam',
    credit: 'Wereldmuseum Rotterdam / Wikimedia Commons · CC BY 4.0',
    source: 'Fajar Pendidikan · KPU Papua Pegunungan',
    sourceTitle: '7 Alat Musik Tradisional Provinsi Papua Barat Daya',
    sourceURL: 'https://www.fajarpendidikan.co.id/7-alat-musik-tradisional-provinsi-papua-barat-daya/',
    commonsFile: "Collectie_Wereldmuseum,_TM-15-389,_Schelphoorn,_'Schelphoorn_van_een_triton_schelp',_voor_1900.jpg",
    hashPath: '3/39/',
    fact: {
      q: 'Triton dibuat dari…',
      options: ['Kerang laut besar', 'Bambu tua', 'Tanduk kerbau', 'Kulit kayu sagu'],
      answer: 0,
      why: 'Triton adalah cangkang kerang laut besar yang ditiup ujungnya seperti terompet.',
    },
  },
}

/** Card image URL from Wikimedia Commons, sized for full-width card display. */
export const musicCardImages: Record<string, string> = {}
/** Quiz image URL from Wikimedia Commons, sized lighter for quiz loading. */
export const musicQuizImages: Record<string, string> = {}

for (const [provinceId, entry] of Object.entries(musicEntries)) {
  musicCardImages[provinceId] = `https://thumb.wikimedia.org/wikipedia/commons/thumb/${entry.hashPath}${entry.commonsFile}/960px-${entry.commonsFile}`
  musicQuizImages[provinceId] = `https://thumb.wikimedia.org/wikipedia/commons/thumb/${entry.hashPath}${entry.commonsFile}/500px-${entry.commonsFile}`
}

/** All instrument names, used as distractor pool for identify questions. */
const musicInstrumentNames = Object.values(musicEntries)
  .map((entry) => entry.instrument)
  .sort((a, b) => a.localeCompare(b, 'id'))

const provinceSeed = (provinceId: string) => {
  let hash = 0
  for (let index = 0; index < provinceId.length; index += 1) {
    hash = (hash * 31 + provinceId.charCodeAt(index)) % 100003
  }
  return hash
}

/**
 * Deterministic per-province distractor rotation so identify questions vary
 * across provinces instead of repeating the same alphabetical neighbors.
 */
export function musicDistractors(provinceId: string): string[] {
  const seed = provinceSeed(provinceId)
  const picked: string[] = []
  for (let step = 0; picked.length < 3 && step < musicInstrumentNames.length; step += 1) {
    const candidate = musicInstrumentNames[(seed + step * 11) % musicInstrumentNames.length]
    if (candidate && !picked.includes(candidate)) picked.push(candidate)
  }
  return picked
}

export const musicInstrumentPool: string[] = musicInstrumentNames

export const musicProvinceIds = Object.keys(musicEntries)
