import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Vendor } from '@/data/vendors'
import { Check, CircleX, Copy } from 'lucide-react'
import { useState } from 'react'

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
  vendor: Vendor
  tenure: string
  onTenureChange: (v: string) => void
  agreed: boolean
  onAgreeChange: (v: boolean) => void
  onConfirm: () => void
  onCancel: () => void
}

export function SummaryScreen({
  vendor,
  tenure,
  onTenureChange,
  agreed,
  onAgreeChange,
  onConfirm,
  onCancel,
}: SummaryScreenProps) {
  const rawPrice = parseFloat(
    vendor.price.replace('₦', '').replace('K', '000').replace(',', ''),
  )
  const deposit = rawPrice * 0.1
  const tenureMonths = parseInt(tenure) || 12
  const interestRate = tenureMonths <= 6 ? 0 : 0.05
  const total = rawPrice + rawPrice * interestRate

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
          <p className="text-[20px] font-semibold text-dark">{vendor.name}</p>
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
              {['3', '6', '12', '18', '24', '36'].map((m) => (
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

        <div className="bg-white  px-5 py-4 space-y-3">
          {[
            { label: 'Item Price', value: `₦${rawPrice.toLocaleString()}.00` },
            { label: 'Repayment tenure', value: `${tenureMonths} months` },
            {
              label: `Interest for first ${tenureMonths} months`,
              value: interestRate === 0 ? '0%' : `${interestRate * 100}%`,
            },
            {
              label: 'Total',
              value: `₦${total.toLocaleString()}.00`,
            },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[14px] text-black">{row.label}</span>
              <span className="text-[16px] text-[#151D0C] font-semibold">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-2xl border border-gray-100 px-5 py-4">
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
        </div>

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
          <p className="text-[14px] font-semibold text-black">Credit limit</p>
          <p className="text-[24px] font-semibold text-black">₦5,000,000.00</p>
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
            onClick={onConfirm}
            disabled={!agreed || !tenure}
            className="rounded-full px-6"
          >
            Confirm order
          </Button>
        </div>
      </div>
    </div>
  )
}
