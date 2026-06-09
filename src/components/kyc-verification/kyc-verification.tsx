import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'
import { toast } from '@/lib/toast'
import {
  useStartKyc,
  useSubmitKyc,
  useSubmitKycStep,
  useRegisterKycDocument,
  useDeleteKycDocument,
  useKycStatus,
} from '@/stores/kyc'
import type { KycDocumentType } from '@/stores/kyc/types'
import { useAuthStore } from '@/stores/auth'
import { useLoaderStore } from '@/stores/loader'
import { useForm } from '@tanstack/react-form'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleX, AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { AppSheet } from '../ui/app-sheet'
import type { AssessmentType } from './common/type-toggle'
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

const REQUIRED_FIELDS: Record<string, string[]> = {
  'Personal-1': ['bvn', 'dateOfBirth', 'residentialAddress'],
  'Personal-2': [
    'employerName',
    'employerAddress',
    'monthsInRole',
    'grossMonthlySalary',
    'netMonthlySalary',
  ],
  'Personal-3': [
    'monthlyRent',
    'existingLoanAmount',
    'bankName',
    'bankAccountNumber',
  ],
  'Business-1': [
    'numberOfEmployees',
    'primaryRevenueSource',
    'keyClientContracts',
    'intendedUseOfFinance',
  ],
  'Business-2': ['directorFullName', 'directorBvn', 'directorNetWorth'],
}

const DEFAULT_VALUES = {
  bvn: '',
  dateOfBirth: '',
  residentialAddress: '',
  alternatePhone: '',
  alternateEmail: '',
  employerName: '',
  employerAddress: '',
  monthsInRole: '',
  grossMonthlySalary: '',
  netMonthlySalary: '',
  hrContactName: '',
  hrContactPhone: '',
  hrContactEmail: '',
  monthlyRent: '',
  existingLoanAmount: '',
  numberOfDependants: '',
  otherMonthlyObligations: '',
  bankName: '',
  bankAccountNumber: '',
  numberOfEmployees: '',
  primaryRevenueSource: '',
  keyClientContracts: '',
  intendedUseOfFinance: '',
  directorFullName: '',
  directorBvn: '',
  directorNetWorth: '',
}

export interface TradeRef {
  name: string
  phone: string
}

