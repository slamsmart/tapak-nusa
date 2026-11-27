export type TurnstileVerifyResult =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'invalid' | 'unavailable' }

type TurnstileResponse = {
  success: boolean
  'error-codes'?: string[]
}

/**
 * Verifies a Turnstile token server-side. The widget only exists when
 * NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is set, so callers skip this
 * entirely (graceful no-sitekey behavior) when it is not.
 */
export async function verifyTurnstileToken(token: string): Promise<TurnstileVerifyResult> {
  const secret = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY
  if (!secret) return { ok: false, reason: 'unconfigured' }

  if (token.length < 10 || token.length > 4096) return { ok: false, reason: 'invalid' }

  const verificationBody = new URLSearchParams({ secret, response: token })
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: verificationBody,
      cache: 'no-store',
    })
    const result = (await response.json()) as TurnstileResponse
    if (!response.ok || !result.success) return { ok: false, reason: 'invalid' }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
}
