import type { BoxPiece, Order } from '../types/domain'
import { request } from './http'

export type CreateOrderPayload = {
  items: { productSlug: string; size: string; quantity: number; color?: string; contents?: BoxPiece[] }[]
  boxSize?: 'P' | 'M' | 'G'
}

export const ordersService = {
  create(payload: CreateOrderPayload): Promise<Order> {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  find(publicId: string): Promise<Order> {
    return request<Order>(`/orders/${publicId}`)
  },
}
