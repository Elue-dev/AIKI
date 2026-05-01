import FormInput from '@/components/ui/form/form-input'
import FormSelect from '@/components/ui/form/form-select'
import { SectionHeader } from '../../common/section-header'

interface Props {
  form: any
  totalSteps: number
}

const EMPLOYMENT_TYPES = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Self-employed', value: 'self-employed' },
]

const SALARY_CHANNELS = [
  { label: 'Bank transfer', value: 'bank-transfer' },
  { label: 'Cash', value: 'cash' },
  { label: 'Cheque', value: 'cheque' },
]

export function EmploymentDetails({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader title="Employment Details" step={2} total={totalSteps} />
      <FormInput
        form={form}
        name="employerName"
        label="Employer name"
        placeholder="Company name"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="employerAddress"
        label="Employer address"
        placeholder="Company address"
        validator={{}}
        required
      />
      <FormSelect
        form={form}
        name="employmentType"
        label="Employment type"
        placeholder="Select employment type"
        validator={{}}
        required
        options={EMPLOYMENT_TYPES}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="monthsInRole"
          label="Months in current role"
          placeholder="12 months"
          validator={{}}
          required
        />
        <FormInput
          form={form}
          name="grossSalary"
          label="Gross monthly salary"
          description="12+ months stability signal preferred"
          placeholder="500,000.00"
          type="number"
          validator={{}}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="netSalary"
          label="Net monthly salary"
          placeholder="₦50,000.00"
          type="number"
          validator={{}}
          required
        />
        <FormSelect
          form={form}
          name="salaryChannel"
          label="Salary payment channel"
          description="Before tax and deductions"
          placeholder="Bank transfer"
          validator={{}}
          required
          options={SALARY_CHANNELS}
        />
      </div>

      <FormInput
        form={form}
        name="hrContact"
        label="HR / line manager contact (optional)"
        placeholder="+234 812 346 6789"
        type="tel"
        validator={{}}
      />
    </>
  )
}
