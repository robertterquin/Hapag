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
          <div className="home-cta-card">
            <strong>May sahog ka? Tuklasin natin ang puwedeng lutuin.</strong>
            <p>Idagdag ang mga sangkap mo sa Ulam AI at pumili ng ideyang bagay sa iyo.</p>
            <button className="button button-primary" type="button" onClick={() => onStart('')}>May sahog ka? Simulan natin <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div className="hero-illustration" aria-label="Illustration of a warm Filipino kitchen" role="img">
          <div className="illustration-pot" aria-hidden="true">🍲</div>
          <span className="ingredient-bubble ingredient-bubble-one">🥚</span>
          <span className="ingredient-bubble ingredient-bubble-two">🌶️</span>
          <span className="ingredient-bubble ingredient-bubble-three">🍅</span>
          <span className="illustration-spark illustration-spark-one" aria-hidden="true">✦</span>
          <span className="illustration-spark illustration-spark-two" aria-hidden="true">✦</span>
        </div>
      </section>

      <section className="foundation-grid" aria-label="Hapag product areas">
        <article className="info-card info-card-mango">
          <span className="card-icon" aria-hidden="true">✦</span>
          <h2>Ulam AI</h2>
          <p>From ingredients to three useful choices, with the reason each one fits.</p>
          <button type="button" className="text-button" onClick={() => onStart('')}>Explore the flow <span aria-hidden="true">→</span></button>
        </article>
        <article className="info-card info-card-green">
          <span className="card-icon" aria-hidden="true">♡</span>
          <h2>Save what works</h2>
          <p>Keep recipes and cooking decisions close for the next busy day.</p>
          <span className="card-caption">Sign in when you&apos;re ready</span>
        </article>
      </section>

      <section className="home-how-it-works" aria-labelledby="how-it-works-heading">
        <div className="home-section-heading">
          <span className="eyebrow">Simple lang</span>
          <h2 id="how-it-works-heading">How Hapag works</h2>
          <p>Gawing mas madali ang pagpili ng lulutuin sa tatlong simpleng hakbang.</p>
        </div>
        <div className="how-it-works-steps">
          <div className="how-it-works-step"><span>1</span><strong>Ilagay ang sangkap</strong></div>
          <span className="how-it-works-arrow" aria-hidden="true">→</span>
          <div className="how-it-works-step"><span>2</span><strong>Piliin ang preferences</strong></div>
          <span className="how-it-works-arrow" aria-hidden="true">→</span>
          <div className="how-it-works-step"><span>3</span><strong>Pumili ng ulam</strong></div>
        </div>
      </section>
    </div>
  )
}
