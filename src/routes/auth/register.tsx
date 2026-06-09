import { useState, useRef } from 'react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { AnimatePresence, motion, type Transition } from 'framer-motion'
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  MapPin,
  ChevronLeft,
} from 'lucide-react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { validators } from '@/helpers/validators'
import { useRegister, useRegisterVendor } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'
import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'
import PasswordRules, {
  isPasswordValid,
} from '@/components/auth/password-rules'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

const ACCOUNT_TYPES = [
  { value: 'personal', label: 'Personal' },
  { value: 'business', label: 'Business' },
]

const SLIDE = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
}

const TRANSITION: Transition = { duration: 0.25, ease: [0.4, 0, 0.2, 1] }

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {['Personal info', 'Business info'].map((label, i) => {
        const s = i + 1
        const isActive = s === current
        const isDone = s < current
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors duration-300 ${
                  isActive
                    ? 'bg-primary text-white'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {s}
              </div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-gray-400'}`}
              >
                {label}
              </span>
            </div>
            {i < 1 && <div className="w-8 h-px bg-gray-200 mx-1" />}
          </div>
        )
      })}
    </div>
  )
}

function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const dirRef = useRef(1)
  const { mutateAsync: register, isPending: isPersonalPending } = useRegister()
  const { mutateAsync: registerVendor, isPending: isVendorPending } =
    useRegisterVendor()

  const isPending = isPersonalPending || isVendorPending

  const goTo = (next: number) => {
    dirRef.current = next > step ? 1 : -1
    setStep(next)
  }

  const form = useForm({
    defaultValues: {
      type: 'personal',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      vendorName: '',
      vendorDescription: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
    },
    onSubmit: async ({ value }) => {
      if (value.type === 'business') {
        const [_, error] = await safeAsync(() =>
          registerVendor({
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            phone: value.phone,
            password: value.password,
            vendorName: value.vendorName,
            vendorDescription: value.vendorDescription,
            contactEmail: value.contactEmail || undefined,
            contactPhone: value.contactPhone || undefined,
            address: value.address || undefined,
          }),
        )

        if (error) {
          toast.error({
            title: 'Registration Failed',
            description: formatApiError(error as ApiError),
          })
          return
        }
      } else {
        const [_, error] = await safeAsync(() =>
          register({
            type: value.type,
            firstName: value.firstName,
            lastName: value.lastName,
            email: value.email,
            phone: value.phone || undefined,
            password: value.password,
          }),
        )

        if (error) {
          toast.error({
            title: 'Registration Failed',
            description: formatApiError(error as ApiError),
          })
          return
        }
      }

      navigate({ to: '/auth/verify' })
    },
  })

  const isStep1Valid = (values: typeof form.state.values) =>
    !!values.firstName &&
    !!values.lastName &&
    !!values.email &&
    !!values.phone &&
    isPasswordValid(values.password) &&
    values.password === values.confirm_password

  const isStep2Valid = (values: typeof form.state.values) =>
    !!values.vendorName && !!values.vendorDescription

  return (
    <AuthWrapper>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step === 1 ? 'title-1' : 'title-2'}
          custom={dirRef.current}
          variants={SLIDE}
          initial="enter"
          animate="center"
          exit="exit"
          transition={TRANSITION}
        >
          <AuthTitle
            title={step === 1 ? 'Create your account' : 'Business details'}
            description={
              step === 1
                ? 'Start managing your workflows with AIKI'
                : 'Tell us about your business'
            }
          />
        </motion.div>
      </AnimatePresence>

      <form
        className="w-full overflow-hidden"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <AnimatePresence mode="wait" initial={false} custom={dirRef.current}>
          {step === 1 ? (
            <motion.div
              key="step-1"
              custom={dirRef.current}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TRANSITION}
            >
              <form.Field name="type">
                {(field) => (
                  <div className="mb-4">
                    <label className="block text-[14px] text-black mb-1.5">
                      Account type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      {ACCOUNT_TYPES.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => field.handleChange(t.value)}
                          className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                            field.state.value === t.value
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </form.Field>

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  form={form}
                  name="firstName"
                  label="First name"
                  placeholder="John"
                  validator={validators.required('First name')}
                  leftIcon={<User size={16} />}
                  required
                />
                <FormInput
                  form={form}
                  name="lastName"
                  label="Last name"
                  placeholder="Doe"
                  validator={validators.required('Last name')}
                  leftIcon={<User size={16} />}
                  required
                />
              </div>

              <FormInput
                form={form}
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                validator={validators.email}
                leftIcon={<Mail size={16} />}
                required
              />

              <FormInput
                form={form}
                name="phone"
                label="Phone number"
                type="tel"
                placeholder="+234 800 000 0000"
                validator={validators.phone}
                leftIcon={<Phone size={16} />}
                required
              />

              <FormInput
                form={form}
                name="password"
                label="Password"
                type="password"
                placeholder="Min. 8 characters"
                validator={validators.password}
                leftIcon={<Lock size={16} />}
                required
              />

              <form.Subscribe selector={(s) => s.values}>
                {({ password, confirm_password }) => (
                  <>
                    <PasswordRules
                      password={password}
                      confirmPassword={confirm_password}
                    />
                    <FormInput
                      form={form}
                      name="confirm_password"
                      label="Confirm password"
                      type="password"
                      placeholder="Re-enter your password"
                      validator={validators.confirmPassword(() => password)}
                      leftIcon={<Lock size={16} />}
                      required
                    />
                  </>
                )}
              </form.Subscribe>

              <form.Subscribe selector={(s) => s.values}>
                {(values) =>
                  values.type === 'business' ? (
                    <Button
                      type="button"
                      disabled={!isStep1Valid(values)}
                      className="w-full mt-1"
                      onClick={() => goTo(2)}
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isStep1Valid(values) || isPending}
                      className="w-full mt-1"
                    >
                      {isPending ? 'Creating account…' : 'Create Account'}
                    </Button>
                  )
                }
              </form.Subscribe>

              <p className="text-sm text-gray-500 mt-5 text-center">
                Already have an account?{' '}
                <Link
                  to="/auth/login"
                  className="text-primary font-medium underline"
                >
                  Log in
                </Link>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step-2"
              custom={dirRef.current}
              variants={SLIDE}
              initial="enter"
              animate="center"
              exit="exit"
              transition={TRANSITION}
            >
              <StepIndicator current={2} />

              <FormInput
                form={form}
                name="vendorName"
                label="Business name"
                placeholder="Acme Ltd."
                validator={validators.required('Business name')}
                leftIcon={<Building2 size={16} />}
                required
              />
              <FormInput
                form={form}
                name="vendorDescription"
                label="Business description"
                placeholder="What does your business do?"
                validator={validators.required('Business description')}
                leftIcon={<Building2 size={16} />}
                required
              />
              <FormInput
                form={form}
                name="contactEmail"
                label="Business contact email"
                type="email"
                placeholder="contact@business.com"
                leftIcon={<Mail size={16} />}
              />
              <FormInput
                form={form}
                name="contactPhone"
                label="Business contact phone"
                type="tel"
                placeholder="+234 800 000 0000"
                leftIcon={<Phone size={16} />}
              />
              <FormInput
                form={form}
                name="address"
                label="Business address"
                placeholder="123 Main Street, Lagos"
                leftIcon={<MapPin size={16} />}
              />

              <form.Subscribe selector={(s) => s.values}>
                {(values) => (
                  <Button
                    type="submit"
                    disabled={!isStep2Valid(values) || isPending}
                    className="w-full mt-1"
                  >
                    {isPending ? 'Creating account…' : 'Create Account'}
                  </Button>
                )}
              </form.Subscribe>

              <button
                type="button"
                onClick={() => goTo(1)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-3 mx-auto transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                Back to personal info
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </AuthWrapper>
  )
}
