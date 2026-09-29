import { MotifArt } from './MotifArt'
import type { Motif } from '../../types/domain'

type ProductShotProps = {
  motif: Motif
  image?: string
  alt: string
}

export function ProductShot({ motif, image, alt }: ProductShotProps) {
  if (!image) return <MotifArt motif={motif} />
  return <img className="art shot" src={image} alt={alt} />
}
