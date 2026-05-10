import { CheckCircle2, Loader2, Upload, X } from 'lucide-react'
import { useRef } from 'react'

interface FileUploadProps {
  label: string
  description?: string
  required?: boolean
  value?: File | null
  onChange?: (file: File | null) => void
  accept?: string
  uploading?: boolean
}

export function FileUpload({
  label,
  description,
  required = true,
  value,
  onChange,
  accept,
  uploading,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.files?.[0] ?? null)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange?.(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="mb-4">
      <label className="block text-[14px] text-black mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {value ? (
        <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-3 bg-green-50">
          <div className="flex items-center gap-2 min-w-0">
            {uploading ? (
              <Loader2 size={16} className="animate-spin text-primary shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            )}
            <span className="text-[13px] text-gray-700 truncate">{value.name}</span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center gap-1.5 border-[0.5px] border-dashed border-black rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white">
          <Upload size={16} className="text-[#9d9d9d]" />
          <span className="text-[14px] text-[#686868] font-medium">Click to upload</span>
          <span className="text-[12px] text-[#9D9D9D]">PDF, JPG or PNG (Max 5MB)</span>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept ?? '.pdf,.jpg,.jpeg,.png'}
            onChange={handleFileChange}
          />
        </label>
      )}

      {description && (
        <p className="text-[12px] text-gray200 ml-2 mt-1">{description}</p>
      )}
    </div>
  )
}
