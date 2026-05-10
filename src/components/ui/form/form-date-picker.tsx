import { useState } from 'react'
import { format, parse, isValid } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface FormDatePickerProps {
  form: any
  name: string
  label?: string
  placeholder?: string
  validator?: any
  required?: boolean
  disabled?: boolean
  className?: string
}

export default function FormDatePicker({
  form,
  name,
  label,
  placeholder = 'Pick a date',
  validator = {},
  required = false,
  disabled = false,
  className,
}: FormDatePickerProps) {
  const [open, setOpen] = useState(false)

  return (
    <form.Field name={name} validators={validator}>
      {(field: any) => {
        // Field stores value as ISO string (YYYY-MM-DD); parse to Date for Calendar
        const dateValue: Date | undefined = field.state.value
          ? parse(field.state.value, 'yyyy-MM-dd', new Date())
          : undefined
        const isDateValid = dateValue && isValid(dateValue)
        const hasError = field.state.meta.errors?.length > 0

        const handleSelect = (selected: Date | undefined) => {
          field.handleChange(selected ? format(selected, 'yyyy-MM-dd') : '')
          field.handleBlur()
          setOpen(false)
        }

        return (
          <div className={cn('mb-4', className)}>
            {label && (
              <label className="block text-[14px] text-black mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    'w-full h-11 px-3.5 justify-start text-left font-normal rounded-xl border border-gray-200 bg-white text-sm shadow-none hover:bg-white focus-visible:ring-2 focus-visible:ring-primary/10 focus-visible:border-primary transition-all',
                    !isDateValid && 'text-[#9D9D9D]',
                    hasError && 'border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/10',
                    disabled && 'bg-gray-50 cursor-not-allowed opacity-60',
                  )}
                >
                  <CalendarIcon size={15} className="mr-2 shrink-0 text-gray-400" />
                  {isDateValid ? format(dateValue!, 'PPP') : placeholder}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={isDateValid ? dateValue : undefined}
                  onSelect={handleSelect}
                  defaultMonth={isDateValid ? dateValue : undefined}
                  captionLayout="dropdown"
                  startMonth={new Date(1900, 0)}
                  endMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
            {hasError && (
              <span className="text-red-500 text-xs mt-1 block">
                {field.state.meta.errors[0]}
              </span>
            )}
          </div>
        )
      }}
    </form.Field>
  )
}
