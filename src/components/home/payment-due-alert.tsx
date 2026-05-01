import { Copy } from 'lucide-react'
import { WarningBanner } from '../ui/warning-banner'

interface PaymentsDueAlertProps {
  dueDate: string
  bankName: string
  accountName: string
  accountNumber: string
  onPay?: () => void
  onCopy?: () => void
}

export function PaymentsDueAlert({
  dueDate,
  bankName,
  accountName,
  accountNumber,
  onCopy,
}: PaymentsDueAlertProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-2xl shadow-sm px-5 py-4">
        <WarningBanner title="Payments Due">
          The following invoices must be settled before{' '}
          <span className="font-semibold text-gray200">{dueDate}</span> to avoid
          possible delays or complications to your repayment schedule.
        </WarningBanner>

        <div className="flex items-center justify-between gap-4 border border-[#E6E6E7] p-3 rounded-2xl mt-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-gray-900">
                {bankName}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm font-semibold text-gray-900">
                {accountName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm text-dark100 font-semibold">
                {accountNumber}
              </span>
              <button onClick={onCopy} className="text-dark100">
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
