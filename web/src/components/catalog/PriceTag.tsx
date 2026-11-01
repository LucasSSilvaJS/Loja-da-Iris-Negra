import { formatBRL, promoPercent } from '../../lib/money'

type PriceTagProps = {
  priceCents: number
  compareAtCents?: number | null
  priceOnRequest?: boolean
}

export function PriceTag({ priceCents, compareAtCents, priceOnRequest }: PriceTagProps) {
  if (priceOnRequest) return <span className="price-tag">sob consulta</span>
  const percent = promoPercent(priceCents, compareAtCents)
  if (!percent || compareAtCents == null) {
    return <span className="price-tag">{formatBRL(priceCents)}</span>
  }
  return (
    <span className="price-tag is-promo">
      <s className="price-was">de {formatBRL(compareAtCents)}</s>
      <span className="price-now">{formatBRL(priceCents)}</span>
    </span>
  )
}
