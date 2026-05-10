import FormInput from '@/components/ui/form/form-input'
import { SectionHeader } from '../../common/section-header'

interface Props {
  form: any
  totalSteps: number
}

export function OperationsAndContracts({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader
        title="Operations & Contracts"
        step={1}
        total={totalSteps}
      />
      <FormInput
        form={form}
        name="numEmployees"
        label="Number of employees"
        placeholder="e.g. 50"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="revenueSource"
        label="Primary revenue source"
        placeholder="Contract sales, retainers..."
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="keyClientContracts"
        label="Key client contracts"
        placeholder="Client name / contract value"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="intendedUse"
        label="Intended use of finance / asset"
        placeholder="Describe what the loan will be used for"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="tradeReferences"
        label="Trade references"
        placeholder="Company name and contact"
        validator={{}}
      />
    </>
  )
}
