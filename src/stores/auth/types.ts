export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  phone?: string
  profilePhotoUrl?: string | null
  emailVerified: boolean
}

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  pendingEmail: string | null
  pendingToken: string | null
  pendingRefreshToken: string | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setAccessToken: (token: string) => void
  setUser: (user: User) => void
  setPendingEmail: (email: string) => void
  setPendingVerification: (email: string, token: string, refreshToken?: string) => void
  confirmVerified: () => void
  logout: () => void
}

export interface RegisterPayload {
  type: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  password: string
  companyName?: string
  companyEmail?: string
  companyPhone?: string
}

export interface RegisterVendorPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  vendorName: string
  vendorDescription: string
  contactEmail?: string
  contactPhone?: string
  address?: string
}

export interface RegisterResponse {
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  data: {
    user: User
    accessToken: string
    refreshToken: string
  }
}

export interface VerifyEmailPayload {
  otp: string
}

export interface VerifyEmailResponse {
  data: {
    user: User
    accessToken: string
    refreshToken?: string
  }
}

export interface RefreshResponse {
  data: {
    accessToken: string
  }
}

export interface CreditLimit {
  id: string
  personalProfileId: string | null
  businessClientId: string | null
  totalLimitKobo: number
  usedLimitKobo: number
  availableLimitKobo: number
  assignedByAdminId: string
  assignedAt: string
  lastUpdatedByAdminId: string | null
  createdAt: string
  updatedAt: string
}

export interface PersonalProfile {
  id: string
  userId: string
  bvn: string | null
  dateOfBirth: string | null
  residentialAddress: string | null
  alternatePhone: string | null
  alternateEmail: string | null
  employerName: string | null
  employerAddress: string | null
  monthsInRole: number | null
  grossMonthlySalary: number | null
  netMonthlySalary: number | null
  hrContactName: string | null
  hrContactPhone: string | null
  hrContactEmail: string | null
  monthlyRent: number | null
  existingLoanAmount: number | null
  numberOfDependants: number | null
  otherMonthlyObligations: number | null
  bankName: string | null
  bankAccountNumber: string | null
  nin: string | null
  createdAt: string
  updatedAt: string
  creditLimit: CreditLimit | null
}

export interface MeData {
  user: User
  personalProfile: PersonalProfile | null
  businessClient: Record<string, unknown> | null
  businessEmployee: Record<string, unknown> | null
  vendor: Record<string, unknown> | null
  kycStatus: string
}

export interface MeResponse {
  success: boolean
  data: MeData
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}
