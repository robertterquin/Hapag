import { AI_TIMEOUT_MS } from './aiTimeout.ts'

// The search's real stages. The first two run in the browser and finish at once; the third is the
// AI writing recipes; the fourth is the results appearing (the loading screen closes when it does).
export const KUSINA_STEPS = ['Reading your sangkap', 'Checking 150 Filipino dishes', 'Writing steps and prices', 'Plating your dishes'] as const
// One-word names shown under each dot.
export const KUSINA_STEP_NAMES = ['Read', 'Match', 'Write', 'Plate'] as const

// Which step is active after `elapsedMs`, and how far the AI step is through its time limit.
// The AI step never shows full: it ends when results arrive, or at the limit with catalog dishes.
export function kusinaProgress(elapsedMs: number) {
  const active = elapsedMs < 500 ? 0 : elapsedMs < 1200 ? 1 : 2
  const aiShare = active < 2 ? 0 : Math.min(0.96, (elapsedMs - 1200) / (AI_TIMEOUT_MS - 1200))
  return { active, aiShare, late: elapsedMs > AI_TIMEOUT_MS * 0.8 }
}
