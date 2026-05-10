import { useQuery } from '@tanstack/react-query'
import {
  getCatalogCategories,
  getCatalogDevice,
  getCatalogDevices,
  getCatalogVendorBySlug,
  getCatalogVendors,
} from './api'
import type { CategoryCount, CatalogDevicesParams, CatalogDevicesResult } from './types'
import { withSlowRequestTracking } from '@/helpers/track-slow-requests'

export const CATALOG_KEYS = {
  vendors: ['catalog', 'vendors'] as const,
  vendor: (slug: string) => ['catalog', 'vendors', slug] as const,
  devices: (params?: CatalogDevicesParams) => ['catalog', 'devices', params] as const,
  device: (id: string) => ['catalog', 'devices', id] as const,
  categories: ['catalog', 'categories'] as const,
}

export function useGetCatalogVendors(options?: { silent?: boolean }) {
  return useQuery({
    queryKey: CATALOG_KEYS.vendors,
    queryFn: () => withSlowRequestTracking(() => getCatalogVendors(), options),
    select: (res) => res.data,
  })
}

export function useGetCatalogVendor(slug: string) {
  return useQuery({
    queryKey: CATALOG_KEYS.vendor(slug),
    queryFn: () => withSlowRequestTracking(() => getCatalogVendorBySlug(slug)),
    enabled: !!slug,
  })
}

export function useGetCatalogDevices(
  params?: CatalogDevicesParams,
  options?: { silent?: boolean },
) {
  return useQuery({
    queryKey: CATALOG_KEYS.devices(params),
    queryFn: () => withSlowRequestTracking(() => getCatalogDevices(params), options),
    select: (res): CatalogDevicesResult => ({
      data: Array.isArray(res?.data) ? res.data : [],
      meta: res?.meta,
    }),
  })
}

export function useGetCatalogDevice(id: string) {
  return useQuery({
    queryKey: CATALOG_KEYS.device(id),
    queryFn: () => withSlowRequestTracking(() => getCatalogDevice(id)),
    enabled: !!id,
  })
}

function normalizeCategoriesResponse(res: { success: boolean; data: CategoryCount[] }): CategoryCount[] {
  return Array.isArray(res?.data) ? res.data : []
}

export function useGetCatalogCategories(options?: { silent?: boolean }) {
  return useQuery({
    queryKey: CATALOG_KEYS.categories,
    queryFn: () => withSlowRequestTracking(() => getCatalogCategories(), options),
    select: normalizeCategoriesResponse,
  })
}
