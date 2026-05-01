import AssessmentIcon from '@/assets/svg/assessment.svg'
import KYCIcon from '@/assets/svg/kyc.svg'
import TrackIcon from '@/assets/svg/track.svg'
import { KYCVerificationSheet } from '../kyc-verification/kyc-verification'
import { useState } from 'react'

interface QuickAction {
  icon: React.ReactNode
  label: string
  action?: VoidFunction
}

export function QuickActions() {
  const [sheetOpen, setSheetOpen] = useState(false)

  const actions: QuickAction[] = [
    {
      icon: <img src={KYCIcon} className="h-6 w-6" />,
      label: 'Complete KYC',
      action: () => setSheetOpen(true),
    },
    {
      icon: <img src={AssessmentIcon} className="h-6 w-6" />,
      label: 'Complete assessment',
      action: () => {},
    },
    {
      icon: <img src={TrackIcon} className="h-6 w-6" />,
      label: 'Credit application',
      action: () => {},
    },
  ]

  return (
    <div className="bg-gray100 rounded-2xl p-5 shadow-sm">
      <p className="text-[16px] font-semibold text-dark mb-3">Quick actions</p>
      <div className="grid grid-cols-3 gap-2">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={action.action}
            className="relative flex flex-col items-start gap-2 px-3 py-6 rounded-xl bg-white text-left overflow-visible cursor-pointer"
          >
            <div className="w-9 h-9 bg-gray100 rounded-lg flex items-center justify-center">
              {action.icon}
            </div>
            <span className="text-[14px] font-medium text-gray-700 leading-tight mt-3">
              {action.label}
            </span>
          </button>
        ))}
      </div>

      <KYCVerificationSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  )
}
