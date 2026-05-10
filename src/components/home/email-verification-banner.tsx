import { MailWarning } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useResendVerification, useAuthStore } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'
import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'

export function EmailVerificationBanner() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail)
  const { mutateAsync: resendVerification, isPending } = useResendVerification()

  if (!user || user.emailVerified) return null

  const handleVerifyClick = async () => {
    const [_, error] = await safeAsync(() => resendVerification(user.email))

    if (error) {
      toast.error({
        title: 'Could not send verification code',
        description: formatApiError(error as ApiError),
      })
      return
    }

    setPendingEmail(user.email)
    navigate({ to: '/auth/verify' })
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
      <MailWarning className="shrink-0 text-amber-500" size={20} />
      <p className="flex-1 text-sm text-amber-800">
        Your email address hasn't been verified yet. Please verify to access all features.
      </p>
      <Button
        size="sm"
        variant="outline"
        onClick={handleVerifyClick}
        disabled={isPending}
        className="shrink-0 border-amber-300 bg-white text-amber-700 hover:bg-amber-100 hover:text-amber-800"
      >
        {isPending ? 'Sending…' : 'Verify email'}
      </Button>
    </div>
  )
}
