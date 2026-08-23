class SoundManager {
  private audioCtx: AudioContext | null = null

  // Ensure AudioContext is created and unlocked on user gesture
  unlock(): void {
    if (typeof window === 'undefined') return
    try {
      if (!this.audioCtx) {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass()
        }
      }
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        void this.audioCtx.resume()
      }
    } catch {
      // Ignore
    }
  }

  private getContext(): AudioContext | null {
    this.unlock()
    return this.audioCtx
  }

  playConfirmationPing(): void {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)

      gain.gain.setValueAtTime(0.001, now)
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.3)
    } catch {
      // Audio playback fails gracefully
    }
  }

  playTimerChime(): void {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [
        { freq: 587.33, start: 0, duration: 0.3 },
        { freq: 783.99, start: 0.2, duration: 0.35 },
        { freq: 987.77, start: 0.42, duration: 0.75 },
      ]

      for (const note of notes) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(note.freq, now + note.start)

        gain.gain.setValueAtTime(0.001, now + note.start)
        gain.gain.exponentialRampToValueAtTime(0.4, now + note.start + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration)

        osc.connect(gain)
        gain.connect(ctx.destination)

        osc.start(now + note.start)
        osc.stop(now + note.start + note.duration + 0.05)
      }
    } catch {
      // Audio playback fails gracefully if policy blocked
    }
  }
}

export const soundManager = new SoundManager()
