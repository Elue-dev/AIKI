import { Copy, Check, X } from 'lucide-react'
import { useState } from 'react'
import { AppSheet } from '@/components/ui/app-sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useGetClientOrder } from '@/stores/orders'
import type { ClientOrder } from '@/stores/orders/types'


const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[13px] text-gray-500 shrink-0">{label}</span>
      <span className="text-[13px] font-medium text-gray-900 text-right">{value}</span>
    </div>
  )
}

interface OrderDetailSheetProps {
  orderId: string | null
  previewOrder?: ClientOrder
  onClose: () => void
}

export function OrderDetailSheet({ orderId, previewOrder, onClose }: OrderDetailSheetProps) {
  const { data: fetched, isLoading } = useGetClientOrder(orderId ?? '', { silent: true })

  // Prefer fresh fetched data, fall back to preview row data while loading
  const order: ClientOrder | undefined = fetched ?? previewOrder

  return (
    <AppSheet open={!!orderId} onClose={onClose} width={520}>
      {/* Header */}
      <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-gray-100 shrink-0">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">Order Details</h2>
          {order && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] text-gray-400">{order.reference}</span>
              <CopyButton text={order.reference} />
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {isLoading && !order ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : order ? (
          <>
            {/* Status */}
            <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3">
              <span className="text-[13px] text-gray-500">Status</span>
              <Badge status={order.status} />
            </div>

            {/* Device / Items */}
            <div className="bg-white rounded-2xl px-4 py-3">
              <p className="text-[13px] font-semibold text-gray-700 mb-2">Items</p>
              <div className="space-y-2">
                {(order.items ?? []).map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[13px] font-medium text-gray-900">{item.deviceName}</p>
                      <p className="text-[11px] text-gray-400">{item.deviceModel}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[13px] font-medium text-gray-900">
                        {fmt(item.totalPriceKobo / 100)}
                      </p>
                      <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vendor */}
            {order.vendor && (
              <div className="bg-white rounded-2xl px-4 py-3">
                <p className="text-[13px] font-semibold text-gray-700 mb-2">Vendor</p>
                <div className="flex items-center gap-3">
                  {order.vendor.logoUrl ? (
                    <img
                      src={order.vendor.logoUrl}
                      alt={order.vendor.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-[12px]">
                      {order.vendor.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-gray-900">{order.vendor.name}</span>
                </div>
              </div>
            )}

            {/* Financials */}
            <div className="bg-white rounded-2xl px-4 py-1">
              <p className="text-[13px] font-semibold text-gray-700 pt-3 mb-1">Payment Summary</p>
              <Separator />
              <DetailRow label="Subtotal" value={fmt(order.subtotalKobo / 100)} />
              <Separator />
              <DetailRow
                label="Equity Contribution"
                value={fmt(order.equityContributionKobo / 100)}
              />
              <Separator />
              <DetailRow
                label="Monthly Payment"
                value={fmt(order.monthlyPaymentKobo / 100)}
              />
              <Separator />
              <DetailRow label="Repayment Tenure" value={`${order.tenure} months`} />
              <Separator />
              <DetailRow
                label="Total Repayable"
                value={
                  <span className="text-primary font-semibold">
                    {fmt(order.totalRepayableKobo / 100)}
                  </span>
                }
              />
            </div>

            {/* Delivery */}
            <div className="bg-white rounded-2xl px-4 py-3">
              <p className="text-[13px] font-semibold text-gray-700 mb-2">Delivery</p>
              <p className="text-[13px] text-gray-600">{order.deliveryAddress}</p>
            </div>

            {/* Date */}
            <div className="bg-white rounded-2xl px-4 py-3">
              <DetailRow
                label="Date Placed"
                value={new Date(order.createdAt).toLocaleString('en-NG', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              />
            </div>
          </>
        ) : null}
      </div>
    </AppSheet>
  )
}
