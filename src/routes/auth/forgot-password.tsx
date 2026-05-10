import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { validators } from '@/helpers/validators'
import { useForgotPassword } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'

export const Route = createFileRoute('/auth/forgot-password')({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword()

  const form = useForm({
    defaultValues: { email: '' },
    onSubmit: async ({ value }) => {
      const [_, error] = await safeAsync(() => forgotPassword({ email: value.email }))

      if (error) {
        toast.error({
          title: 'Request failed',
          description: error?.message ?? 'Something went wrong, please try again.',
        })
        return
      }

      toast.success({
        title: 'Check your inbox',
        description: 'A password reset link has been sent to your email.',
      })

      navigate({ to: '/auth/login' })
    },
  })

  return (
    <AuthWrapper>
      <AuthTitle
        title="Forgot your password?"
        description="Enter your email and we'll send you a reset link"
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

        <form.Subscribe selector={(s) => s.values}>
          {(values) => (
            <Button
              type="submit"
              disabled={!values.email || isPending}
              className="w-full mt-1"
            >
              {isPending ? 'Sending…' : 'Send Reset Link'}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <Link to="/auth/login" className="text-sm text-gray-500 underline mt-5">
        Back to login
      </Link>
    </AuthWrapper>
  )
}
