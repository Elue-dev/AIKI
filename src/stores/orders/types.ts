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

export interface ClientOrder {
  id: string
  orderNumber: string
  userId: string
  status: string
  tenure: number
  quantity: number
  devicePriceKobo: number
  monthlyPaymentKobo: number
  totalPaymentKobo: number
  deliveryAddress: string
  device: {
    id: string
    name: string
    model: string
    vendor: { name: string }
  }
  createdAt: string
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
