// Single source for the premium plans. The pricing modal renders these, and the
// QRIS API route maps a plan id to the Mayar payment amount from this list.
export type PremiumPlanId = 'monthly' | 'quarterly' | 'lifetime'

export type PremiumPlan = {
  id: PremiumPlanId
  name: string
  price: string
  per: string
  note: string
  badge: string | null
  amount: number
}

export const premiumPlans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Bulanan',
    price: 'Rp19.000',
    per: '/bulan',
    note: 'Akses penuh selama satu bulan',
    badge: null,
    amount: 19000,
  },
  {
    id: 'quarterly',
    name: '3 Bulan',
    price: 'Rp59.000',
    per: '/3 bulan',
    note: 'Akses penuh selama tiga bulan',
    badge: null,
    amount: 59000,
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 'Rp99.000',
    per: '',
    note: 'Sekali bayar, akses penuh selamanya',
    badge: 'Paling hemat',
    amount: 99000,
  },
]
