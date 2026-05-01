import FormInput from '@/components/ui/form/form-input'
import FormSelect from '@/components/ui/form/form-select'
import { SectionHeader } from '../../common/section-header'

interface Props {
  form: any
  totalSteps: number
}

const BANKS = [
  { label: 'Access Bank', value: 'access' },
  { label: 'First Bank', value: 'first-bank' },
  { label: 'GTBank', value: 'gtbank' },
  { label: 'Zenith Bank', value: 'zenith' },
  { label: 'UBA', value: 'uba' },
  { label: 'Providus Bank', value: 'providus' },
  { label: 'Wema Bank', value: 'wema' },
]

export function FinancialObligations({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader
        title="Financial Obligations"
        step={3}
        total={totalSteps}
      />
      <FormInput
        form={form}
        name="monthlyRent"
        label="Monthly rent / mortgage"
        placeholder="Enter amount"
        type="number"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="existingLoans"
        label="Existing loan obligations"
        placeholder="Enter amount"
        type="number"
        validator={{}}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="dependants"
          label="Number of financial dependants"
          placeholder="Enter number"
          type="number"
          validator={{}}
        />
        <FormInput
          form={form}
          name="otherObligations"
          label="Other monthly obligations"
          placeholder="500,000.00"
          type="number"
          validator={{}}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormSelect
          form={form}
          name="bankName"
          label="BVN-linked bank account"
          placeholder="Select bank"
          validator={{}}
          required
          options={BANKS}
        />
        <FormInput
          form={form}
          name="accountNumber"
          label="Account number"
          placeholder="0123456789"
          validator={{}}
          required
        />
      </div>
    </>
  )
}
