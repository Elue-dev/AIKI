import { FileUpload } from '@/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'

interface Props {
  totalSteps: number
  uploadedDocs: Record<string, { name: string } | null>
  onUpload: (type: string, file: File) => Promise<void>
  onRemove: (type: string) => void
  disabled?: boolean
}

const PERSONAL_DOCS: { type: string; label: string; description?: string; required?: boolean }[] = [
  { type: 'PAYSLIP', label: '3 months payslips', description: 'Most recent, stamped by employer' },
  { type: 'BANK_STATEMENT', label: '6 months bank statement', description: 'Official PDF from bank with salary inflows visible' },
  { type: 'GOVERNMENT_ID', label: 'Valid government ID', description: "NIN slip, international passport, or driver's licence" },
  { type: 'PROOF_OF_ADDRESS', label: 'Proof of address', description: 'Utility bill or bank statement showing address (3 months+)' },
  { type: 'EMPLOYMENT_LETTER', label: 'Employment confirmation letter', required: false },
  { type: 'CRC_CONSENT', label: 'CRC / CreditRegistry consent', description: 'Signed consent for bureau pull', required: false },
]

export function SupportingDocuments({ totalSteps, uploadedDocs, onUpload, onRemove, disabled }: Props) {
  return (
    <>
      <SectionHeader title="Supporting Documents" step={4} total={totalSteps} />
      {PERSONAL_DOCS.map(({ type, label, description, required }) => (
        <FileUpload
          key={type}
          label={label}
          description={description}
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
