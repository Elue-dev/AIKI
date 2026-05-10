import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Lock } from 'lucide-react'
import { useEffect } from 'react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import PasswordRules, {
  isPasswordValid,
} from '@/components/auth/password-rules'
import FormInput from '@/components/ui/form/form-input'
import { Button } from '@/components/ui/button'
import { validators } from '@/helpers/validators'
import { useResetPassword, useAuthStore } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'
import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'

export const Route = createFileRoute('/reset-password')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === 'string' ? search.token : '',
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const navigate = useNavigate()
  const { token } = Route.useSearch()
  const { mutateAsync: resetPassword, isPending } = useResetPassword()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/' })
  }, [isAuthenticated, navigate])

  const form = useForm({
    defaultValues: { newPassword: '', confirm_password: '' },
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error({
          title: 'Invalid link',
          description: 'This reset link is missing a token.',
        })
        return
      }

      if (value.newPassword !== value.confirm_password) {
        toast.error({ title: 'Passwords do not match' })
        return
      }

      const [_, error] = await safeAsync(() =>
        resetPassword({ token, newPassword: value.newPassword }),
      )

      if (error) {
        toast.error({
          title: 'Reset Failed',
          description: formatApiError(error as ApiError),
        })
        return
      }

      toast.success({
        title: 'Password updated',
        description: 'You can now log in.',
      })
      navigate({ to: '/auth/login' })
    },
  })

  return (
    <AuthWrapper>
      <AuthTitle
        title="Reset your password"
        description="Choose a new password for your account"
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
          name="newPassword"
          label="New password"
          type="password"
          placeholder="Min. 8 characters"
          validator={validators.password}
          leftIcon={<Lock size={16} />}
          required
        />

        <form.Subscribe selector={(s) => s.values ?? { newPassword: '', confirm_password: '' }}>
          {({ newPassword, confirm_password }) => (
            <>
              <PasswordRules
                password={newPassword}
                confirmPassword={confirm_password}
              />
              <FormInput
                form={form}
                name="confirm_password"
                label="Confirm new password"
                type="password"
                placeholder="Re-enter your password"
                validator={validators.confirmPassword(() => newPassword)}
                leftIcon={<Lock size={16} />}
                required
              />
              <Button
                type="submit"
                disabled={
                  !isPasswordValid(newPassword) ||
                  newPassword !== confirm_password ||
                  isPending
                }
                className="w-full mt-1"
              >
                {isPending ? 'Updating…' : 'Update Password'}
              </Button>
            </>
          )}
        </form.Subscribe>
      </form>

      <Link to="/auth/login" className="text-sm text-gray-500 underline mt-5">
        Back to login
      </Link>
    </AuthWrapper>
  )
}
