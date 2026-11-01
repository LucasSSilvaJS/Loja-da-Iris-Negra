export function SaleBadge({ percent }: { percent: number }) {
  return (
    <span className="sale-badge" aria-label={`${percent}% de desconto`}>
      <span aria-hidden="true">-{percent}%</span>
    </span>
  )
}
