import { useEffect, useState } from 'react'
import { EffectCards, Keyboard } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/effect-cards'
import { SoldStamp } from '../art/SoldStamp'
import { SaleBadge } from './SaleBadge'
import { ZoomDialog } from './ProductZoom'

type ProductDeckProps = {
  images: string[]
  alt: string
  onEmpty?: () => void
  percent?: number | null
  soldOut?: boolean
  illustrative?: boolean
}

export function ProductDeck({ images, alt, onEmpty, percent, soldOut, illustrative }: ProductDeckProps) {
  const [broken, setBroken] = useState<string[]>([])
  const [zoom, setZoom] = useState<string | null>(null)
  const list = images.join('|')
  const frames = images.filter((src) => !broken.includes(src))

  useEffect(() => {
    setBroken([])
    setZoom(null)
  }, [list])

  useEffect(() => {
    if (images.length > 0 && frames.length === 0) onEmpty?.()
  }, [frames.length, images.length, onEmpty])

  if (frames.length === 0) return null

  return (
    <>
      <Swiper
        className="deck"
        effect="cards"
        grabCursor
        modules={[EffectCards, Keyboard]}
        keyboard={{ enabled: true }}
        cardsEffect={{ perSlideOffset: 12, perSlideRotate: 5, rotate: true, slideShadows: false }}
        aria-roledescription="baralho"
        aria-label={`Fotos de ${alt}. Arraste para ver outro \u00e2ngulo.`}
        onClick={(swiper) => {
          const src = frames[swiper.realIndex] ?? frames[swiper.activeIndex]
          if (src) setZoom(src)
        }}
      >
        {frames.map((src) => (
          <SwiperSlide key={src}>
            <div className="deck-card">
              <img
                className="art shot"
                src={src}
                alt=""
                draggable={false}
                onError={() => setBroken((current) => (current.includes(src) ? current : [...current, src]))}
              />
              {percent ? <SaleBadge percent={percent} /> : null}
              {soldOut ? <SoldStamp /> : null}
              {illustrative ? <span className="shot-label">Imagem ilustrativa</span> : null}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {zoom ? <ZoomDialog src={zoom} alt={alt} onClose={() => setZoom(null)} /> : null}
    </>
  )
}
