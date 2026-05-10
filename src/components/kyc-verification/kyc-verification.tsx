import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'
import { toast } from '@/lib/toast'
import { useStartKyc, useSubmitKyc, useSubmitKycStep, useUploadKycDocument } from '@/stores/kyc'
import { useForm } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { AppSheet } from '../ui/app-sheet'
import { TypeToggle, type AssessmentType } from './common/type-toggle'
import { GuarantorDirectorSignatory } from './steps/business.tsx/gurantor-director-signatory'
import { OperationsAndContracts } from './steps/business.tsx/operation-contracts'
import { BasicDetails } from './steps/personal/basic-details'
import { EmploymentDetails } from './steps/personal/employment-details'
import { FinancialObligations } from './steps/personal/financial-obligations'
import { SupportingDocuments } from './steps/personal/supporting-documents'

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
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Personal')
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [isSubmittingStep, setIsSubmittingStep] = useState(false)
  const [files, setFiles] = useState<Record<string, File | null>>({})
  const [uploadingTypes, setUploadingTypes] = useState<string[]>([])

  const { mutateAsync: startKyc } = useStartKyc()
  const { mutateAsync: submitKycStep } = useSubmitKycStep()
  const { mutateAsync: uploadDocument } = useUploadKycDocument()
  const { mutateAsync: submitKyc } = useSubmitKyc()

  const totalSteps = TOTAL_STEPS[assessmentType]
  const isLastStep = step === totalSteps

  const form = useForm({
    defaultValues: {
      // Personal — Basic Details
      fullName: '',
      bvn: '',
      dob: '',
      address: '',
      phone: '',
      email: '',
      alternateContact: '',
      // Personal — Employment
      employerName: '',
      employerAddress: '',
      employmentType: '',
      monthsInRole: '',
      grossSalary: '',
      netSalary: '',
      salaryChannel: '',
      hrContact: '',
      // Personal — Financial
      monthlyRent: '',
      existingLoans: '',
      dependants: '',
      otherObligations: '',
      bankName: '',
      accountNumber: '',
      // Business — Operations
      numEmployees: '',
      revenueSource: '',
      keyClientContracts: '',
      intendedUse: '',
      tradeReferences: '',
      // Business — Director
      directorFullName: '',
      directorBVN: '',
      directorIncome: '',
    },
    onSubmit: async () => {},
  })

  useEffect(() => {
    if (open) {
      startKyc(assessmentType === 'Personal' ? 'PERSONAL' : 'BUSINESS').catch(() => {})
    }
  }, [open])

  const handleFileChange = (type: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [type]: file }))
  }

  const uploadFiles = async (types: string[]) => {
    for (const type of types) {
      const file = files[type]
      if (!file) continue
      setUploadingTypes((prev) => [...prev, type])
      try {
        await uploadDocument({ file, type })
      } finally {
        setUploadingTypes((prev) => prev.filter((t) => t !== type))
      }
    }
  }

  const advance = () => {
    setDirection(1)
    setStep((s) => s + 1)
  }

  const handleNext = async () => {
    setIsSubmittingStep(true)
    try {
      const v = form.state.values

      if (assessmentType === 'Personal') {
        if (step === 1) {
          await submitKycStep({
            stepNumber: 1,
            data: {
              fullName: v.fullName,
              bvn: v.bvn,
              dob: v.dob,
              address: v.address,
              phone: v.phone,
              email: v.email,
              alternateContact: v.alternateContact,
            },
          })
          advance()
        } else if (step === 2) {
          await submitKycStep({
            stepNumber: 2,
            data: {
              employerName: v.employerName,
              employerAddress: v.employerAddress,
              employmentType: v.employmentType,
              monthsInRole: v.monthsInRole,
              grossSalary: v.grossSalary,
              netSalary: v.netSalary,
              salaryChannel: v.salaryChannel,
              hrContact: v.hrContact,
            },
          })
          advance()
        } else if (step === 3) {
          await submitKycStep({
            stepNumber: 3,
            data: {
              monthlyRent: v.monthlyRent,
              existingLoans: v.existingLoans,
              dependants: v.dependants,
              otherObligations: v.otherObligations,
              bankName: v.bankName,
              accountNumber: v.accountNumber,
            },
          })
          advance()
        } else if (step === 4) {
          await uploadFiles([
            'payslip',
            'bank_statement',
            'government_id',
            'proof_of_address',
            'employment_letter',
            'crc_consent',
          ])
          await submitKyc()
          toast.success({
            title: 'Submission successful!',
            description: "Your KYC is under review. We'll notify you shortly.",
          })
          handleClose()
        }
      } else {
        // Business
        if (step === 1) {
          await submitKycStep({
            stepNumber: 1,
            data: {
              numEmployees: v.numEmployees,
              revenueSource: v.revenueSource,
              keyClientContracts: v.keyClientContracts,
              intendedUse: v.intendedUse,
              tradeReferences: v.tradeReferences,
            },
          })
          advance()
        } else if (step === 2) {
          await submitKycStep({
            stepNumber: 2,
            data: {
              directorFullName: v.directorFullName,
              directorBVN: v.directorBVN,
              directorIncome: v.directorIncome,
            },
          })
          await uploadFiles(['director_id', 'board_resolution', 'director_bank_statement'])
          await submitKyc()
          toast.success({
            title: 'Submission successful!',
            description: "Your KYC is under review. We'll notify you shortly.",
          })
          handleClose()
        }
      }
    } catch (err) {
      toast.error({
        title: 'Submission failed',
        description: formatApiError(err as ApiError),
      })
    } finally {
      setIsSubmittingStep(false)
    }
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(1, s - 1))
  }

  const handleTypeChange = (t: AssessmentType) => {
    setAssessmentType(t)
    setStep(1)
    setFiles({})
    startKyc(t === 'Personal' ? 'PERSONAL' : 'BUSINESS').catch(() => {})
  }

  const handleClose = () => {
    onOpenChange(false)
    setAssessmentType('Personal')
    setStep(1)
    setFiles({})
  }

  return (
    <AppSheet open={open} onClose={handleClose} width={520}>
      <div className="bg-white px-6 pt-6 pb-5 shrink-0">
        <div className="flex items-start justify-between mb-1.5">
          <h2 className="text-lg font-semibold text-gray-900">
            Identity Verification
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
          >
            <CircleX className="text-black cursor-pointer" size={20} />
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
            <div className="bg-background rounded-2xl px-5 py-5">
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
                  <SupportingDocuments
                    totalSteps={totalSteps}
                    files={files}
                    onFileChange={handleFileChange}
                    uploadingTypes={uploadingTypes}
                  />
                )}
                {assessmentType === 'Business' && step === 1 && (
                  <OperationsAndContracts form={form} totalSteps={totalSteps} />
                )}
                {assessmentType === 'Business' && step === 2 && (
                  <GuarantorDirectorSignatory
                    form={form}
                    totalSteps={totalSteps}
                    files={files}
                    onFileChange={handleFileChange}
                    uploadingTypes={uploadingTypes}
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
          onClick={step === 1 ? handleClose : handleBack}
          disabled={isSubmittingStep}
          className="px-4"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmittingStep}
          className="rounded-full px-5"
        >
          {isSubmittingStep
            ? 'Please wait…'
            : isLastStep
              ? 'Submit assessment'
              : 'Save and continue'}
        </Button>
      </div>
    </AppSheet>
  )
}
