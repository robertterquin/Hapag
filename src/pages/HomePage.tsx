export interface HomePageProps {
  onStart: (value: string) => void
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino meal assistant</span>
          <h1>May sangkap ka? May maluluto tayo.</h1>
          <p className="hero-subtitle">Mula sa kusina mo, hanap tayo ng ulam.</p>
          <p className="hero-description">Ilagay ang mga sangkap na meron ka, suriin ang nakita ni Hapag, at iangkop ang mga ideya sa budget, servings, at panlasang gusto mo.</p>
          <div className="home-cta-content">
            <strong>Tuklasin ang ulam na bagay sa iyo.</strong>
            <p>Sa Ulam AI, ilalagay mo ang mga sangkap mo, pipili ng preferences, at makakakita ng tatlong praktikal na ideya.</p>
            <button className="button button-primary" type="button" onClick={() => onStart('')}>Simulan sa Ulam AI <span aria-hidden="true">→</span></button>
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

      <section className="home-how-it-works" aria-labelledby="how-it-works-heading">
        <div className="home-section-heading">
          <span className="eyebrow">Simple lang</span>
          <h2 id="how-it-works-heading">Paano gumagana ang Hapag?</h2>
          <p>Mula sa mga sangkap mo hanggang sa ulam na puwede mong lutuin.</p>
        </div>
        <div className="how-it-works-steps">
          <div className="how-it-works-step"><span>1</span><strong>Ilagay ang mga sangkap</strong></div>
          <span className="how-it-works-arrow" aria-hidden="true">↓</span>
          <div className="how-it-works-step"><span>2</span><strong>Suriin at iangkop ang preferences</strong></div>
          <span className="how-it-works-arrow" aria-hidden="true">↓</span>
          <div className="how-it-works-step"><span>3</span><strong>Pumili ng ulam at simulan ang pagluluto</strong></div>
        </div>
      </section>
    </div>
  )
}
