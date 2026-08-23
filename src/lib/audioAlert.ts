class SoundManager {
  private audioCtx: AudioContext | null = null

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null
    if (!this.audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      void this.audioCtx.resume()
    }
    return this.audioCtx
  }

  playTimerChime(): void {
    try {
      const ctx = this.getContext()
      if (!ctx) return

      const now = ctx.currentTime
      const notes = [
        { freq: 587.33, start: 0, duration: 0.25 },
        { freq: 783.99, start: 0.18, duration: 0.3 },
        { freq: 987.77, start: 0.36, duration: 0.65 },
      ]

      for (const note of notes) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()

        osc.type = "sine"
        osc.frequency.setValueAtTime(note.freq, now + note.start)

        gain.gain.setValueAtTime(0.001, now + note.start)
        gain.gain.exponentialRampToValueAtTime(0.28, now + note.start + 0.04)
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
