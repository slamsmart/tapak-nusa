/**
 * Throwaway end-to-end verification of /api/auth/* against the running dev
 * server. DELETE after verification.
 */
const BASE = 'http://localhost:3000'

type ApiResponse = {
  status: number
  setCookie: string | null
  body: Record<string, unknown>
}

async function post(path: string, body: unknown, cookie?: string): Promise<ApiResponse> {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  })
  return {
    status: response.status,
    setCookie: response.headers.get('set-cookie'),
    body: (await response.json()) as Record<string, unknown>,
  }
}

async function get(path: string, cookie?: string): Promise<ApiResponse> {
  const response = await fetch(`${BASE}${path}`, {
    headers: cookie ? { cookie } : {},
  })
  return {
    status: response.status,
    setCookie: response.headers.get('set-cookie'),
    body: (await response.json()) as Record<string, unknown>,
  }
}

let failures = 0
function expect(label: string, condition: boolean, detail?: unknown) {
  if (condition) {
    console.log(`PASS ${label}`)
  } else {
    failures += 1
    console.log(`FAIL ${label}`, detail !== undefined ? JSON.stringify(detail) : '')
  }
}

// 1. register validation
{
  const badEmail = await post('/api/auth/register', { name: 'X', email: 'not-an-email', password: 'longenough1' })
  expect('register rejects invalid email (400)', badEmail.status === 400 && badEmail.body.error === 'invalid_email')
  const shortPw = await post('/api/auth/register', { name: 'X', email: 'short-pw@example.com', password: 'short' })
  expect('register rejects short password (400)', shortPw.status === 400 && shortPw.body.error === 'invalid_password')
  const emptyName = await post('/api/auth/register', { name: '', email: 'empty-name@example.com', password: 'longenough1' })
  expect('register rejects empty name (400)', emptyName.status === 400 && emptyName.body.error === 'invalid_name')
}

// 2. register fresh email: email unconfigured (no RESEND_API_KEY)
{
  const fresh = await post('/api/auth/register', { name: 'Fresh User', email: 'fresh-1@example.com', password: 'longenough1' })
  expect('register fresh email → 503 email_unconfigured', fresh.status === 503 && fresh.body.error === 'email_unconfigured', fresh)
}

// 3. re-register existing unverified email (reuse path)
{
  const reuse = await post('/api/auth/register', { name: 'Kelana Test', email: 'kelana-test-001@example.com', password: 'rahasia123' })
  expect(
    'register reuse unverified: ok or structured email error',
    (reuse.status === 200 && reuse.body.ok === true) ||
      (reuse.status === 503 && reuse.body.error === 'email_unconfigured'),
    reuse,
  )
}

// 4. register already-verified email → generic email_taken
{
  const taken = await post('/api/auth/register', { name: 'Dup', email: 'verified-test-001@example.com', password: 'whatever123' })
  expect('register verified email → 400 email_taken', taken.status === 400 && taken.body.error === 'email_taken', taken)
}

// 5. login wrong password
{
  const wrong = await post('/api/auth/login', { email: 'verified-test-001@example.com', password: 'wrongpass1' })
  expect('login wrong password → 401', wrong.status === 401 && wrong.body.error === 'invalid_credentials', wrong)
}

// 6. login verified user → cookie session
let sessionCookie: string | null = null
{
  const ok = await post('/api/auth/login', { email: 'verified-test-001@example.com', password: 'veripass123' })
  expect('login verified → 200 status ok', ok.status === 200 && ok.body.status === 'ok', ok)
  const cookieHeader = ok.setCookie ?? ''
  sessionCookie = cookieHeader.split(';')[0] || null
  expect('login sets httpOnly payload-token cookie', /payload-token=[^;]+/.test(cookieHeader) && /HttpOnly/i.test(cookieHeader) && /SameSite=Lax/i.test(cookieHeader), cookieHeader)
  const user = ok.body.user as { name?: string; email?: string } | undefined
  expect('login returns user name+email', user?.name === 'Verified Tester' && user?.email === 'verified-test-001@example.com', user)
}

