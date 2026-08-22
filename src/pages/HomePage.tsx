import { useState } from "react"

export interface HomePageProps {
  onStart: (value: string) => void
}

const QUICK_PICKS = ["Manok", "Itlog", "Sardinas", "Pechay", "Kamatis", "Talong", "Toyo", "Hipon"]

interface PreviewDish {
  title: string
  localName: string
  desc: string
  match: number
  time: string
  difficulty: string
  price: string
  servings: string
  haveIngredients: string[]
  needIngredients: string[]
  subFrom: string
  subTo: string
}

const PREVIEW_DISHES: PreviewDish[] = [
  {
    title: "Classic Chicken Adobo",
    localName: "Adobong Manok na may Patatas",
    desc: "Chicken braised in soy sauce and vinegar with crisp garlic and potatoes.",
    match: 96,
    time: "35 mins",
    difficulty: "Easy",
    price: "&#x20B1;140 &#x2013; &#x20B1;190",
    servings: "4 servings",
    haveIngredients: ["Manok", "Patatas", "Bawang", "Toyo"],
    needIngredients: ["Suka"],
    subFrom: "Patatas",
    subTo: "Tokwa",
  },
  {
    title: "Sinigang na Baboy",
    localName: "Sinigang sa Sampalok",
    desc: "Pork belly simmered in tangy tamarind broth with fresh kangkong and vegetables.",
    match: 88,
    time: "50 mins",
    difficulty: "Medium",
    price: "&#x20B1;220 &#x2013; &#x20B1;300",
    servings: "4 servings",
    haveIngredients: ["Liempo", "Kangkong", "Kamatis", "Sibuyas"],
    needIngredients: ["Sampalok", "Labanos"],
    subFrom: "Sampalok",
    subTo: "Tamarind powder",
  },
  {
    title: "Tortang Talong",
    localName: "Torta ng Talong",
    desc: "Charred eggplant pan-fried in a golden savory egg batter until crispy and tender.",
    match: 100,
    time: "20 mins",
    difficulty: "Easy",
    price: "&#x20B1;60 &#x2013; &#x20B1;90",
    servings: "2 servings",
    haveIngredients: ["Talong", "Itlog", "Asin", "Paminta"],
    needIngredients: [],
    subFrom: "Talong",
    subTo: "Ampalaya",
  },
]

const PREVIEW_TABS = ["Adobo", "Sinigang", "Torta"]

const FEATURES = [
  {
    number: "1",
    title: "Ilista ang Sangkap",
    desc: "Ilagay ang mga sangkap na nasa ref o pantry mo — buong ulam, budget ingredients, kahit anong meron.",
  },
  {
    number: "2",
    title: "AI Recipe Matching",
    desc: "150 authentic Filipino ulam ang pipiliin para sa iyo — may live market cost at smart substitutions.",
  },
  {
    number: "3",
    title: "Lutuin Step-by-Step",
    desc: "Sundan ang hands-free cooking mode na may built-in timers at heat level guide sa bawat hakbang.",
  },
]

const TRUST_ITEMS = ["150 Classic Filipino Dishes", "Live Budget Estimates", "Smart Substitutions"]

