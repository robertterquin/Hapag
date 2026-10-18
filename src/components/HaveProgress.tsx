interface HaveProgressProps {
  have: number
  total: number
}

export function HaveProgress({ have, total }: HaveProgressProps) {
  const percent = total === 0 ? 100 : Math.round((have / total) * 100)
  const label = total === 0 ? 'You have everything' : have === total ? `You have all ${total}` : `You have ${have} of ${total}`
  return (
    <div className="have-progress">
      <span className="have-progress-label">{label}</span>
      <span className="have-progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <span style={{ width: `${percent}%` }} />
      </span>
    </div>
  )
}
