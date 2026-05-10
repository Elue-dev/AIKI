import { useMutation, useQuery } from '@tanstack/react-query'
import * as ordersApi from './api'
import type { CalculateOrderPayload, CreateOrderPayload } from './types'
import { withSlowRequestTracking } from '@/helpers/track-slow-requests'

export const ORDERS_KEYS = {
  all: ['orders'] as const,
  list: () => [...ORDERS_KEYS.all, 'list'] as const,
  detail: (id: string) => [...ORDERS_KEYS.all, 'detail', id] as const,
}

export const useCalculateOrder = (options?: { silent?: boolean }) =>
  useMutation({
    mutationFn: (payload: CalculateOrderPayload) =>
      withSlowRequestTracking(() => ordersApi.calculateOrder(payload), options),
  })

export const useCreateOrder = (options?: { silent?: boolean }) =>
  useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      withSlowRequestTracking(() => ordersApi.createOrder(payload), options),
  })

export const useGetClientOrders = (options?: { silent?: boolean }) =>
  useQuery({
    queryKey: ORDERS_KEYS.list(),
    queryFn: () => withSlowRequestTracking(() => ordersApi.getClientOrders(), options),
  })

export const useGetClientOrder = (id: string, options?: { silent?: boolean }) =>
  useQuery({
    queryKey: ORDERS_KEYS.detail(id),
    queryFn: () => withSlowRequestTracking(() => ordersApi.getClientOrder(id), options),
    enabled: !!id,
  })
