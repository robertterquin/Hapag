export function ResultsSkeleton() {
  return (
    <div className="skeleton-list" aria-label="Loading recipe suggestions" aria-busy="true">
      {[1, 2, 3].map((item) => <div className="skeleton-card" key={item}><span /><span /><span /><span /></div>)}
    </div>
  )
}
