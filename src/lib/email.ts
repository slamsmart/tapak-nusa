export type EmailSendResult =
  | { ok: true }
  | { ok: false; reason: 'email_unconfigured' | 'email_send_failed' }

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/**
 * Sends the registration OTP via Resend's REST API. When RESEND_API_KEY is
 * unset the caller must surface a structured error instead of faking success:
 * the account stays unverified until mail delivery actually works. Note:
 * onboarding@resend.dev only delivers to the Resend account owner's own inbox
 * until a domain is verified (DNS) and RESEND_FROM is set.
 */
export async function sendOtpEmail({
  to,
  code,
  name,
}: {
  to: string
  code: string
  name: string
}): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, reason: 'email_unconfigured' }

  const from = process.env.RESEND_FROM || 'Tapak Nusa <onboarding@resend.dev>'
  const subject = 'Kode verifikasi Tapak Nusa'
  const text =
    `Halo ${name},\n\n` +
    `Kode verifikasi akun Tapak Nusa kamu:\n\n${code}\n\n` +
    'Kode berlaku 10 menit. Jangan bagikan kode ini kepada siapa pun.\n' +
    'Jika kamu tidak merasa mendaftar, abaikan email ini.'

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        html: [
          `<p>Halo ${name},</p>`,
          '<p>Kode verifikasi akun Tapak Nusa kamu:</p>',
          `<p style="font-size:28px;letter-spacing:8px;font-weight:700;">${code}</p>`,
          '<p>Kode berlaku 10 menit. Jangan bagikan kode ini kepada siapa pun.</p>',
          '<p style="color:#6a7671;">Jika kamu tidak merasa mendaftar, abaikan email ini.</p>',
        ].join(''),
      }),
      cache: 'no-store',
    })
    if (!response.ok) return { ok: false, reason: 'email_send_failed' }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'email_send_failed' }
  }
}
