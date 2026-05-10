import FormInput from '@/components/ui/form/form-input'
import FormSelect from '@/components/ui/form/form-select'
import { SectionHeader } from '../../common/section-header'
import { validators } from '@/helpers/validators'

interface Props {
  form: any
  totalSteps: number
}

const BANKS = [
  { label: 'Access Bank', value: 'Access Bank' },
  { label: 'First Bank', value: 'First Bank' },
  { label: 'GTBank', value: 'GTBank' },
  { label: 'Zenith Bank', value: 'Zenith Bank' },
  { label: 'UBA', value: 'UBA' },
  { label: 'Providus Bank', value: 'Providus Bank' },
  { label: 'Wema Bank', value: 'Wema Bank' },
]

export function FinancialObligations({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader title="Financial Obligations" step={3} total={totalSteps} />
      <FormInput
        form={form}
        name="monthlyRent"
        label="Monthly rent / mortgage"
        placeholder="150000"
        type="number"
        validator={validators.required('Monthly rent')}
        required
      />
      <FormInput
        form={form}
        name="existingLoanAmount"
        label="Existing loan obligations"
        placeholder="0"
        type="number"
        validator={validators.required('Existing loan amount')}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="numberOfDependants"
          label="Number of dependants"
          placeholder="2"
          type="number"
          validator={{}}
        />
        <FormInput
          form={form}
          name="otherMonthlyObligations"
          label="Other monthly obligations"
          placeholder="50000"
          type="number"
          validator={{}}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormSelect
          form={form}
          name="bankName"
          label="BVN-linked bank"
          placeholder="Select bank"
          validator={validators.required('Bank name')}
          required
          options={BANKS}
        />
        <FormInput
          form={form}
          name="bankAccountNumber"
          label="Account number"
          placeholder="0123456789"
          validator={validators.required('Account number')}
          required
        />
      </div>
    </>
  )
}
