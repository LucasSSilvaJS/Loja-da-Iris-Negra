const TONED = new Set(['branco', 'estonada'])

export function variantLabel(item: { size: string; color?: string }): string {
  return [item.size, item.color].filter((part) => part && part.length > 0).join(' \u00b7 ')
}

export function imageForColor(image: string, color?: string): string {
  if (!image || !color || !TONED.has(color)) return image
  const dot = image.lastIndexOf('.')
  if (dot < 0) return image
  const suffix = `-${color}`
  if (image.slice(dot - suffix.length, dot) === suffix) return image
  return `${image.slice(0, dot)}${suffix}${image.slice(dot)}`
}

export function galleryForColor(product: { image: string; gallery?: string[] }, color?: string): string[] {
  const frames = product.gallery?.length ? product.gallery : product.image ? [product.image] : []
  return [...new Set(frames.map((frame) => imageForColor(frame, color)).filter((frame) => frame.length > 0))]
}
