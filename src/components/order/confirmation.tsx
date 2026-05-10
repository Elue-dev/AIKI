import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import type { ClientOrder } from '@/stores/orders/types'
import { Button } from '@/components/ui/button'
import { Separator } from '../ui/separator'
import { Link } from '@tanstack/react-router'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={handleCopy}
      className="text-gray-400 hover:text-gray-600 transition-colors"
    >
      {copied ? (
        <Check size={13} className="text-green-500" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  )
}

interface ConfirmedScreenProps {
  order: ClientOrder
  onViewOrders: () => void
  onDone: () => void
}

export function ConfirmedScreen({
  order,
  onViewOrders,
  onDone,
}: ConfirmedScreenProps) {
  const monthlyPayment = order.monthlyPaymentKobo / 100
  const total = order.totalPaymentKobo / 100

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-6 pt-6 pb-5 shrink-0" />

      <div className="bg-white flex-1 overflow-y-auto px-5 py-4 space-y-3">
        <div className="px-5 py-8 flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-full bg-green-50 flex items-center justify-center mb-4">
            <Check size={28} className="text-green-500" strokeWidth={2.5} />
          </div>
          <h3 className="text-[20px] font-semibold text-black mb-1">
            Your order is being processed
          </h3>
          <p className="text-[14px] text-black font-semibold">
            We'll notify you once your {order.device.name} is ready for
            delivery.
          </p>
        </div>

        <div className="bg-background rounded-2xl px-3 py-4">
          <p className="text-[14px] font-semibold text-gray-900 mb-4">
            Order summary
          </p>
          <div className="space-y-3 bg-white rounded-2xl px-5 py-3">
            {[
              { label: 'Item', value: order.device.name },
              {
                label: 'Payment plan',
                value: `₦${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}/month`,
              },
              {
                label: 'Repayment tenure',
                value: `${order.tenure} months`,
              },
            ].map((row) => (
              <>
                <div
                  key={row.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-[14px] text-black">{row.label}</span>
                  <span className="text-[16px] font-medium text-[#151D0C]">
                    {row.value}
                  </span>
                </div>
                <Separator />
              </>
            ))}

            <div className="flex items-center justify-between">
              <span className="text-[14px] text-black">Order reference</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] font-medium text-[#151D0C]">
                  {order.orderNumber}
                </span>
                <CopyButton text={order.orderNumber} />
              </div>
            </div>

            <Separator />

            <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
              <span className="text-[14px] font-medium text-black">Total</span>
              <span className="text-[16px] font-medium text-[#151D0C]">
                ₦{total.toLocaleString()}.00
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
        <Link to="/orders">
          <Button
            variant="outline"
            onClick={onViewOrders}
            className="rounded-full px-5"
          >
            View orders
          </Button>
        </Link>
        <Button onClick={onDone} className="rounded-full px-6">
          Done
        </Button>
      </div>
    </div>
  )
}
