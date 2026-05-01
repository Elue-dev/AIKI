import { FileUpload } from '@/components/ui/form/file-upload'
import { SectionHeader } from '../../common/section-header'

interface Props {
  totalSteps: number
}

export function SupportingDocuments({ totalSteps }: Props) {
  return (
    <>
      <SectionHeader title="Supporting Documents" step={4} total={totalSteps} />
      <FileUpload
        label="3 months payslips"
        description="Most recent, stamped by employer"
      />
      <FileUpload
        label="6 months bank statement"
        description="Official PDF from bank with salary inflows visible"
      />
      <FileUpload
        label="Valid government ID"
        description="NIN slip, international passport, or driver's licence"
      />
      <FileUpload
        label="Proof of address"
        description="Utility bill or bank statement showing address (3 months+)"
      />
      <FileUpload label="Employment confirmation letter" required={false} />
      <FileUpload
        label="CRC / CreditRegistry consent"
        description="Signed consent for bureau pull"
        required={false}
      />
    </>
  )
}
