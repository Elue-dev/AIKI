export interface KycStatus {
  id: string
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
  currentStep?: number
  documents?: KycDocument[]
}

export interface KycDocument {
  id: string
  type: string
  url: string
  createdAt: string
}

export type KycDocumentType =
  | 'payslip'
  | 'bank_statement'
  | 'government_id'
  | 'proof_of_address'
  | 'employment_letter'
  | 'crc_consent'
  | 'director_id'
  | 'board_resolution'
  | 'director_bank_statement'
