import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types/domain'

const QTY_CAP = 10

type CartState = {
  items: CartItem[]
  direct: CartItem[] | null
  drawerOpen: boolean
  placing: boolean
  add: (item: CartItem) => void
  setQuantity: (productSlug: string, size: string, quantity: number) => void
  remove: (productSlug: string, size: string) => void
  clear: () => void
  replace: (items: CartItem[]) => void
  startDirect: (item: CartItem) => void
  clearDirect: () => void
  openDrawer: () => void
  closeDrawer: () => void
  beginPlace: () => boolean
  endPlace: () => void
}

function capFor(items: CartItem[], item: CartItem): number {
  if (item.madeToOrder || item.stock == null) return QTY_CAP
  const others = items
    .filter((current) => current.productSlug === item.productSlug && current.size !== item.size)
    .reduce((total, current) => total + current.quantity, 0)
  return Math.min(QTY_CAP, Math.max(0, item.stock - others))
}

export function lineMax(items: CartItem[], item: CartItem): number {
  return capFor(items, item)
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      direct: null,
      drawerOpen: false,
      placing: false,
      add: (item) =>
        set((state) => {
          const withStock = state.items.map((current) =>
            current.productSlug === item.productSlug && item.stock != null
              ? { ...current, stock: item.stock }
              : current,
          )
          const cap = capFor(withStock, item)
          if (cap <= 0) return { drawerOpen: true }
          const index = withStock.findIndex(
            (current) =>
              current.productSlug === item.productSlug && current.size === item.size,
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
      setQuantity: (productSlug, size, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.productSlug !== productSlug || item.size !== size) return item
              return { ...item, quantity: Math.min(capFor(state.items, item), Math.max(0, quantity)) }
            })
            .filter((item) => item.quantity > 0),
        })),
      remove: (productSlug, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.productSlug === productSlug && item.size === size),
          ),
        })),
      clear: () => set({ items: [], drawerOpen: false, direct: null }),
      replace: (items) => set({ items, drawerOpen: false, direct: null }),
      startDirect: (item) => set({ direct: [item], drawerOpen: false }),
      clearDirect: () => set({ direct: null }),
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
      partialize: (state) => ({ items: state.items }),
    },
  ),
)

export function cartCount(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0)
}
