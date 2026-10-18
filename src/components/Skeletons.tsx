// Mirrors the recipe card: photo, have-progress, title, metrics, then ingredient chips.
export function ResultsSkeleton() {
  return (
    <div className="skeleton-list" aria-label="Loading recipe suggestions" aria-busy="true">
      {[1, 2, 3].map((item) => (
        <div className="skeleton-card" key={item}>
          <span className="skeleton-image" />
          <span className="skeleton-progress" />
          <span className="skeleton-title" />
          <span className="skeleton-metrics" />
          <span className="skeleton-chips" />
        </div>
      ))}
    </div>
  )
}
