import FormInput from '#/components/ui/form/form-input'
import { FileUpload } from '#/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'

interface Props {
  form: any
  totalSteps: number
}

export function GuarantorDirectorSignatory({ form, totalSteps }: Props) {
  return (
    <>
      <SectionHeader
        title="Guarantor / Director Signatory"
        step={2}
        total={totalSteps}
      />
      <FormInput
        form={form}
        name="directorFullName"
        label="Director full name"
        placeholder="e.g. John Doe"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="directorBVN"
        label="Director's BVN"
        placeholder="12345678901"
        validator={{}}
        required
      />
      <FormInput
        form={form}
        name="directorIncome"
        label="Director personal income (net worth)"
        placeholder="₦0.00"
        type="number"
        validator={{}}
        required
      />
      <FileUpload label="Director government-issued ID" />
      <FileUpload label="Board resolution / authorisation" />
      <FileUpload label="Director personal bank statement" required={false} />
    </>
  )
}