// 7. /api/users/me with session → real user, NO otp fields anywhere
{
  const me = await get('/api/users/me', sessionCookie ?? undefined)
  const raw = JSON.stringify(me.body)
  const user = me.body.user as Record<string, unknown> | null
  expect('me with session returns user', me.status === 200 && user?.email === 'verified-test-001@example.com', me.status)
  expect('me response contains no otp fields', !/otp/i.test(raw), raw)
  expect('me response contains no hash/salt', !/"hash"|"salt"|"resetPasswordToken"/.test(raw), raw)
}

// 8. logout clears cookie
{
  const out = await post('/api/users/logout', {}, sessionCookie ?? undefined)
  const cleared = /payload-token=;/.test(out.setCookie ?? '') || /Expires=Thu, 01 Jan 1970/.test(out.setCookie ?? '')
  expect('logout clears cookie', out.status === 200 && cleared, { status: out.status, setCookie: out.setCookie })
  const meAfter = await get('/api/users/me', sessionCookie ?? undefined)
  expect('me after logout → user null', meAfter.status === 200 && (meAfter.body.user === null || meAfter.body.user === undefined), meAfter.body)
}

// 9. login unverified user → otp_required, no session cookie
{
  const unverified = await post('/api/auth/login', { email: 'otp-test-001@example.com', password: 'otppass123' })
  expect('login unverified → 200 otp_required', unverified.status === 200 && unverified.body.status === 'otp_required', unverified)
  expect('login unverified sets no session cookie', !/payload-token=/.test(unverified.setCookie ?? ''), unverified.setCookie)
  expect('login unverified reports emailSent false (unconfigured)', unverified.body.emailSent === false, unverified.body)
}

// 10. verify wrong codes → attempts escalate to lockout
{
  const codes = ['111111', '222222', '333333', '444444', '555555']
  for (let index = 0; index < codes.length; index += 1) {
    const attempt = await post('/api/auth/verify', { email: 'otp-test-001@example.com', code: codes[index] ?? '' })
    if (index < 4) {
      expect(`verify wrong #${index + 1} → 401 with remaining attempts`, attempt.status === 401 && /Sisa \d+ percobaan/.test(String(attempt.body.message)), attempt.body)
    } else {
      expect('verify wrong #5 → 429 attempts_exceeded', attempt.status === 429 && attempt.body.error === 'otp_attempts_exceeded', attempt.body)
    }
  }
  const afterLock = await post('/api/auth/verify', { email: 'otp-test-001@example.com', code: '123456' })
  expect('correct code after lockout → 429 until resend', afterLock.status === 429 && afterLock.body.error === 'otp_attempts_exceeded', afterLock.body)
}

// 11. verify correct code → verified, then login works
{
  const verified = await post('/api/auth/verify', { email: 'otp-test-002@example.com', code: '123456' })
  expect('verify correct code → 200 ok', verified.status === 200 && verified.body.ok === true, verified)
  const login = await post('/api/auth/login', { email: 'otp-test-002@example.com', password: 'otppass234' })
  expect('login after verify → 200 status ok', login.status === 200 && login.body.status === 'ok', login)
  const user = login.body.user as { name?: string; email?: string } | undefined
  expect('login after verify returns user', user?.name === 'Otp Tester Two', user)
}

// 12. resend endpoint: wrong password rejected, cooldown enforced
{
  const wrongPw = await post('/api/auth/resend', { email: 'otp-test-001@example.com', password: 'nope12345' })
  expect('resend wrong password → 401', wrongPw.status === 401 && wrongPw.body.error === 'invalid_credentials', wrongPw)
  const rightPw = await post('/api/auth/resend', { email: 'otp-test-001@example.com', password: 'otppass123' })
  if (rightPw.status === 429) {
    expect('resend within cooldown → 429 with retryAfterSeconds', rightPw.body.error === 'resend_cooldown' && typeof rightPw.body.retryAfterSeconds === 'number', rightPw.body)
  } else {
    expect('resend after cooldown → 503 email_unconfigured (honest state)', rightPw.status === 503 && rightPw.body.error === 'email_unconfigured', rightPw.body)
  }
}

console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECKS FAILED`)
process.exit(failures === 0 ? 0 : 1)
