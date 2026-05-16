import { Button } from '@/components/ui/button'
import FormInput from '@/components/ui/form/form-input'
import FormDatePicker from '@/components/ui/form/form-date-picker'
import { KYCVerificationSheet } from '@/components/kyc-verification/kyc-verification'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LogOut, ShieldCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLogout, useAuthStore, useMe } from '@/stores/auth'
import { useKycStatus } from '@/stores/kyc'
import type { PersonalStep0, PersonalStep1 } from '@/stores/kyc/types'
import { toast } from '@/lib/toast'

export const Route = createFileRoute('/_authenticated/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const [editingPersonal, setEditingPersonal] = useState(false)
  const [editingEmployment, setEditingEmployment] = useState(false)
  const [kycOpen, setKycOpen] = useState(false)
  const navigate = useNavigate()
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout()

  const user = useAuthStore((s) => s.user)
  const { data: kycData } = useKycStatus({ silent: true })
  const submission = kycData?.submission
  const step0 = submission?.stepData['0'] as PersonalStep0 | undefined
  const step1 = submission?.stepData['1'] as PersonalStep1 | undefined

  const personalForm = useForm({
    defaultValues: {
      fullName: '',
      bvn: '',
      dob: '',
      address: '',
      phone: '',
      email: '',
      alternateContact: '',
    },
    onSubmit: async ({ value }) => {
      console.log('personal', value)
      setEditingPersonal(false)
    },
  })

  const employmentForm = useForm({
    defaultValues: {
      employerName: '',
      employerAddress: '',
      monthsInRole: '',
      grossSalary: '',
      netSalary: '',
      hrContact: '',
    },
    onSubmit: async ({ value }) => {
      console.log('employment', value)
      setEditingEmployment(false)
    },
  })

  useEffect(() => {
    if (!user) return
    personalForm.setFieldValue(
      'fullName',
      `${user.firstName} ${user.lastName}`.trim(),
    )
    personalForm.setFieldValue('email', user.email)
    if (user.phone) personalForm.setFieldValue('phone', user.phone)
  }, [user])

  useEffect(() => {
    if (!step0) return
    if (step0.bvn) personalForm.setFieldValue('bvn', step0.bvn)
    if (step0.dateOfBirth) {
      const dob = step0.dateOfBirth.includes('T')
        ? step0.dateOfBirth.split('T')[0]
        : step0.dateOfBirth
      personalForm.setFieldValue('dob', dob)
    }
    if (step0.residentialAddress)
      personalForm.setFieldValue('address', step0.residentialAddress)
    if (step0.alternatePhone)
      personalForm.setFieldValue('alternateContact', step0.alternatePhone)
  }, [step0])

  useEffect(() => {
    if (!step1) return
    if (step1.employerName)
      employmentForm.setFieldValue('employerName', step1.employerName)
    if (step1.employerAddress)
      employmentForm.setFieldValue('employerAddress', step1.employerAddress)
    if (step1.monthsInRole)
      employmentForm.setFieldValue('monthsInRole', String(step1.monthsInRole))
    if (step1.grossMonthlySalary)
      employmentForm.setFieldValue(
        'grossSalary',
        String(step1.grossMonthlySalary),
      )
    if (step1.netMonthlySalary)
      employmentForm.setFieldValue('netSalary', String(step1.netMonthlySalary))
    if (step1.hrContactPhone)
      employmentForm.setFieldValue('hrContact', step1.hrContactPhone)
  }, [step1])

  const { data: meData } = useMe()
  const creditLimit = meData?.personalProfile?.creditLimit

  const fmtNGN = (kobo: number) =>
    new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(kobo / 100)

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : ''
  const kycVerified =
    kycData?.status === 'VERIFIED' || kycData?.status === 'APPROVED'

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <KYCVerificationSheet open={kycOpen} onOpenChange={setKycOpen} />
      <main className="wrapper-sm py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[23px] md:text-[32px] font-semibold text-dark mb-4">
            Profile
          </h1>
          <div className="flex items-center gap-2">
            {!kycVerified && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setKycOpen(true)}
                className="gap-1.5"
              >
                <ShieldCheck size={14} />
                Verify Identity (KYC)
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                await logout()
                toast.success({ title: 'Logged out successfully' })
                navigate({ to: '/auth/login', replace: true })
              }}
              disabled={isLoggingOut}
              className="gap-1.5"
            >
              <LogOut size={14} />
              {isLoggingOut ? 'Logging out…' : 'Log Out'}
            </Button>
            {/*<Button
              onClick={() => {
                personalForm.handleSubmit()
                employmentForm.handleSubmit()
              }}
            >
              Save Changes
            </Button>*/}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="col-span-3 md:col-span-1 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src="https://www.svgrepo.com/show/452030/avatar-default.svg"
                  className="h-15 w-15 rounded-full"
                />
              </div>
              <p className="text-base font-semibold text-gray-900">
                {displayName}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
              <div className="flex items-center justify-center gap-2 mt-5">
                <Button variant="ghost" size="sm" className="px-4 rounded-full">
                  Upload Photo
                </Button>
                {/*<Button variant="ghost" size="sm" className="text-gray-400">
                  Remove photo
                </Button>*/}
              </div>
            </div>

            {creditLimit && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-[14px] font-semibold text-dark mb-4">
                  Credit Limit
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Total</span>
                    <span className="text-xs font-semibold text-gray-800">
                      {fmtNGN(creditLimit.totalLimitKobo)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Used</span>
                    <span className="text-xs font-semibold text-gray-800">
                      {fmtNGN(creditLimit.usedLimitKobo)}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min((creditLimit.usedLimitKobo / creditLimit.totalLimitKobo) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Available</span>
                    <span className="text-xs font-bold text-primary">
                      {fmtNGN(creditLimit.availableLimitKobo)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-3 flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-dark">
                  Personal Details
                </h2>
                {/*<Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEditingPersonal((v) => !v)}
                >
                  {editingPersonal ? 'Done' : 'Edit'}
                </Button>*/}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <FormInput
                  form={personalForm}
                  name="fullName"
                  label="Full legal name"
                  placeholder="e.g. Amaka Johnson"
                  validator={{}}
                  disabled={!editingPersonal}
                />
                <FormInput
                  form={personalForm}
                  name="bvn"
                  label="BVN"
                  placeholder="22222222222"
                  validator={{}}
                  disabled={!editingPersonal}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormDatePicker
                    form={personalForm}
                    name="dob"
                    label="Date of birth"
                    placeholder="Pick date of birth"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                  <FormInput
                    form={personalForm}
                    name="address"
                    label="Residential address"
                    placeholder="e.g. 15, Sterling Street, Lagos"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={personalForm}
                    name="phone"
                    label="Phone number"
                    placeholder="+234 812 345 6789"
                    type="tel"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                  <FormInput
                    form={personalForm}
                    name="email"
                    label="Email address"
                    placeholder="you@example.com"
                    type="email"
                    validator={{}}
                    disabled={!editingPersonal}
                  />
                </div>
                <FormInput
                  form={personalForm}
                  name="alternateContact"
                  label="Alternate contact (optional)"
                  placeholder="+234 812 345 6789"
                  type="tel"
                  validator={{}}
                  disabled={!editingPersonal}
                />
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-semibold text-dark">
                  Employment Details
                </h2>
                {/*<Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => setEditingEmployment((v) => !v)}
                >
                  {editingEmployment ? 'Done' : 'Edit'}
                </Button>*/}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <FormInput
                  form={employmentForm}
                  name="employerName"
                  label="Employer name"
                  placeholder="e.g. Trevo Alliance"
                  validator={{}}
                  disabled={!editingEmployment}
                />
                <FormInput
                  form={employmentForm}
                  name="employerAddress"
                  label="Employer address"
                  placeholder="e.g. 246B, Cole Street, Victoria Island, Lagos"
                  validator={{}}
                  disabled={!editingEmployment}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={employmentForm}
                    name="monthsInRole"
                    label="Months in current role"
                    placeholder="e.g. 12"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                  <FormInput
                    form={employmentForm}
                    name="grossSalary"
                    label="Gross monthly salary"
                    placeholder="e.g. 500000"
                    type="number"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    form={employmentForm}
                    name="netSalary"
                    label="Net monthly salary"
                    placeholder="e.g. 400000"
                    type="number"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                  <FormInput
                    form={employmentForm}
                    name="hrContact"
                    label="HR / line manager contact"
                    placeholder="+234 812 346 6789"
                    type="tel"
                    validator={{}}
                    disabled={!editingEmployment}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
