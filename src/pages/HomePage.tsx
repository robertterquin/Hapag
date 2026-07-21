import { IngredientPrompt } from '../components/IngredientPrompt.tsx'

export interface HomePageProps {
  onStart: (value: string) => void
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino recipe assistant</span>
          <h1>Ano&apos;ng ulam?</h1>
          <p className="hero-subtitle">May sahog ka? Luto tayo.</p>
          <p className="hero-description">Tell Hapag what you have and get practical meal ideas that fit your time, budget, and household.</p>
          <IngredientPrompt onSubmit={onStart} />
          <div className="trust-note">
            <span className="trust-icon" aria-hidden="true">âœ¦</span>
            <span>AI-generated suggestions with estimated prices. Check the ingredients before cooking.</span>
          </div>
        </div>
        <div className="hero-illustration" aria-label="Illustration of a warm Filipino kitchen" role="img">
          <div className="illustration-pot" aria-hidden="true">ðŸ²</div>
          <span className="ingredient-bubble ingredient-bubble-one">ðŸ¥š</span>
          <span className="ingredient-bubble ingredient-bubble-two">ðŸŒ¶ï¸</span>
          <span className="ingredient-bubble ingredient-bubble-three">ðŸ…</span>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Hapag product areas">
        <article className="info-card info-card-mango">
          <span className="card-icon" aria-hidden="true">âœ¦</span>
          <h2>Ulam AI</h2>
          <p>From ingredients to three useful choices, with the reason each one fits.</p>
          <button type="button" className="text-button" onClick={() => onStart('')}>Explore the flow <span aria-hidden="true">â†’</span></button>
        </article>
        <article className="info-card info-card-green">
          <span className="card-icon" aria-hidden="true">â™¡</span>
          <h2>Save what works</h2>
          <p>Keep recipes and cooking decisions close for the next busy day.</p>
          <span className="card-caption">Sign in when you&apos;re ready</span>
        </article>
      </section>
    </div>
  )
}
