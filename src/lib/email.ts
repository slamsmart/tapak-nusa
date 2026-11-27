export type EmailSendResult =
  | { ok: true }
  | { ok: false; reason: 'email_unconfigured' | 'email_send_failed' }

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

/** Escapes interpolations so the e-mail stays safe with any name input. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Industry-standard OTP e-mail: plain white layout, brand line, one code block. */
function buildOtpHtml(name: string, code: string): string {
  const safeName = escapeHtml(name)
  return `<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:24px 12px;background:#fffcf7;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
<tr><td align="center">
<table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:600px;background:#ffffff;border:1px solid #e8e3d7;border-top:4px solid #df2029;border-radius:10px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
<tr><td style="padding:28px 32px 0;color:#df2029;font-size:16px;font-weight:700;letter-spacing:1px;">TAPAK NUSA</td></tr>
<tr><td style="padding:20px 32px 0;color:#1c1c1c;font-size:15px;line-height:1.6;">Halo ${safeName},</td></tr>
<tr><td style="padding:6px 32px 0;color:#43514c;font-size:15px;line-height:1.6;">Gunakan kode berikut untuk memverifikasi akunmu:</td></tr>
<tr><td style="padding:20px 32px 0;">
<div style="background:#f5f2ec;border:1px solid #e5e0d5;border-radius:10px;padding:20px 24px;font-size:38px;font-weight:700;letter-spacing:8px;color:#1c1c1c;text-align:center;">${code}</div>
</td></tr>
<tr><td style="padding:16px 32px 0;color:#43514c;font-size:14px;line-height:1.7;">Kode berlaku 10 menit.<br>Jangan bagikan kode ini kepada siapa pun.</td></tr>
<tr><td style="padding:16px 32px 0;color:#8a8f8b;font-size:13px;line-height:1.6;">Jika kamu tidak merasa mendaftar, abaikan email ini.</td></tr>
<tr><td style="padding:28px 32px 24px;border-top:1px solid #eef0eb;margin-top:24px;color:#9aa19c;font-size:12px;line-height:1.6;">Tim Tapak Nusa — email otomatis, mohon tidak dibalas.</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

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
    'Gunakan kode berikut untuk memverifikasi akunmu:\n\n' +
    `${code}\n\n` +
    'Kode berlaku 10 menit. Jangan bagikan kode ini kepada siapa pun.\n' +
    'Jika kamu tidak merasa mendaftar, abaikan email ini.\n\n' +
    'Tim Tapak Nusa — email otomatis, mohon tidak dibalas.'

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
        html: buildOtpHtml(name, code),
      }),
      cache: 'no-store',
    })
    if (!response.ok) return { ok: false, reason: 'email_send_failed' }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'email_send_failed' }
  }
}
