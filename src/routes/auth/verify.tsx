import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Mail } from 'lucide-react'
import AuthTitle from '@/components/auth/auth-title'
import AuthWrapper from '@/components/auth/auth-wrapper'
import OtpInput from '@/components/auth/otp-input'
import { Button } from '@/components/ui/button'
import { useVerifyEmail, useAuthStore } from '@/stores/auth'
import { toast } from '@/lib/toast'
import { safeAsync } from '@/helpers/safe-sync'
import { formatApiError } from '@/helpers/api-error'
import type { ApiError } from '@/lib/interceptor'

export const Route = createFileRoute('/auth/verify')({
  component: VerifyEmailPage,
})

const RESEND_COOLDOWN = 60

function VerifyEmailPage() {
  const navigate = useNavigate()
  const pendingEmail = useAuthStore((s) => s.pendingEmail)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const { mutateAsync: verifyEmail, isPending } = useVerifyEmail()

  useEffect(() => {
    if (!pendingEmail) {
      navigate({ to: '/auth/login' })
    }
  }, [pendingEmail, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSubmit = async () => {
    if (otp.length < 6) {
      setOtpError(true)
      return
    }
    setOtpError(false)

    const [_, error] = await safeAsync(() => verifyEmail({ otp }))

    if (error) {
      setOtpError(true)
      toast.error({
        title: 'Verification failed',
        description: formatApiError(error as ApiError),
      })
      return
    }

    toast.success({
      title: 'Email verified!',
      description: 'Welcome to AIKI 🎉',
    })
    navigate({ to: '/' })
  }

  const handleResend = async () => {
    const [_, error] = await safeAsync(() =>
      fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail }),
      }),
    )

    if (error) {
      toast.error({ title: 'Failed to resend code' })
      return
    }

    setCooldown(RESEND_COOLDOWN)
    toast.success({
      title: 'Code resent',
      description: `Check ${pendingEmail}`,
    })
  }

  if (!pendingEmail) return null

  const maskedEmail = pendingEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')

  return (
    <AuthWrapper>
      <div className="flex flex-col items-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <AuthTitle
          title="Check your email"
          description={`We sent a 6-digit code to ${maskedEmail}`}
        />
      </div>

      <div className="w-full space-y-6">
        <OtpInput
          value={otp}
          onChange={(val) => {
            setOtp(val)
            setOtpError(false)
          }}
          disabled={isPending}
          error={otpError}
        />

        {otpError && otp.length === 6 && (
          <p className="text-center text-xs text-red-500">
            Invalid code. Please check and try again.
          </p>
        )}

        <Button
          className="w-full"
          disabled={otp.length < 6 || isPending}
          onClick={handleSubmit}
        >
          {isPending ? 'Verifying…' : 'Verify Email'}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Didn't receive it?{' '}
          {cooldown > 0 ? (
            <span className="text-gray-400">Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Resend code
            </button>
          )}
        </p>
      </div>
    </AuthWrapper>
  )
}
