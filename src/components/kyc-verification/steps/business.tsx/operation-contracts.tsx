import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '../../common/section-header'
import { validators } from '@/helpers/validators'
import type { TradeRef } from '@/components/kyc-verification/kyc-verification'

interface StandaloneInputProps {
  label: string
  placeholder?: string
  type?: string
  value: string
  error?: boolean
  onChange: (v: string) => void
  onBlur: () => void
}

function StandaloneInput({ label, placeholder, type = 'text', value, error, onChange, onBlur }: StandaloneInputProps) {
  return (
    <div className="mb-4">
      <label className="block text-[14px] text-black mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          'w-full px-3.5 py-2.5 h-11 rounded-xl border bg-white text-sm text-gray-900 placeholder:text-[#9D9D9D] outline-none focus:ring-2 transition-all',
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/10'
            : 'border-gray-200 focus:border-primary focus:ring-primary/10',
        )}
      />
      {error && <span className="text-red-500 text-xs mt-1 block">This field is required</span>}
    </div>
  )
}

interface Props {
  form: any
  totalSteps: number
  tradeRefs: TradeRef[]
  onTradeRefsChange: (refs: TradeRef[]) => void
}

export function OperationsAndContracts({ form, totalSteps, tradeRefs, onTradeRefsChange }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const lastRef = tradeRefs[tradeRefs.length - 1]
  const lastIsEmpty = !lastRef?.name.trim() || !lastRef?.phone.trim()

  const addRef = () => {
    if (lastIsEmpty) {
      const i = tradeRefs.length - 1
      setTouched((t) => ({ ...t, [`${i}-name`]: true, [`${i}-phone`]: true }))
      return
    }
    onTradeRefsChange([...tradeRefs, { name: '', phone: '' }])
  }

  const removeRef = (i: number) => {
    onTradeRefsChange(tradeRefs.filter((_, idx) => idx !== i))
    setTouched((t) => {
      const next = { ...t }
      delete next[`${i}-name`]
      delete next[`${i}-phone`]
      return next
    })
  }

  const updateRef = (i: number, field: keyof TradeRef, value: string) =>
    onTradeRefsChange(tradeRefs.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))

  const markTouched = (i: number, field: 'name' | 'phone') =>
    setTouched((t) => ({ ...t, [`${i}-${field}`]: true }))

  return (
    <>
      <SectionHeader title="Operations & Contracts" step={1} total={totalSteps} />
      <FormInput
        form={form}
        name="numberOfEmployees"
        label="Number of employees"
        placeholder="50"
        type="number"
        validator={validators.required('Number of employees')}
        required
      />
      <FormInput
        form={form}
        name="primaryRevenueSource"
        label="Primary revenue source"
        placeholder="Contract sales, SaaS subscriptions..."
        validator={validators.required('Primary revenue source')}
        required
      />
      <FormInput
        form={form}
        name="keyClientContracts"
        label="Key client contracts"
        placeholder="Client name / contract value"
        validator={validators.required('Key client contracts')}
        required
      />
      <FormInput
        form={form}
        name="intendedUseOfFinance"
        label="Intended use of finance / asset"
        placeholder="Describe what the loan will be used for"
        validator={validators.required('Intended use')}
        required
      />

      <div>
        <p className="text-[14px] text-black mb-3">Trade References</p>
        {tradeRefs.map((ref, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1 grid grid-cols-2 gap-3">
              <StandaloneInput
                label="Name"
                placeholder="Vendor name"
                value={ref.name}
                error={touched[`${i}-name`] && !ref.name.trim()}
                onChange={(v) => updateRef(i, 'name', v)}
                onBlur={() => markTouched(i, 'name')}
              />
              <StandaloneInput
                label="Phone"
                placeholder="+2348011111111"
                type="tel"
                value={ref.phone}
                error={touched[`${i}-phone`] && !ref.phone.trim()}
                onChange={(v) => updateRef(i, 'phone', v)}
                onBlur={() => markTouched(i, 'phone')}
              />
            </div>
            {tradeRefs.length > 1 && (
              <button
                type="button"
                onClick={() => removeRef(i)}
                className="mt-8 p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                aria-label="Remove reference"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRef}
          className="flex items-center gap-1.5 text-xs mb-4"
        >
          <Plus size={13} />
          Add reference
        </Button>
      </div>
    </>
  )
}
