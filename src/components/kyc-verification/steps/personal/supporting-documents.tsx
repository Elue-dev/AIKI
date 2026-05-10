import { FileUpload } from '@/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'

interface Props {
  totalSteps: number
  files: Record<string, File | null>
  onFileChange: (type: string, file: File | null) => void
  uploadingTypes: string[]
}

const PERSONAL_DOCS: { type: string; label: string; description?: string; required?: boolean }[] = [
  { type: 'payslip', label: '3 months payslips', description: 'Most recent, stamped by employer' },
  { type: 'bank_statement', label: '6 months bank statement', description: 'Official PDF from bank with salary inflows visible' },
  { type: 'government_id', label: 'Valid government ID', description: 'NIN slip, international passport, or driver\'s licence' },
  { type: 'proof_of_address', label: 'Proof of address', description: 'Utility bill or bank statement showing address (3 months+)' },
  { type: 'employment_letter', label: 'Employment confirmation letter', required: false },
  { type: 'crc_consent', label: 'CRC / CreditRegistry consent', description: 'Signed consent for bureau pull', required: false },
]

export function SupportingDocuments({ totalSteps, files, onFileChange, uploadingTypes }: Props) {
  return (
    <>
      <SectionHeader title="Supporting Documents" step={4} total={totalSteps} />
      {PERSONAL_DOCS.map(({ type, label, description, required }) => (
        <FileUpload
          key={type}
          label={label}
          description={description}
          required={required}
          value={files[type]}
          onChange={(file) => onFileChange(type, file)}
          uploading={uploadingTypes.includes(type)}
        />
      ))}
    </>
  )
}
