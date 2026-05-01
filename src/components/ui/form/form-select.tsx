import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Option {
  label: string
  value: string
}

interface FormSelectProps {
  form: any
  name: string
  label?: string
  description?: string
  placeholder?: string
  validator: any
  options: Option[]
  className?: string
  disabled?: boolean
  required?: boolean
}

export default function FormSelect({
  form,
  name,
  label,
  description,
  placeholder,
  validator = {},
  options,
  className = '',
  disabled = false,
  required = false,
}: FormSelectProps) {
  return (
    <form.Field name={name} validators={validator}>
      {(field: any) => (
        <div className={cn('mb-4', className)}>
          {label && (
            <label className="block text-[14px] text-black  mb-1.5">
              {label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          <Select
            value={field.state.value}
            onValueChange={field.handleChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                'w-full px-3.5 py-2.5 h-11! rounded-xl border border-gray-200 bg-white text-sm text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all',
                field.state.meta.errors.length > 0 && 'border-red-400',
                disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
              )}
            >
              <SelectValue
                placeholder={
                  <span className="text-[#9D9D9D]">{placeholder}</span>
                }
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {description && (
            <p className="text-[12px] text-gray200 ml-2 mt-1">{description}</p>
          )}

          {field.state.meta.errors.length > 0 && (
            <span className="text-red-500 text-xs mt-1 block">
              {field.state.meta.errors[0]}
            </span>
          )}
        </div>
      )}
    </form.Field>
  )
}