export function HomePage({ onStart }: HomePageProps) {
  const [activePreview, setActivePreview] = useState(0)
  const [selectedPicks, setSelectedPicks] = useState<string[]>([])

  const dish = PREVIEW_DISHES[activePreview]

  function togglePick(pick: string) {
    setSelectedPicks((prev) =>
      prev.includes(pick) ? prev.filter((p) => p !== pick) : [...prev, pick],
    )
  }

  function handleQuickStart() {
    onStart(selectedPicks.join(", "))
  }

  return (
    <div className="page-shell page-shell-home">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Filipino Meal Assistant</span>
          <h1>May sangkap ka? May maluluto tayo.</h1>
          <p className="hero-description">
            Ilagay ang mga sangkap na meron ka — hahanapin ni Hapag ang pinaka-bagay na ulam para sa iyong budget, servings, at panlasa.
          </p>

          <div className="home-quick-picks">
            <span className="home-quick-picks-label">Mabilis na magsimula:</span>
            <div className="home-quick-picks-chips">
              {QUICK_PICKS.map((pick) => (
                <button
                  key={pick}
                  type="button"
                  className={`home-pick-chip${selectedPicks.includes(pick) ? " home-pick-chip-active" : ""}`}
                  onClick={() => togglePick(pick)}
                >
                  {selectedPicks.includes(pick) ? <span aria-hidden="true">&#x2713;</span> : <span aria-hidden="true">+</span>} {pick}
                </button>
              ))}
            </div>
          </div>

          <div className="home-cta-row">
            <button className="button button-primary" type="button" onClick={handleQuickStart}>
              {selectedPicks.length > 0
                ? `Simulan gamit ang ${selectedPicks.length} sangkap`
                : "Simulan sa Ulam AI"}{" "}
              <span aria-hidden="true">&#x2192;</span>
            </button>
          </div>

          <div className="home-trust-strip">
            {TRUST_ITEMS.map((item) => (
              <span key={item} className="home-trust-item">
                <span className="home-trust-check" aria-hidden="true">&#x2713;</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-preview-wrapper" aria-label="Hapag Recipe Preview">
          <div className="hero-preview-tabs" role="tablist" aria-label="Preview dish">
            {PREVIEW_TABS.map((label, i) => (
              <button
                key={label}
                role="tab"
                aria-selected={activePreview === i}
                type="button"
                className={`hero-preview-tab${activePreview === i ? " hero-preview-tab-active" : ""}`}
                onClick={() => setActivePreview(i)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hero-preview-card" role="tabpanel">
            <div className="hero-preview-topline">
              <div className="hero-preview-tags">
                <span className="hero-preview-badge">Classic Ulam</span>
                <span className="hero-preview-authenticity">Lutong Bahay</span>
              </div>
              <span className="hero-preview-match">{dish.match}% Match</span>
            </div>

            <div className="hero-preview-body">
              <div className="hero-preview-header">
                <h3 className="hero-preview-title">{dish.title}</h3>
                <span className="hero-preview-local-name">{dish.localName}</span>
              </div>
              <p className="hero-preview-desc">{dish.desc}</p>
              <div className="hero-preview-metrics">
                <span className="metric-pill">{dish.time}</span>
                <span className="metric-pill">{dish.difficulty}</span>
                <span className="metric-pill metric-price" dangerouslySetInnerHTML={{ __html: dish.price }} />
                <span className="metric-pill">{dish.servings}</span>
              </div>
              <div className="hero-preview-ingredients">
                <div className="hero-preview-group">
                  <span className="hero-preview-group-label meron">Meron ka na ({dish.haveIngredients.length})</span>
                  <div className="hero-preview-chips">
                    {dish.haveIngredients.map((ing) => (
                      <span key={ing} className="chip-meron">{ing}</span>
                    ))}
                  </div>
                </div>
                {dish.needIngredients.length > 0 && (
                  <div className="hero-preview-group">
                    <span className="hero-preview-group-label kulang">Kulang pa ({dish.needIngredients.length})</span>
                    <div className="hero-preview-chips">
                      {dish.needIngredients.map((ing) => (
                        <span key={ing} className="chip-kulang">{ing}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="hero-preview-sub-tip">
                <span className="sub-tip-badge">Pamalit</span>
                <span className="sub-tip-text">{dish.subFrom} &#x2192; {dish.subTo}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features-section" aria-label="How Hapag works">
        <div className="home-features-heading">
          <span className="eyebrow">Paano ito gumagana</span>
          <h2>Tatlong hakbang para sa mas simpleng pagluluto.</h2>
        </div>
        <div className="home-features-grid">
          {FEATURES.map((f) => (
            <div key={f.number} className="home-feature-card">
              <span className="home-feature-number">{f.number}</span>
              <h3 className="home-feature-title">{f.title}</h3>
              <p className="home-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
