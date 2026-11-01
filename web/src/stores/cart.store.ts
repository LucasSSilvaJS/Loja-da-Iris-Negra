import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types/domain'

const QTY_CAP = 10

type CartState = {
  items: CartItem[]
  direct: CartItem[] | null
  drawerOpen: boolean
  placing: boolean
  boxSize: 'P' | 'M' | 'G' | null
  directBoxSize: 'P' | 'M' | 'G' | null
  add: (item: CartItem) => void
  setQuantity: (productSlug: string, size: string, quantity: number, color?: string, note?: string) => void
  remove: (productSlug: string, size: string, color?: string, note?: string) => void
  setBoxSize: (size: 'P' | 'M' | 'G' | null) => void
  clear: () => void
  replace: (items: CartItem[]) => void
  startDirect: (item: CartItem) => void
  openDirect: (items: CartItem[], boxSize: 'P' | 'M' | 'G') => void
  noteStocks: (notes: StockNote[]) => void
  clearDirect: () => void
  openDrawer: () => void
  closeDrawer: () => void
  beginPlace: () => boolean
  endPlace: () => void
}

export type StockNote = {
  slug: string
  stock: number | null
  madeToOrder: boolean
}

function sameLine(
  item: { productSlug: string; size: string; color?: string; note?: string },
  productSlug: string,
  size: string,
  color = '',
  note = '',
): boolean {
  return (
    item.productSlug === productSlug &&
    item.size === size &&
    (item.color ?? '') === color &&
    (item.note ?? '') === note
  )
}

function soldOut(item: Pick<CartItem, 'madeToOrder' | 'stock'>): boolean {
  return !item.madeToOrder && item.stock != null && item.stock <= 0
}

function capFor(items: CartItem[], item: CartItem): number {
  if (item.madeToOrder || item.stock == null) return QTY_CAP
  const others = items
    .filter((current) => current.productSlug === item.productSlug && !sameLine(current, item.productSlug, item.size, item.color ?? '', item.note ?? ''))
    .reduce((total, current) => total + current.quantity, 0)
  return Math.min(QTY_CAP, Math.max(0, item.stock - others))
}

function withinStock(item: CartItem): CartItem | null {
  if (item.madeToOrder) return item
  if (soldOut(item)) return null
  const cap = item.stock == null ? QTY_CAP : Math.min(QTY_CAP, item.stock)
  const quantity = Math.min(item.quantity, cap)
  if (quantity <= 0) return null
  return { ...item, quantity }
}

export function lineMax(items: CartItem[], item: CartItem): number {
  return capFor(items, item)
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      direct: null,
      boxSize: null,
      directBoxSize: null,
      drawerOpen: false,
      placing: false,
      add: (item) =>
        set((state) => {
          if (soldOut(item)) return state
          const withStock = state.items.map((current) =>
            current.productSlug === item.productSlug && item.stock != null
              ? { ...current, stock: item.stock }
              : current,
          )
          const cap = capFor(withStock, item)
          if (cap <= 0) return state
          const index = withStock.findIndex((current) =>
            sameLine(current, item.productSlug, item.size, item.color ?? '', item.note ?? ''),
          )
          if (index === -1) {
            return {
              items: [...withStock, { ...item, quantity: Math.min(item.quantity, cap) }],
              drawerOpen: true,
            }
          }
          const next = withStock[index]
          if (!next) return { drawerOpen: true }
          const items = withStock.slice()
          items[index] = {
            ...next,
            ...item,
            quantity: Math.min(cap, next.quantity + item.quantity),
          }
          return { items, drawerOpen: true }
        }),
      setQuantity: (productSlug, size, quantity, color = '', note = '') =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (!sameLine(item, productSlug, size, color, note)) return item
              const cap = capFor(state.items, item)
              const requested = Math.max(0, quantity)
              const next = requested > item.quantity ? Math.min(requested, cap) : requested
              const kept = next <= 0 && item.quantity > 0 && requested > 0 ? item.quantity : next
              return { ...item, quantity: kept }
            })
            .filter((item) => item.quantity > 0),
        })),
      remove: (productSlug, size, color = '', note = '') =>
        set((state) => ({
          items: state.items.filter((item) => !sameLine(item, productSlug, size, color, note)),
        })),
      setBoxSize: (boxSize) => set({ boxSize }),
      clear: () => set({ items: [], boxSize: null, directBoxSize: null, drawerOpen: false, direct: null }),
      replace: (items) =>
        set({
          items: items.flatMap((item) => {
            const next = withinStock(item)
            return next ? [next] : []
          }),
          drawerOpen: false,
          direct: null,
        }),
      startDirect: (item) => {
        const next = withinStock(item)
        if (!next) return
        const cap = capFor(get().items, next)
        if (cap <= 0) return
        set({
          direct: [{ ...next, quantity: Math.min(next.quantity, cap) }],
          directBoxSize: null,
          drawerOpen: false,
        })
      },
      openDirect: (items, boxSize) => {
        const lines = items.flatMap((item) => {
          const next = withinStock(item)
          return next ? [next] : []
        })
        if (lines.length === 0) return
        set({ direct: lines, directBoxSize: boxSize, drawerOpen: false })
      },
      noteStocks: (notes) =>
        set((state) => {
          if (notes.length === 0) return state
          const bySlug = new Map(notes.map((note) => [note.slug, note]))
          let changed = false
          const items = state.items.map((item) => {
            const note = bySlug.get(item.productSlug)
            if (!note) return item
            const stock = note.madeToOrder || note.stock == null ? undefined : note.stock
            if (item.madeToOrder === note.madeToOrder && item.stock === stock) return item
            changed = true
            return { ...item, madeToOrder: note.madeToOrder, stock }
          })
          return changed ? { items } : state
        }),
      clearDirect: () => set({ direct: null, directBoxSize: null }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      beginPlace: () => {
        if (get().placing) return false
        set({ placing: true })
        return true
      },
      endPlace: () => set({ placing: false }),
    }),
    {
      name: 'iris-negra-sacola',
      partialize: (state) => ({ items: state.items, boxSize: state.boxSize }),
    },
  ),
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0)
}
