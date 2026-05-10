import { CheckCircle2, Circle } from 'lucide-react'

interface PasswordRulesProps {
  password: string
  confirmPassword?: string
}

export const PASSWORD_RULES = [
  { label: 'At least 8 characters', test: (p: string) => (p?.length ?? 0) >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p ?? '') },
  { label: 'One lowercase letter', test: (p: string) => /[a-z]/.test(p ?? '') },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p ?? '') },
  { label: 'One special character', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p ?? '') },
]

export function isPasswordValid(password: string) {
  if (!password) return false
  return PASSWORD_RULES.every((rule) => rule.test(password))
}

export default function PasswordRules({ password, confirmPassword }: PasswordRulesProps) {
  if (!password) return null

  return (
    <div className="mt-1 mb-4">
      <p className="text-xs text-gray-400 mb-2">Password must contain:</p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {PASSWORD_RULES.map(({ label, test }) => {
          const met = test(password)
          return (
            <div key={label} className="flex items-center gap-1.5 text-xs">
              {met ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              )}
              <span className={met ? 'text-primary' : 'text-gray-400'}>{label}</span>
            </div>
          )
        })}

        {confirmPassword !== undefined && (
          <div className="flex items-center gap-1.5 text-xs">
            {password === confirmPassword && (confirmPassword?.length ?? 0) > 0 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
            )}
            <span
              className={
                password === confirmPassword && (confirmPassword?.length ?? 0) > 0
                  ? 'text-primary'
                  : 'text-gray-400'
              }
            >
              Passwords match
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
