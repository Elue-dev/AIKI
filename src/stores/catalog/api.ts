import client from '@/lib/client'
import type {
  CatalogDevice,
  CatalogDeviceDetail,
  CatalogDevicesParams,
  CatalogVendor,
  CatalogVendorDetail,
  CategoryCount,
  PaginatedEnvelope,
} from './types'

export const getCatalogVendors = (): Promise<PaginatedEnvelope<CatalogVendor>> =>
  client.get('/client/catalog/vendors')

export const getCatalogVendorBySlug = (slug: string): Promise<CatalogVendorDetail> =>
  client.get(`/client/catalog/vendors/${slug}`)

export const getCatalogDevices = (
  params?: CatalogDevicesParams,
): Promise<PaginatedEnvelope<CatalogDevice>> =>
  client.get('/client/catalog/devices', params)

export const getCatalogDevice = (id: string): Promise<CatalogDeviceDetail> =>
  client.get(`/client/catalog/devices/${id}`)

export const getCatalogCategories = (): Promise<{ success: boolean; data: CategoryCount[] }> =>
  client.get('/client/catalog/categories')
