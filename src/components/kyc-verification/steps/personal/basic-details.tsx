import FormInput from '@/components/ui/form/form-input'
import FormDatePicker from '@/components/ui/form/form-date-picker'
import { SectionHeader } from '../../common/section-header'
import { validators } from '@/helpers/validators'

interface Props {
  form: any
  totalSteps: number
}

export function BasicDetails({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader title="Basic Details" step={1} total={totalSteps} />
      <FormInput
        form={form}
        name="bvn"
        label="Bank Verification Number (BVN)"
        placeholder="22345678901"
        validator={validators.required('BVN')}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <FormDatePicker
          form={form}
          name="dateOfBirth"
          label="Date of birth"
          placeholder="Pick date of birth"
          validator={validators.required('Date of birth')}
          required
        />
        <FormInput
          form={form}
          name="residentialAddress"
          label="Residential address"
          placeholder="Enter home address"
          validator={validators.required('Residential address')}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="alternatePhone"
          label="Alternate phone (optional)"
          placeholder="+234 812 345 6789"
          type="tel"
          validator={validators.phone}
        />
        <FormInput
          form={form}
          name="alternateEmail"
          label="Alternate email (optional)"
          placeholder="alt@example.com"
          type="email"
          validator={{}}
        />
      </div>
    </>
  )
}
