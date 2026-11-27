// Web Audio API sound generator for quiz interactions.
// Provides instant, zero-latency feedback without external asset dependencies.

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      void audioCtx.resume()
    }
    return audioCtx
  } catch {
    return null
  }
}

/**
 * Plays sound effect when an answer is evaluated:
 * - correct=true: Upbeat ascending chime arpeggio (C5 -> E5 -> G5)
 * - correct=false: Standard descending double buzz error tone
 */
export function playQuizSound(correct: boolean) {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  if (correct) {
    // 3-note harmonic major chord arpeggio (C5, E5, G5)
    const notes = [
      { freq: 523.25, time: 0, duration: 0.14 },    // C5
      { freq: 659.25, time: 0.1, duration: 0.16 },   // E5
      { freq: 783.99, time: 0.22, duration: 0.38 },  // G5
    ]

    notes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0.0001, now + time)
      gain.gain.exponentialRampToValueAtTime(0.25, now + time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + time)
      osc.stop(now + time + duration)
    })
  } else {
    // Standard descending buzzer (A3 -> E3)
    const buzzes = [
      { freq: 220.0, time: 0, duration: 0.15 },     // A3
      { freq: 164.81, time: 0.16, duration: 0.28 },  // E3
    ]

    buzzes.forEach(({ freq, time, duration }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(700, now + time)

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now + time)

      gain.gain.setValueAtTime(0.0001, now + time)
      gain.gain.linearRampToValueAtTime(0.18, now + time + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + duration)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now + time)
      osc.stop(now + time + duration)
    })
  }
}
