import FormInput from '@/components/ui/form/form-input'
import { SectionHeader } from '../../common/section-header'
import { validators } from '@/helpers/validators'

interface Props {
  form: any
  totalSteps: number
}

export function EmploymentDetails({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader title="Employment Details" step={2} total={totalSteps} />
      <FormInput
        form={form}
        name="employerName"
        label="Employer name"
        placeholder="Company name"
        validator={validators.required('Employer name')}
        required
      />
      <FormInput
        form={form}
        name="employerAddress"
        label="Employer address"
        placeholder="Company address"
        validator={validators.required('Employer address')}
        required
      />
      <FormInput
        form={form}
        name="monthsInRole"
        label="Months in current role"
        placeholder="24"
        type="number"
        validator={validators.required('Months in role')}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="grossMonthlySalary"
          label="Gross monthly salary"
          placeholder="500000"
          type="number"
          validator={validators.required('Gross salary')}
          required
        />
        <FormInput
          form={form}
          name="netMonthlySalary"
          label="Net monthly salary"
          placeholder="420000"
          type="number"
          validator={validators.required('Net salary')}
          required
        />
      </div>
      <FormInput
        form={form}
        name="hrContactName"
        label="HR / line manager name"
        placeholder="Jane HR"
        validator={{}}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="hrContactPhone"
          label="HR phone"
          placeholder="+234 809 876 5432"
          type="tel"
          validator={validators.phone}
        />
        <FormInput
          form={form}
          name="hrContactEmail"
          label="HR email"
          placeholder="hr@company.com"
          type="email"
          validator={{}}
        />
      </div>
    </>
  )
}
