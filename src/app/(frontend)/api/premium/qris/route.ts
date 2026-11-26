import { NextResponse } from 'next/server'
import { premiumPlans } from '@/lib/premium'

/**
 * Creates a QRIS-only payment for a premium plan through the Mayar API and
 * returns the raw QRIS payload so the browser can render the QR itself. The
 * payment keeps a Mayar-side id, so GET here can poll the paid status without
 * ever exposing the API key.
 */
const MAYAR_API_BASE = 'https://api.mayar.id/hl/v2/payments'

type MayarPayment = {
  id: string
  amount: number
  status: string
  expiredAt: string | null
  paymentDetail?: {
    qr_code?: {
      channel_properties?: {
        qr_string?: string
      }
    }
  }
}

type MayarEnvelope = {
  statusCode: number
  messages: string
  data: MayarPayment
}

export async function POST(request: Request) {
  let body: { planId?: unknown; email?: unknown; name?: unknown }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Permintaan tidak valid.' }, { status: 400 })
  }

  const plan = premiumPlans.find((candidate) => candidate.id === body.planId)
  if (!plan) {
    return NextResponse.json({ error: 'Paket tidak valid.' }, { status: 400 })
  }
  const email =
    typeof body.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
      ? body.email
      : 'tamu@tapaknusa.app'
  const name =
    typeof body.name === 'string' && body.name.trim()
      ? body.name.trim().slice(0, 60)
      : 'Tamu Tapak Nusa'

  const apiKey = process.env.MAYAR_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Konfigurasi pembayaran belum tersedia.' }, { status: 500 })
  }

  // Mayar rejects duplicate creates within a minute; the timestamped notes keep
  // each "perbarui QR" attempt unique.
  let response: Response
  try {
    response = await fetch(`${MAYAR_API_BASE}/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Tapak Nusa Premium - ${plan.name}`,
        amount: plan.amount,
        email,
        description: `Langganan ${plan.name} Tapak Nusa`,
        notes: `${plan.id}:${Date.now().toString(36)}`,
        paymentMethod: 'qris',
      }),
      signal: AbortSignal.timeout(20000),
    })
  } catch {
    return NextResponse.json({ error: 'Tidak dapat menghubungi Mayar.' }, { status: 502 })
  }

  const envelope = (await response.json().catch(() => null)) as MayarEnvelope | null
  if (!response.ok || !envelope?.data) {
    return NextResponse.json(
      { error: envelope?.messages || 'Gagal membuat QRIS.' },
      { status: 502 },
    )
  }
  const qrString = envelope.data.paymentDetail?.qr_code?.channel_properties?.qr_string
  if (!qrString) {
    return NextResponse.json({ error: 'Gagal membuat kode QRIS.' }, { status: 502 })
  }

  return NextResponse.json({
    paymentId: envelope.data.id,
    amount: envelope.data.amount,
    qrString,
    expiresAt: envelope.data.expiredAt,
  })
}

export async function GET(request: Request) {
  const paymentId = new URL(request.url).searchParams.get('paymentId')
  if (
    !paymentId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paymentId)
  ) {
    return NextResponse.json({ error: 'Pembayaran tidak valid.' }, { status: 400 })
  }

  const apiKey = process.env.MAYAR_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Konfigurasi pembayaran belum tersedia.' }, { status: 500 })
  }

  let response: Response
  try {
    response = await fetch(`${MAYAR_API_BASE}/${paymentId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(10000),
    })
  } catch {
    return NextResponse.json({ error: 'Tidak dapat menghubungi Mayar.' }, { status: 502 })
  }

  const envelope = (await response.json().catch(() => null)) as MayarEnvelope | null
  if (!response.ok || !envelope?.data) {
    return NextResponse.json(
      { error: envelope?.messages || 'Pembayaran tidak ditemukan.' },
      { status: response.status === 404 ? 404 : 502 },
    )
  }

  return NextResponse.json({
    status: envelope.data.status,
    amount: envelope.data.amount,
    expiresAt: envelope.data.expiredAt,
  })
}
