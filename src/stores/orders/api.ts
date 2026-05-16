import client from '@/lib/client'
import type {
  CalculateOrderPayload,
  OrderCalculation,
  CreateOrderPayload,
  CreatedOrder,
  ClientOrder,
  PaginatedEnvelope,
} from './types'

function unwrap<T>(res: any): T {
  if (res?.success === false) {
    const msg =
      res?.error?.message ??
      (Array.isArray(res?.message) ? res.message[0] : res?.message) ??
      'Request failed'
    throw new Error(msg)
  }
  if (res?.success === true && 'data' in res) return res.data as T
  return res as T
}

export const calculateOrder = async (
  payload: CalculateOrderPayload,
): Promise<OrderCalculation> => {
  const res = await client.post('/client/orders/calculate', payload)
  return unwrap<OrderCalculation>(res)
}

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<CreatedOrder> => {
  const res = await client.post('/client/orders', payload)
  // API returns { success: true, data: { order: {...} } }
  const data = unwrap<{ order: CreatedOrder }>(res)
  return data.order ?? (data as unknown as CreatedOrder)
}

export const getClientOrders = async (): Promise<PaginatedEnvelope<ClientOrder>> => {
  const res: any = await client.get('/client/orders')
  if (res?.success === false) return { data: [], meta: { total: 0, page: 1, pageSize: 20, totalPages: 0 } }
  if (res?.success === true) return { data: res.data ?? [], meta: res.meta }
  return res
}

export const getClientOrder = async (id: string): Promise<ClientOrder> => {
  const res = await client.get(`/client/orders/${id}`)
  return unwrap<ClientOrder>(res)
}
