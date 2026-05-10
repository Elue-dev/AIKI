import { useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export default function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = value.split('').concat(Array(length).fill('')).slice(0, length)

  const focus = (idx: number) => inputRefs.current[idx]?.focus()

  const handleChange = (idx: number, char: string) => {
    const d = char.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = d
    onChange(next.join(''))
    if (d && idx < length - 1) focus(idx + 1)
  }

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits]
        next[idx] = ''
        onChange(next.join(''))
      } else if (idx > 0) {
        focus(idx - 1)
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focus(idx - 1)
    } else if (e.key === 'ArrowRight' && idx < length - 1) {
      focus(idx + 1)
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    onChange(pasted.padEnd(length, '').slice(0, length))
    focus(Math.min(pasted.length, length - 1))
  }

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { inputRefs.current[idx] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            'w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 outline-none transition-all bg-white',
            'focus:border-primary focus:ring-2 focus:ring-primary/10',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
              : digit
                ? 'border-primary/50 bg-primary/5'
                : 'border-gray-200',
            disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
          )}
        />
      ))}
    </div>
  )
}
