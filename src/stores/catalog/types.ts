export interface CatalogImageItem {
  url: string
  altText: string | null
}

export interface CatalogVendor {
  id: string
  name: string
  slug: string
  description: string
  deviceCount: number
}

export interface CatalogVendorDetail {
  id: string
  name: string
  slug: string
  description: string
  contactEmail: string | null
  contactPhone: string | null
  address: string | null
  devices: CatalogDevice[]
}

export interface CatalogDevice {
  id: string
  name: string
  model: string
  category: string
  priceKobo: number
  quantity: number
  vendor: {
    name: string
    slug: string
  }
  images: CatalogImageItem[]
}

export interface CatalogDeviceDetail extends CatalogDevice {
  description: string
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK'
  isFeatured: boolean
}

export interface CategoryCount {
  category: string
  count: number
}

export interface PaginationMeta {
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface PaginatedEnvelope<T> {
  data: T[]
  meta: PaginationMeta
}

export interface CatalogDevicesResult {
  data: CatalogDevice[]
  meta: PaginationMeta | undefined
}

export interface CatalogDevicesParams {
  category?: string
  vendorId?: string
  minPrice?: number
  maxPrice?: number
  page?: number
}
