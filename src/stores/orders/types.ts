export interface CalculateOrderPayload {
  tenure: number
  deviceId: string
  quantity: number
}

export interface OrderCalculation {
  deviceName: string
  deviceModel: string
  unitPriceKobo: number
  quantity: number
  subtotalKobo: number
  equityContributionKobo: number
  interestRateBps: number
  interestAmountKobo: number
  totalRepayableKobo: number
  monthlyPaymentKobo: number
  tenure: number
  moratoriumMonths: number
  firstPaymentDate: string
}

export interface CreateOrderPayload {
  tenure: number
  deviceId: string
  quantity: number
  deliveryAddress: string
}

export interface CreatedOrderItem {
  id: string
  orderId: string
  deviceId: string
  quantity: number
  unitPriceKobo: number
  totalPriceKobo: number
  deviceName: string
  deviceModel: string
  createdAt: string
}

/** Shape returned by POST /client/orders */
export interface CreatedOrder {
  id: string
  reference: string
  userId: string
  vendorId: string
  subtotalKobo: number
  equityContributionKobo: number
  interestRate: number
  totalRepayableKobo: number
  tenure: number
  monthlyPaymentKobo: number
  status: string
  deliveryAddress: string
  createdAt: string
  items: CreatedOrderItem[]
}

/** Shape returned by GET /client/orders and GET /client/orders/:id */
export interface ClientOrder {
  id: string
  reference: string
  userId: string
  vendorId: string
  status: string
  tenure: number
  subtotalKobo: number
  equityContributionKobo: number
  interestRate: number
  totalRepayableKobo: number
  monthlyPaymentKobo: number
  deliveryAddress: string
  createdAt: string
  items: CreatedOrderItem[]
  vendor?: {
    id: string
    name: string
    slug?: string
    logoUrl?: string | null
  }
  user?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
}

export interface PaginatedEnvelope<T> {
  data: T[]
  meta: {
    total: number
    page: number
    pageSize: number
    totalPages: number
  }
}
