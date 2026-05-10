import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Mail, Lock, User, Phone } from 'lucide-react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { validators } from '@/helpers/validators'
import { useRegister } from '@/stores/auth'
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

function RegisterPage() {
  const navigate = useNavigate()
  const { mutateAsync: register, isPending } = useRegister()

  const form = useForm({
    defaultValues: {
      type: 'personal',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirm_password) {
        toast.error({ title: 'Passwords do not match' })
        return
      }

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

      navigate({ to: '/auth/verify' })
    },
  })

  return (
    <AuthWrapper>
      <AuthTitle
        title="Create your account"
        description="Start managing your workflows with AIKI"
      />

      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
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
          {(values) => (
            <Button
              type="submit"
              disabled={
                !values.email ||
                !isPasswordValid(values.password) ||
                !values.firstName ||
                !values.lastName ||
                values.password !== values.confirm_password ||
                isPending
              }
              className="w-full mt-1"
            >
              {isPending ? 'Creating account…' : 'Create Account'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <p className="text-sm text-gray-500 mt-5">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary font-medium underline">
          Log in
        </Link>
      </p>
    </AuthWrapper>
  )
}
