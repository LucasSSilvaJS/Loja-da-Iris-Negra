export type Maker = 'iris-negra' | 'eva'

export type Motif =
  | 'raven'
  | 'iris'
  | 'moon'
  | 'sticker'
  | 'cap'
  | 'corset'
  | 'jacket'
  | 'top'

export type Category = {
  slug: string
  name: string
  blurb: string
  description: string
  kind: 'banda' | 'eva'
  sortOrder: number
}

export type Product = {
  slug: string
  name: string
  summary: string
  description: string
  priceCents: number
  categorySlug: string
  maker: Maker
  motif: Motif
  image: string
  sizes: string[]
  stock: number
  madeToOrder: boolean
  featured: boolean
}

export type CartItem = {
  productSlug: string
  name: string
  size: string
  quantity: number
  unitPriceCents: number
  motif: Motif
  image?: string
  madeToOrder: boolean
  stock?: number
}

export type Track = {
  title: string
  artist: string
  album: string
  durationLabel: string
  youtubeId: string | null
  externalUrl: string
  previewUrl: string | null
  sortOrder: number
}

export type ChatMessage = {
  id: string
  nickname: string
  body: string
  createdAt: string
}

export type OrderItem = {
  productSlug: string
  name: string
  size: string
  quantity: number
  unitPriceCents: number
}

export type Order = {
  publicId: string
  code: string
  items: OrderItem[]
  totalCents: number
  status: string
  whatsappUrl: string | null
  createdAt: string
}
