import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { CatalogDevice } from '@/stores/catalog/types'
import type { CreatedOrder, OrderCalculation } from '@/stores/orders/types'
import { useCalculateOrder, useCreateOrder } from '@/stores/orders'
import { useMe } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { Check, CircleX, Copy, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

const fmtNGN = (kobo: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(kobo / 100)

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

const ACCOUNT_NUMBER = '1900045782'

interface SummaryScreenProps {
  device: CatalogDevice
  tenure: string
  onTenureChange: (v: string) => void
  agreed: boolean
  onAgreeChange: (v: boolean) => void
  onConfirm: (order: CreatedOrder) => void
  onCancel: () => void
}

export function SummaryScreen({
  device,
  tenure,
  onTenureChange,
  agreed,
  onAgreeChange,
  onConfirm,
  onCancel,
}: SummaryScreenProps) {
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [calcResult, setCalcResult] = useState<OrderCalculation | null>(null)

  const { mutate: calculate, isPending: isCalculating } = useCalculateOrder({
    silent: true,
  })
  const { mutateAsync: createOrder, isPending: isCreating } = useCreateOrder()
  const { data: meData } = useMe()
  const creditLimit = meData?.personalProfile?.creditLimit

  useEffect(() => {
    if (!tenure) return
    setCalcResult(null)
    calculate(
      { tenure: parseInt(tenure), deviceId: device.id, quantity: 1 },
      {
        onSuccess: (res) => setCalcResult(res),
        onError: (err: any) => {
          setCalcResult(null)
          toast.error({
            title: 'Could not calculate order',
            description: err?.message ?? 'Please try a different tenure.',
          })
        },
      },
    )
  }, [tenure, device.id])

  const rawPrice = device.priceKobo / 100
  const deposit = rawPrice * 0.1
  const tenureMonths = parseInt(tenure) || 0

  const displayPrice = calcResult ? calcResult.unitPriceKobo / 100 : rawPrice
  const displayTotal = calcResult ? calcResult.totalRepayableKobo / 100 : null
  const displayMonthly = calcResult ? calcResult.monthlyPaymentKobo / 100 : null
  const displayInterest = calcResult ? calcResult.interestRateBps / 100 : null
  const displayFirstPayment = calcResult?.firstPaymentDate ?? null

  const handleConfirm = async () => {
    if (!tenure || !deliveryAddress.trim()) return
    try {
      const order = await createOrder({
        tenure: parseInt(tenure),
        deviceId: device.id,
        quantity: 1,
        deliveryAddress: deliveryAddress.trim(),
      })
      onConfirm(order)
    } catch (err: any) {
      toast.error({
        title: 'Order failed',
        description: err?.message ?? 'Something went wrong, please try again.',
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Order Summary
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
          >
            <CircleX className="text-black cursor-pointer" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-white">
        <div className="bg-background rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-[14px] text-dark font-semibold mb-1">
            Selected item
          </p>
          <p className="text-[20px] font-semibold text-dark">{device.name}</p>
        </div>

        <div className="bg-background rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-[16px] font-semibold text-black mb-1">
            Equity contribution required
          </p>
          <p className="text-[14px] text-black leading-relaxed mb-4">
            To access your credit limit, a refundable deposit of 10% is required
            upfront. This will be returned once your repayments begin.
          </p>
          <p className="text-xs font-medium text-gray-700 mb-1.5">
            Tenure (months) <span className="text-red-500">*</span>
          </p>
          <Select value={tenure} onValueChange={onTenureChange}>
            <SelectTrigger className="w-full h-11! rounded-xl border border-gray-200 bg-white text-sm mb-4">
              <SelectValue placeholder="Select tenure" />
            </SelectTrigger>
            <SelectContent>
              {/*{['3', '6', '12', '18', '24', '36'].map((m) => (
                <SelectItem key={m} value={m}>
                  {m} months
                </SelectItem>
              ))}*/}

              {['6', '12'].map((m) => (
                <SelectItem key={m} value={m}>
                  {m} months
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="bg-white  px-5 py-4 space-y-3 rounded-2xl">
            <p className="text-[14px] text-dark mb-1">Deposit amount (10%)</p>
            <p className="text-[32px] font-bold text-dark">
              ₦{deposit.toLocaleString()}.00
            </p>
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-[16px] font-semibold text-black mb-3">
            Delivery address
          </p>
          <textarea
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            placeholder="Enter your delivery address"
            rows={2}
            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="bg-white  px-5 py-4 space-y-3">
          {isCalculating ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-primary" size={20} />
            </div>
          ) : (
            [
              {
                label: 'Item Price',
                value: `₦${displayPrice.toLocaleString()}.00`,
              },
              {
                label: 'Repayment tenure',
                value: tenureMonths ? `${tenureMonths} months` : '—',
              },
              {
                label: 'Interest rate',
                value: displayInterest !== null ? `${displayInterest}%` : '—',
              },
              {
                label: 'Monthly payment',
                value:
                  displayMonthly !== null
                    ? `₦${displayMonthly.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                    : '—',
              },
              ...(displayFirstPayment
                ? [
                    {
                      label: 'First payment date',
                      value: new Date(displayFirstPayment).toLocaleDateString(
                        'en-NG',
                        { dateStyle: 'medium' },
                      ),
                    },
                  ]
                : []),
              {
                label: 'Total repayable',
                value:
                  displayTotal !== null
                    ? `₦${displayTotal.toLocaleString()}.00`
                    : '—',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <span className="text-[14px] text-black">{row.label}</span>
                <span className="text-[16px] text-[#151D0C] font-semibold">
                  {row.value}
                </span>
              </div>
            ))
          )}
        </div>

        {/*<div className="bg-background rounded-2xl border border-gray-100 px-5 py-4">
          <p className="text-[16px] font-semibold text-black mb-3">
            Deposit account details
          </p>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className="text-[14px] text-black">Bank name</span>
              <span className="text-[16px] text-[#151D0C] font-semibold">
                Providus Bank
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[14px] text-black">Account name</span>
              <span className="text-[16px] text-[#151D0C] font-semibold">
                AIKI Escrow Ltd
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-black">Account number</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[16px] text-[#151D0C] font-semibold">
                  {ACCOUNT_NUMBER}
                </span>
                <CopyButton text={ACCOUNT_NUMBER} />
              </div>
            </div>
          </div>
        </div>*/}

        <div className="bg-white rounded-2xl px-5 py-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => onAgreeChange(e.target.checked)}
              className="mt-0.5 accent-primary"
            />
            <p className="text-[13px] text-black">
              I have made the ₦{deposit.toLocaleString()} deposit and agree to
              the{' '}
              <a href="#" className="text-primary">
                terms of this offer.
              </a>
            </p>
          </label>
        </div>
      </div>

      <div className="bg-white px-6 py-4 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0">
        <div className="bg-white rounded-2xl px-5 py-4">
          <p className="text-[14px] font-semibold text-black">
            Available credit
          </p>
          <p className="text-[24px] font-semibold text-black">
            {creditLimit ? fmtNGN(creditLimit.availableLimitKobo) : '—'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            className="rounded-full px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={
              !agreed || !tenure || !deliveryAddress.trim() || isCreating
            }
            className="rounded-full px-6"
          >
            {isCreating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={14} />
                Placing order…
              </>
            ) : (
              'Confirm order'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
