export interface KycDocument {
  id: string
  kycSubmissionId: string
  type: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  storageKey?: string
  step: number
  uploadedAt: string
}

export interface PersonalStep0 {
  bvn: string
  dateOfBirth: string
  residentialAddress: string
  alternatePhone?: string | null
  alternateEmail?: string | null
}

export interface PersonalStep1 {
  employerName: string
  employerAddress: string
  monthsInRole: number
  grossMonthlySalary: number
  netMonthlySalary: number
  hrContactName?: string | null
  hrContactPhone?: string | null
  hrContactEmail?: string | null
}

export interface PersonalStep2 {
  monthlyRent: number
  existingLoanAmount: number
  numberOfDependants: number
  otherMonthlyObligations: number
  bankName: string
  bankAccountNumber: string
}

export interface BusinessStep0 {
  numberOfEmployees: number
  primaryRevenueSource: string
  keyClientContracts: string
  intendedUseOfFinance: string
  tradeReferences: Array<{ name: string; phone: string }>
}

export interface BusinessStep1 {
  directorFullName: string
  directorBvn: string
  directorNetWorth: number
}

export interface PersonalSteps {
  0?: PersonalStep0
  1?: PersonalStep1
  2?: PersonalStep2
}

export interface BusinessSteps {
  0?: BusinessStep0
  1?: BusinessStep1
}

/** The inner `data` object returned by GET /kyc */
export interface KycStatusResponse {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REQUIRES_MORE_INFO' | 'VERIFIED'
  submission: KycSubmission | null
}

/** The submission object */
export interface KycSubmission {
  id: string
  userId: string
  type: 'PERSONAL' | 'BUSINESS'
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'REQUIRES_MORE_INFO' | 'VERIFIED'
  currentStep: number
  totalSteps: number
  /** Step data — each key is a step index, value is the field data for that step */
  stepData: Record<string, Record<string, unknown>>
  bvnVerified: boolean
  submittedAt: string | null
  reviewedByAdminId: string | null
  reviewNote: string | null
  reviewedAt: string | null
  createdAt: string
  updatedAt: string
  documents: KycDocument[]
}

/** Standard API envelope */
export interface ApiEnvelope<T> {
  success: boolean
  data: T
}

export interface KycDocumentPayload {
  file: File
  kycSubmissionId: string
  type: KycDocumentType
  step: number
}

export type KycDocumentType =
  | 'PAYSLIP'
  | 'BANK_STATEMENT'
  | 'GOVERNMENT_ID'
  | 'PROOF_OF_ADDRESS'
  | 'EMPLOYMENT_LETTER'
  | 'CRC_CONSENT'
  | 'DIRECTOR_ID'
  | 'BOARD_RESOLUTION'
  | 'DIRECTOR_BANK_STATEMENT'
  | 'PROFILE_PHOTO'
  | 'OTHER'
