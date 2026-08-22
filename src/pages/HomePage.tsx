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

        <div className="hero-preview-wrapper" aria-label="Hapag Recipe Preview Card">
          <div className="hero-preview-card">
            <div className="hero-preview-topline">
              <div className="hero-preview-tags">
                <span className="hero-preview-badge">Classic Ulam</span>
                <span className="hero-preview-authenticity">Lutong Bahay</span>
              </div>
              <span className="hero-preview-match">96% Match</span>
            </div>

            <div className="hero-preview-body">
              <div className="hero-preview-header">
                <h3 className="hero-preview-title">Classic Chicken Adobo</h3>
                <span className="hero-preview-local-name">Adobong Manok na may Patatas</span>
              </div>

              <p className="hero-preview-desc">Ginisang manok sa toyo, suka, at maraming piniritong bawang na may patatas.</p>

              <div className="hero-preview-metrics">
                <span className="metric-pill">35 mins</span>
                <span className="metric-pill">Easy</span>
                <span className="metric-pill metric-price">₱140 – ₱190</span>
                <span className="metric-pill">4 servings</span>
              </div>

              <div className="hero-preview-ingredients">
                <div className="hero-preview-group">
                  <span className="hero-preview-group-label meron">Meron ka na (4)</span>
                  <div className="hero-preview-chips">
                    <span className="chip-meron">Manok</span>
                    <span className="chip-meron">Patatas</span>
                    <span className="chip-meron">Bawang</span>
                    <span className="chip-meron">Toyo</span>
                  </div>
                </div>

                <div className="hero-preview-group">
                  <span className="hero-preview-group-label kulang">Kulang pa (1)</span>
                  <div className="hero-preview-chips">
                    <span className="chip-kulang">Suka</span>
                  </div>
                </div>
              </div>

              <div className="hero-preview-sub-tip">
                <span className="sub-tip-badge">Pamalit</span>
                <span className="sub-tip-text">Pwedeng palitan ang Patatas ng Tokwa</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
