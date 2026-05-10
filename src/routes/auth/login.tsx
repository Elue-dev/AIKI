import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Mail, Lock } from 'lucide-react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { validators } from '@/helpers/validators'
import { useLogin } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const { mutateAsync: login, isPending } = useLogin()

  const form = useForm({
    defaultValues: { email: '', password: '' },
    onSubmit: async ({ value }) => {
      const [_, error] = await safeAsync(() =>
        login({ email: value.email, password: value.password }),
      )

      if (error) {
        toast.error({
          title: 'Login failed',
          description: error?.message ?? 'Something went wrong, please try again.',
        })
        return
      }

      navigate({ to: '/' })
    },
  })

  return (
    <AuthWrapper>
      <AuthTitle
        title="Welcome back"
        description="Log in to continue managing your workflows"
      />

      <form
        className="w-full"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
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
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          validator={validators.password}
          leftIcon={<Lock size={16} />}
          required
        />

        <form.Subscribe selector={(s) => s.values}>
          {(values) => (
            <Button
              type="submit"
              disabled={!values.email || !values.password || isPending}
              className="w-full mt-1"
            >
              {isPending ? 'Logging in…' : 'Log In'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <Link to="/auth/forgot-password" className="text-[14px] text-gray-500 underline mt-5">
        Forgot password?
      </Link>

      <p className="text-sm text-gray-500 mt-4">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary font-medium underline">
          Sign up
        </Link>
      </p>
    </AuthWrapper>
  )
}
