'use client'

import { useEffect, useState } from 'react'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PwaInstall() {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const [hint, setHint] = useState<'ios' | 'manual' | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const register = () => navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
      if (document.readyState === 'complete') register()
      else window.addEventListener('load', register, { once: true })
    }

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    if (standalone) {
      setInstalled(true)
      return
    }

    const onPrompt = (event: Event) => {
      event.preventDefault()
      setPrompt(event as InstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setPrompt(null)
      setHint(null)
    }

    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed) return null

  async function install() {
    if (prompt) {
      await prompt.prompt()
      const choice = await prompt.userChoice
      if (choice.outcome === 'accepted') setInstalled(true)
      setPrompt(null)
      return
    }
    // iOS Safari and desktop browsers without an install prompt need manual steps.
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
    setHint(isIos ? 'ios' : 'manual')
  }

  return (
    <div className="pwa-install">
      <button
        type="button"
        className="pwa-install__box"
        onClick={install}
        aria-label="Pasang aplikasi Tapak Nusa"
        aria-expanded={hint !== null}
      >
        <svg viewBox="0 0 24 24" aria-hidden width="22" height="22">
          <path
            d="M12 3v10m0 0 4-4m-4 4-4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.5 15.5v2.5a2.5 2.5 0 0 0 2.5 2.5h10a2.5 2.5 0 0 0 2.5-2.5v-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
          />
        </svg>
        <span>Install</span>
      </button>
      {hint && (
        <p className="pwa-install__hint" role="note">
          {hint === 'ios' ? (
            <>
              Ketuk <b>Bagikan</b>, lalu pilih <b>Tambah ke Layar Utama</b>.
            </>
          ) : (
            <>
              Buka menu browser, lalu pilih <b>Install Tapak Nusa</b> / <b>Pasang aplikasi</b>.
            </>
          )}
        </p>
      )}
    </div>
  )
}
