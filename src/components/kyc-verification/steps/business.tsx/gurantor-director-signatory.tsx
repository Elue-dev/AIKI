import FormInput from '@/components/ui/form/form-input'
import { FileUpload } from '@/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'

interface Props {
  form: any
  totalSteps: number
  files: Record<string, File | null>
  onFileChange: (type: string, file: File | null) => void
  uploadingTypes: string[]
}

const DIRECTOR_DOCS: { type: string; label: string; required?: boolean }[] = [
  { type: 'director_id', label: 'Director government-issued ID' },
  { type: 'board_resolution', label: 'Board resolution / authorisation' },
  { type: 'director_bank_statement', label: 'Director personal bank statement', required: false },
]

export function GuarantorDirectorSignatory({ form, totalSteps, files, onFileChange, uploadingTypes }: Props) {
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
      {DIRECTOR_DOCS.map(({ type, label, required }) => (
        <FileUpload
          key={type}
          label={label}
          required={required}
          value={files[type]}
          onChange={(file) => onFileChange(type, file)}
          uploading={uploadingTypes.includes(type)}
        />
      ))}
    </>
  )
}
