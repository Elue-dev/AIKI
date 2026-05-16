import FormInput from '@/components/ui/form/form-input'
import { FileUpload } from '@/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'
import { validators } from '@/helpers/validators'

interface Props {
  form: any
  totalSteps: number
  uploadedDocs: Record<string, { name: string } | null>
  onUpload: (type: string, file: File) => Promise<void>
  onRemove: (type: string) => void
  disabled?: boolean
}

const DIRECTOR_DOCS: { type: string; label: string; required?: boolean }[] = [
  { type: 'DIRECTOR_ID', label: 'Director government-issued ID' },
  { type: 'BOARD_RESOLUTION', label: 'Board resolution / authorisation' },
  { type: 'DIRECTOR_BANK_STATEMENT', label: 'Director personal bank statement', required: false },
]

export function GuarantorDirectorSignatory({ form, totalSteps, uploadedDocs, onUpload, onRemove, disabled }: Props) {
  return (
    <>
      <SectionHeader title="Guarantor / Director Signatory" step={2} total={totalSteps} />
      <FormInput
        form={form}
        name="directorFullName"
        label="Director full name"
        placeholder="e.g. John Adeyemi"
        validator={validators.required('Director full name')}
        required
      />
      <FormInput
        form={form}
        name="directorBvn"
        label="Director's BVN"
        placeholder="22345678901"
        validator={validators.required("Director's BVN")}
        required
      />
      <FormInput
        form={form}
        name="directorNetWorth"
        label="Director net worth"
        placeholder="50000000"
        type="number"
        validator={validators.required('Director net worth')}
        required
      />
      {DIRECTOR_DOCS.map(({ type, label, required }) => (
        <FileUpload
          key={type}
          label={label}
          required={required}
          uploadedFile={uploadedDocs[type]}
          onUpload={(file) => onUpload(type, file)}
          onRemove={() => onRemove(type)}
          disabled={disabled}
        />
      ))}
    </>
  )
}
