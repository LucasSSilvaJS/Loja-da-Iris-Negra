export type BoxTier = 'P' | 'M' | 'G'

export function boxTier(product: { categorySlug: string; name: string }): BoxTier | null {
  if (product.categorySlug !== 'box') return null
  const found = product.name.match(/Caixa ([PMG])\b/)
  return found ? (found[1] as BoxTier) : 'P'
}

export function isBoxTier(value: string | undefined): value is BoxTier {
  return value === 'P' || value === 'M' || value === 'G'
}

export function asBoxTier(value: string | undefined): BoxTier {
  return value === 'M' || value === 'G' ? value : 'P'
}

export const BOX_PRESET: Record<BoxTier, string[]> = {
  P: ['chicote', 'plug-anal', 'algemas-venda', 'vibrador-golfinho', 'gel', 'seda'],
  M: ['brincos', 'pelucia-iris', 'camisa-iris', 'gel'],
  G: ['colar', 'pelucia-raven', 'camisa-iris', 'brincos'],
}
