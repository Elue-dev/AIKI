import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormInputProps {
  form: any
  name: string
  label?: string
  description?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  validator?: any
  placeholder?: string
  className?: string
  disabled?: boolean
  required?: boolean
  leftIcon?: React.ReactNode | (() => React.ReactNode)
}

export default function FormInput({
  form,
  name,
  label,
  description,
  type = 'text',
  validator = {},
  placeholder,
  className = '',
  disabled = false,
  required = false,
  leftIcon,
}: FormInputProps) {
  const resolvedIcon = typeof leftIcon === 'function' ? leftIcon() : leftIcon
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form.Field name={name} validators={validator}>
      {(field: any) => (
        <div className={cn('mb-4', className)}>
          {label && (
            <label
              htmlFor={field.name}
              className="block text-[14px] text-black mb-1.5"
            >
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          <div className="relative">
            {resolvedIcon && (
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 flex items-center">
                {resolvedIcon}
              </span>
            )}
            <input
              id={field.name}
              name={field.name}
              type={isPassword ? (showPassword ? 'text' : 'password') : type}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'w-full px-3.5 py-2.5 h-11 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-[#9D9D9D] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all',
                resolvedIcon && 'pl-10',
                isPassword && 'pr-10',
                field.state.meta.errors?.length > 0 &&
                  'border-red-400 focus:border-red-400 focus:ring-red-400/10',
                disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              )}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {description && (
            <p className="text-[12px] text-gray200 ml-2 mt-1">{description}</p>
          )}
          {field.state.meta.errors?.length > 0 && (
            <span className="text-red-500 text-xs mt-1 block">
              {field.state.meta.errors[0]}
            </span>
          )}
        </div>
      )}
    </form.Field>
  )
}
