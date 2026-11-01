export function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function formatAsking(cents: number, onRequest?: boolean): string {
  if (onRequest) return 'sob consulta'
  return formatBRL(cents)
}

export function promoPercent(priceCents: number, compareAtCents?: number | null): number | null {
  if (compareAtCents == null || priceCents <= 0 || compareAtCents <= priceCents) return null
  const percent = Math.round(((compareAtCents - priceCents) / compareAtCents) * 100)
  return percent >= 1 ? percent : null
}
