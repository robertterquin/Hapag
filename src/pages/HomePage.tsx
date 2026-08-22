export interface HomePageProps {
  onStart: (value: string) => void
}

export function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino Meal Assistant</span>
          <h1>May sangkap ka? May maluluto tayo.</h1>
          <p className="hero-description">
            Ilagay ang mga sangkap na nasa kusina mo at tuklasin ang mga praktikal na ulam na may real-time budget estimates, sari-sari store substitutions, at guided cooking steps.
          </p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => onStart('')}>
              Simulan ang Paghahanap <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        <div className="hero-preview-wrapper" aria-label="Hapag Recipe Preview Card">
          <div className="hero-preview-card">
            <div className="hero-preview-topline">
              <span className="hero-preview-badge">Classic Ulam</span>
              <span className="hero-preview-match">96% Match</span>
            </div>

            <div className="hero-preview-body">
              <h3 className="hero-preview-title">Classic Chicken Adobo</h3>
              <p className="hero-preview-desc">Ginisang manok sa toyo, suka, at maraming piniritong bawang na may patatas.</p>

              <div className="hero-preview-metrics">
                <span>⏱ 35 min</span>
                <span>Easy</span>
                <span className="hero-preview-price">₱140–₱190</span>
                <span>4 serv.</span>
              </div>

              <div className="hero-preview-ingredients">
                <div className="hero-preview-group">
                  <span className="hero-preview-group-label meron">Meron ka na (4)</span>
                  <div className="hero-preview-chips">
                    <span className="chip-meron">✓ Manok</span>
                    <span className="chip-meron">✓ Patatas</span>
                    <span className="chip-meron">✓ Bawang</span>
                    <span className="chip-meron">✓ Toyo</span>
                  </div>
                </div>

                <div className="hero-preview-group">
                  <span className="hero-preview-group-label kulang">Kulang pa (1)</span>
                  <div className="hero-preview-chips">
                    <span className="chip-kulang">+ Suka</span>
                  </div>
                </div>
              </div>

              <div className="hero-preview-sub-tip">
                <span className="sub-tip-icon">💡</span>
                <span className="sub-tip-text"><strong>Sari-Sari Tip:</strong> Pwedeng palitan ang Patatas ng Tokwa.</span>
              </div>
            </div>
          </div>
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