interface KYCVerificationSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KYCVerificationSheet({
  open,
  onOpenChange,
}: KYCVerificationSheetProps) {
  const user = useAuthStore((s) => s.user)
  const roleType: AssessmentType =
    user?.role === 'PERSONAL_CLIENT' ? 'Personal' : 'Business'

  const [assessmentType, setAssessmentType] =
    useState<AssessmentType>('Personal')
  const [step, setStep] = useState(1)
  const [maxReachedStep, setMaxReachedStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [kycSubmissionId, setKycSubmissionId] = useState<string | null>(null)
  const [uploadedDocs, setUploadedDocs] = useState<
    Record<string, { name: string; id: string }>
  >({})
  const [tradeRefs, setTradeRefs] = useState<TradeRef[]>([
    { name: '', phone: '' },
  ])

  const { mutateAsync: startKyc } = useStartKyc()
  const { mutateAsync: submitKycStep } = useSubmitKycStep()
  const { mutateAsync: registerDocument } = useRegisterKycDocument({
    silent: true,
  })
  const { mutateAsync: deleteDocument } = useDeleteKycDocument()
  const { mutateAsync: submitKyc } = useSubmitKyc()
  const { data: kycData, refetch: refetchKyc } = useKycStatus({ silent: true })
  const kycSubmission = kycData?.submission
  const setShowLoader = useLoaderStore((s) => s.setShowLoader)

  const totalSteps = TOTAL_STEPS[assessmentType]
  const isLastStep = step === totalSteps

  const form = useForm({
    defaultValues: DEFAULT_VALUES,
    onSubmit: async () => {},
  })

  const seededRef = useRef(false)

  useEffect(() => {
    if (!open) {
      seededRef.current = false
      setTradeRefs([{ name: '', phone: '' }])
      return
    }
    setAssessmentType(roleType)
    refetchKyc()
  }, [open])

  useEffect(() => {
    if (!open || seededRef.current || !kycSubmission) return
    seededRef.current = true

    setKycSubmissionId(kycSubmission.id)

    const type: AssessmentType =
      kycSubmission.type === 'PERSONAL' ? 'Personal' : 'Business'
    setAssessmentType(type)

    const maxStep = Math.min(kycSubmission.currentStep + 1, TOTAL_STEPS[type])
    setMaxReachedStep(maxStep)
    // Always start from step 1 — user navigates forward manually

    const steps = kycSubmission.stepData as
      | Record<string, Record<string, unknown>>
      | undefined
    if (steps) {
      for (const [, fields] of Object.entries(steps)) {
        if (!fields) continue
        for (const [key, value] of Object.entries(fields)) {
          if (value !== null && value !== undefined) {
            if (key === 'tradeReferences' && Array.isArray(value)) {
              const refs = value as Array<{ name: string; phone: string }>
              if (refs.length > 0) {
                setTradeRefs(
                  refs.map((r) => ({
                    name: r.name ?? '',
                    phone: r.phone ?? '',
                  })),
                )
              }
            } else {
              const fieldKey = key as keyof typeof DEFAULT_VALUES
              if (fieldKey in DEFAULT_VALUES) {
                let strValue = String(value)
                if (key === 'dateOfBirth' && strValue.includes('T')) {
                  strValue = strValue.split('T')[0]
                }
                form.setFieldValue(fieldKey, strValue)
              }
            }
          }
        }
      }
    }
  }, [open, kycSubmission])

  useEffect(() => {
    if (!open || !kycSubmission?.documents?.length) return
    const docsMap: Record<string, { name: string; id: string }> = {}
    for (const doc of kycSubmission.documents) {
      docsMap[doc.type] = { name: doc.fileName ?? doc.type, id: doc.id }
    }
    setUploadedDocs(docsMap)
  }, [open, kycSubmission?.documents])

  const num = (v: string) => (v === '' ? undefined : Number(v))
  const advance = () => {
    setDirection(1)
    setStep((s) => {
      const next = s + 1
      setMaxReachedStep((m) => Math.max(m, next))
      return next
    })
  }

  const validateCurrentStep = async (): Promise<boolean> => {
    const fields = REQUIRED_FIELDS[`${assessmentType}-${step}`] ?? []
    if (!fields.length) return true
    const results = await Promise.all(
      fields.map((name) =>
        form.validateField(name as keyof typeof DEFAULT_VALUES, 'submit'),
      ),
    )
    return results.every((errs) => !errs || errs.length === 0)
  }

  const uploadDoc = async (type: string, file: File, docStep: number) => {
    if (!kycSubmissionId) throw new Error('Submission not started yet')
    const res = await registerDocument({
      file,
      kycSubmissionId,
      type: type as KycDocumentType,
      step: docStep,
    })
    setUploadedDocs((prev) => ({
      ...prev,
      [type]: { name: file.name, id: res.data.id },
    }))
  }

  const removeDoc = async (type: string) => {
    const doc = uploadedDocs[type]
    if (doc?.id) {
      try {
        await deleteDocument(doc.id)
      } catch {}
    }
    setUploadedDocs((prev) => {
      const n = { ...prev }
      delete n[type]
      return n
    })
  }

  const handlePersonalDocUpload = (type: string, file: File) =>
    uploadDoc(type, file, 3)
  const handleBusinessDocUpload = (type: string, file: File) =>
    uploadDoc(type, file, 1)

  const handlePersonalNext = async () => {
    const v = form.state.values

    if (step === 1) {
      let id = kycSubmissionId
      if (!id) {
        const res = await startKyc('PERSONAL')
        id = res.data.id
        setKycSubmissionId(id)
      }
      await submitKycStep({
        stepNumber: 0,
        data: {
          bvn: v.bvn,
          dateOfBirth: v.dateOfBirth,
          residentialAddress: v.residentialAddress,
          alternatePhone: v.alternatePhone || undefined,
          alternateEmail: v.alternateEmail || undefined,
        },
      })
      return advance()
    }

    if (step === 2) {
      await submitKycStep({
        stepNumber: 1,
        data: {
          employerName: v.employerName,
          employerAddress: v.employerAddress,
          monthsInRole: num(v.monthsInRole),
          grossMonthlySalary: num(v.grossMonthlySalary),
          netMonthlySalary: num(v.netMonthlySalary),
          hrContactName: v.hrContactName || undefined,
          hrContactPhone: v.hrContactPhone || undefined,
          hrContactEmail: v.hrContactEmail || undefined,
        },
      })
      return advance()
    }

    if (step === 3) {
      await submitKycStep({
        stepNumber: 2,
        data: {
          monthlyRent: num(v.monthlyRent),
          existingLoanAmount: num(v.existingLoanAmount),
          numberOfDependants: num(v.numberOfDependants),
          otherMonthlyObligations: num(v.otherMonthlyObligations),
          bankName: v.bankName,
          bankAccountNumber: v.bankAccountNumber,
        },
      })
      return advance()
    }

    if (step === 4) {
      if (kycSubmission?.status !== 'SUBMITTED') {
        await submitKycStep({ stepNumber: 3, data: {} })
      }
      await submitKyc()
      toast.success({
        title: 'Submission successful!',
        description: "Your KYC is under review. We'll notify you shortly.",
      })
      handleClose()
    }
  }

  const handleBusinessNext = async () => {
    const v = form.state.values

    if (step === 1) {
      let id = kycSubmissionId
      if (!id) {
        const res = await startKyc('BUSINESS')
        id = res.data.id
        setKycSubmissionId(id)
      }
      const tradeReferences = tradeRefs
        .filter((r) => r.name.trim())
        .map((r) => ({ name: r.name, phone: r.phone }))
      await submitKycStep({
        stepNumber: 0,
        data: {
          numberOfEmployees: num(v.numberOfEmployees),
          primaryRevenueSource: v.primaryRevenueSource,
          keyClientContracts: v.keyClientContracts,
          intendedUseOfFinance: v.intendedUseOfFinance,
          tradeReferences,
        },
      })
      return advance()
    }

    if (step === 2) {
      if (kycSubmission?.status !== 'SUBMITTED') {
        await submitKycStep({
          stepNumber: 1,
          data: {
            directorFullName: v.directorFullName,
            directorBvn: v.directorBvn,
            directorNetWorth: num(v.directorNetWorth),
          },
        })
      }
      await submitKyc()
      toast.success({
        title: 'Submission successful!',
        description: "Your KYC is under review. We'll notify you shortly.",
      })
      handleClose()
    }
  }

  const handleNext = async () => {
    const isValid = await validateCurrentStep()
    if (!isValid) return

    setShowLoader(true)
    try {
      if (assessmentType === 'Personal') await handlePersonalNext()
      else await handleBusinessNext()
    } catch (err) {
      toast.error({
        title: 'Submission failed',
        description: formatApiError(err as ApiError),
      })
    } finally {
      setShowLoader(false)
    }
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((s) => Math.max(1, s - 1))
  }

  const handleClose = () => {
    onOpenChange(false)
    setAssessmentType(roleType)
    setStep(1)
    setMaxReachedStep(1)
    setUploadedDocs({})
  }

  const kycStatus = kycSubmission?.status
  const isUnderReview =
    kycStatus === 'SUBMITTED' && !!kycSubmission?.reviewedByAdminId
  const isApproved = kycStatus === 'APPROVED' || kycStatus === 'VERIFIED'
  const isRejected = kycStatus === 'REJECTED'
  const isSubmitted = kycStatus === 'SUBMITTED'

  const kycLocked = !!kycStatus && kycStatus !== 'IN_PROGRESS'

  const statusBanner = isUnderReview
    ? {
        icon: <AlertCircle size={16} className="shrink-0 text-amber-500" />,
        bg: 'bg-amber-50 border-amber-200',
        text: 'text-amber-800',
        message:
          'Your KYC is currently being reviewed by our team. Changes are not allowed at this time.',
      }
    : isApproved
      ? {
          icon: <CheckCircle2 size={16} className="shrink-0 text-green-500" />,
          bg: 'bg-green-50 border-green-200',
          text: 'text-green-800',
          message: 'Your KYC has been approved! No further action is needed.',
        }
      : isRejected
        ? {
            icon: <XCircle size={16} className="shrink-0 text-red-500" />,
            bg: 'bg-red-50 border-red-200',
            text: 'text-red-800',
            message: kycSubmission?.reviewNote
              ? `Your KYC was rejected: ${kycSubmission.reviewNote}. Please contact support if you need assistance.`
              : 'Your KYC was rejected. Please contact support for more information.',
          }
        : isSubmitted
          ? {
              icon: <Info size={16} className="shrink-0 text-blue-500" />,
              bg: 'bg-blue-50 border-blue-200',
              text: 'text-blue-800',
              message:
                'Your KYC has been submitted and is awaiting review. No further changes can be made.',
            }
          : null

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
        {/* Step indicator */}
        <div className="flex items-center mt-4">
          {Array.from({ length: totalSteps }, (_, i) => {
            const s = i + 1
            const isActive = s === step
            const isCompleted = s < maxReachedStep

            return (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  disabled={isActive}
                  onClick={() => {
                    setDirection(s < step ? -1 : 1)
                    setStep(s)
                  }}
                  className={[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-200 border',
                    isActive
                      ? 'bg-primary text-white border-primary cursor-default'
                      : isCompleted
                        ? 'bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 cursor-pointer'
                        : 'bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-200 cursor-pointer',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    s
                  )}
                </button>
                {s < totalSteps && (
                  <div
                    className={[
                      'flex-1 h-px mx-1.5 transition-colors duration-200',
                      s < maxReachedStep ? 'bg-primary/30' : 'bg-gray-200',
                    ].join(' ')}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-white px-5 py-5">
        {statusBanner && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 mb-4 text-sm ${statusBanner.bg}`}
          >
            {statusBanner.icon}
            <p className={statusBanner.text}>{statusBanner.message}</p>
          </div>
        )}
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
                    uploadedDocs={uploadedDocs}
                    onUpload={handlePersonalDocUpload}
                    onRemove={(type) => removeDoc(type)}
                    disabled={kycLocked}
                  />
                )}
                {assessmentType === 'Business' && step === 1 && (
                  <OperationsAndContracts
                    form={form}
                    totalSteps={totalSteps}
                    tradeRefs={tradeRefs}
                    onTradeRefsChange={setTradeRefs}
                  />
                )}
                {assessmentType === 'Business' && step === 2 && (
                  <GuarantorDirectorSignatory
                    form={form}
                    totalSteps={totalSteps}
                    uploadedDocs={uploadedDocs}
                    onUpload={handleBusinessDocUpload}
                    onRemove={(type) => removeDoc(type)}
                    disabled={kycLocked}
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
          className="px-4"
        >
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          disabled={kycLocked}
          className="rounded-full px-5"
        >
          {isApproved
            ? 'Already Approved'
            : isLastStep
              ? 'Submit KYC'
              : 'Save and continue'}
        </Button>
      </div>
    </AppSheet>
  )
}
