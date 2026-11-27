/**
 * One-off maintenance script: writes Google Maps capital-city coordinates into
 * the `provinces` collection after the latitude/longitude columns were added.
 * Idempotent — safe to re-run; it only updates existing province docs.
 *
 * Run: node --env-file=.env node_modules/tsx/dist/cli.mjs scripts/backfill-province-coords.mts
 */

import { getPayloadClient } from '../src/lib/payload'

const COORDINATES: Record<string, { latitude: number; longitude: number }> = {
  aceh: { latitude: 5.54829, longitude: 95.32376 },
  sumut: { latitude: 3.59331, longitude: 98.66895 },
  sumbar: { latitude: -0.94804, longitude: 100.36309 },
  riau: { latitude: 0.50707, longitude: 101.44778 },
  kepri: { latitude: 0.91855, longitude: 104.46651 },
  jambi: { latitude: -1.61012, longitude: 103.61312 },
  sumsel: { latitude: -2.97607, longitude: 104.77543 },
  babel: { latitude: -2.13163, longitude: 106.11693 },
  bengkulu: { latitude: -3.79285, longitude: 102.26076 },
  lampung: { latitude: -5.39714, longitude: 105.26679 },
  banten: { latitude: -6.12588, longitude: 106.14047 },
  jakarta: { latitude: -6.19445, longitude: 106.82292 },
  jabar: { latitude: -6.91746, longitude: 107.61912 },
  jateng: { latitude: -6.98381, longitude: 110.40999 },
  yogya: { latitude: -7.80137, longitude: 110.36476 },
  jatim: { latitude: -7.25747, longitude: 112.75209 },
  bali: { latitude: -8.65593, longitude: 115.21682 },
  ntb: { latitude: -8.577, longitude: 116.10049 },
  ntt: { latitude: -10.1772, longitude: 123.60703 },
  kalbar: { latitude: -0.02633, longitude: 109.3425 },
  kalteng: { latitude: -2.22458, longitude: 113.9033 },
  kalsel: { latitude: -3.31687, longitude: 114.59018 },
  kaltim: { latitude: -0.50162, longitude: 117.12648 },
  kaltara: { latitude: 3.30495, longitude: 117.58464 },
  sulut: { latitude: 1.47483, longitude: 124.84208 },
  gorontalo: { latitude: 0.53269, longitude: 123.05989 },
  sulteng: { latitude: -0.86791, longitude: 119.90466 },
  sulbar: { latitude: -2.67377, longitude: 118.88996 },
  sulsel: { latitude: -5.16158, longitude: 119.43593 },
  sultra: { latitude: -3.9749, longitude: 122.51376 },
  maluku: { latitude: -3.63867, longitude: 128.16886 },
  malut: { latitude: 0.73497, longitude: 127.56145 },
  papua: { latitude: -2.5916, longitude: 140.669 },
  papuabarat: { latitude: -0.86145, longitude: 134.06204 },
  papuaselatan: { latitude: -8.49911, longitude: 140.40498 },
  papuatengah: { latitude: -3.37223, longitude: 135.50163 },
  papuapegunungan: { latitude: -4.09215, longitude: 138.94619 },
  papuabaratdaya: { latitude: -0.87616, longitude: 131.25583 },
}

const payload = await getPayloadClient()

const provinces = await payload.find({
  overrideAccess: true,
  collection: 'provinces',
  limit: 100,
  pagination: false,
})

let updated = 0
for (const doc of provinces.docs) {
  const coords = COORDINATES[doc.slug]
  if (!coords) {
    console.warn(`No coordinates known for province slug: ${doc.slug}`)
    continue
  }
  if (doc.latitude === coords.latitude && doc.longitude === coords.longitude) continue
  await payload.update({
    overrideAccess: true,
    collection: 'provinces',
    id: doc.id,
    data: coords as never,
  })
  updated += 1
  console.log(`updated ${doc.slug} -> ${coords.latitude}, ${coords.longitude}`)
}

console.log(`\nDone. provinces updated=${updated}`)
process.exit(0)
