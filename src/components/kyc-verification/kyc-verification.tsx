import { Button } from '@/components/ui/button'
import { useForm } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { AppSheet } from '../ui/app-sheet'
import { BasicDetails } from './steps/personal/basic-details'
import { EmploymentDetails } from './steps/personal/employment-details'
import { FinancialObligations } from './steps/personal/financial-obligations'
import { SupportingDocuments } from './steps/personal/supporting-documents'
import { TypeToggle, type AssessmentType } from './common/type-toggle'
import { OperationsAndContracts } from './steps/business.tsx/operation-contracts'
import { GuarantorDirectorSignatory } from './steps/business.tsx/gurantor-director-signatory'
import { toast } from '@/lib/toast'

const TOTAL_STEPS: Record<AssessmentType, number> = {
  Personal: 4,
  Business: 2,
}

interface KYCVerificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KYCVerificationSheet({
  open,
  onOpenChange,
}: KYCVerificationSheetProps) {
  const [assessmentType, setAssessmentType] =
    useState<AssessmentType>('Personal')
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)

  const totalSteps = TOTAL_STEPS[assessmentType]
  const isLastStep = step === totalSteps

  const form = useForm({
    defaultValues: {
      fullName: '',
      bvn: '',
      dob: '',
      address: '',
      phone: '',
      email: '',
      alternateContact: '',
      employerName: '',
      employerAddress: '',
      employmentType: '',
      monthsInRole: '',
      grossSalary: '',
      netSalary: '',
      salaryChannel: '',
      hrContact: '',
      monthlyRent: '',
      existingLoans: '',
      dependants: '',
      otherObligations: '',
      bankName: '',
      accountNumber: '',
      bizName: '',
      rcNumber: '',
      bizType: '',
      bizAddress: '',
      bizPhone: '',
      bizEmail: '',
      annualRevenue: '',
      guarantorName: '',
      guarantorBVN: '',
      guarantorPhone: '',
      guarantorEmail: '',
    },
    onSubmit: async ({ value }) => {
      console.log('submitted', value)
      toast.success({
        title: 'Submission successful!',
        description: 'Your account is under review',
      })
      onOpenChange(false)
    },
  })

  const handleTypeChange = (t: AssessmentType) => {
    setAssessmentType(t)
    setStep(1)
  }

  const handleNext = () => {
    if (isLastStep) {
      form.handleSubmit()
    } else {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(1, s - 1))
  }

  return (
    <AppSheet open={open} onClose={() => onOpenChange(false)} width={520}>
      <div className="bg-white px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-start justify-between mb-1.5">
          <h2 className="text-lg font-semibold text-gray-900">
            Identity Verification
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed mb-5">
          To comply with regulations, we need to verify your identity before
          proceeding. We'll collect basic personal details, a government-issued
          ID, and a selfie. Your information is encrypted and processed
          securely.
        </p>
        <TypeToggle value={assessmentType} onChange={handleTypeChange} />
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-5 py-5">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`${assessmentType}-${step}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
          >
            <div className="bg-background rounded-2xl  px-5 py-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {assessmentType === 'Personal' && step === 1 && (
                  <BasicDetails form={form} totalSteps={totalSteps} />
                )}
                {assessmentType === 'Personal' && step === 2 && (
                  <EmploymentDetails form={form} totalSteps={totalSteps} />
                )}
                {assessmentType === 'Personal' && step === 3 && (
                  <FinancialObligations form={form} totalSteps={totalSteps} />
                )}
                {assessmentType === 'Personal' && step === 4 && (
                  <SupportingDocuments totalSteps={totalSteps} />
                )}
                {assessmentType === 'Business' && step === 1 && (
                  <OperationsAndContracts form={form} totalSteps={totalSteps} />
                )}
                {assessmentType === 'Business' && step === 2 && (
                  <GuarantorDirectorSignatory
                    form={form}
                    totalSteps={totalSteps}
                  />
                )}
              </form>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
        <Button
          type="button"
          variant="outline"
          onClick={step === 1 ? () => onOpenChange(false) : handleBack}
          className="px-4"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            onClick={handleNext}
            className="rounded-full px-5"
          >
            {isLastStep ? 'Submit assessment' : 'Save and continue'}
          </Button>
        </div>
      </div>
    </AppSheet>
  )
}
