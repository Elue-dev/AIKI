import FormInput from '@/components/ui/form/form-input'
import { SectionHeader } from '../../common/section-header'

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
        name="fullName"
        label="Full legal name"
        placeholder="e.g. John Doe"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="bvn"
        label="Bank Verification Number (BVN)"
        placeholder="12345678901"
        validator={{}}
        required
      />
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="dob"
          label="Date of birth"
          placeholder="dd/mm/yyyy"
          validator={{}}
          required
        />
        <FormInput
          form={form}
          name="address"
          label="Residential address"
          placeholder="Enter home address"
          validator={{}}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          form={form}
          name="phone"
          label="Phone number"
          placeholder="+234 812 345 6789"
          type="tel"
          validator={{}}
          required
        />
        <FormInput
          form={form}
          name="email"
          label="Email address"
          placeholder="you@email.com"
          type="email"
          validator={{}}
          required
        />
      </div>
      <FormInput
        form={form}
        name="alternateContact"
        label="Alternate contact (optional)"
        placeholder="+234 812 345 6789"
        type="tel"
        validator={{}}
      />
    </>
  )
}
