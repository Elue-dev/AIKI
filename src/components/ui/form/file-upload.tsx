import { CheckCircle2, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface FileUploadProps {
  label: string
  description?: string
  required?: boolean
  accept?: string
  uploadedFile?: { name: string } | null
  onUpload: (file: File) => Promise<void>
  onRemove?: () => void
}

export function FileUpload({
  label,
  description,
  required = true,
  accept,
  uploadedFile,
  onUpload,
  onRemove,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [pendingName, setPendingName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setProgress(0)
    setPendingName(file.name)
    setError(null)

    const interval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 12 : p))
    }, 100)

    try {
      await onUpload(file)
      clearInterval(interval)
      setProgress(100)
    } catch {
      clearInterval(interval)
      setProgress(0)
      setPendingName(null)
      setError('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.()
    setProgress(0)
    setPendingName(null)
    setError(null)
  }

  return (
    <div className="mb-4">
      <label className="block text-[14px] text-black mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {isUploading && (
        <div className="border border-gray-200 rounded-2xl px-4 py-3 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[13px] text-gray-600 truncate">
              {pendingName}
            </span>
            <span className="text-[12px] text-gray-400 ml-2 shrink-0">
              {progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%`, background: 'var(--primary)' }}
            />
          </div>
        </div>
      )}

      {!isUploading && uploadedFile && (
        <div className="flex items-center justify-between border border-gray-200 rounded-2xl px-4 py-3 bg-green-50">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 size={16} className="text-green-500 shrink-0" />
            <span className="text-[13px] text-gray-700 truncate">
              {uploadedFile.name}
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="ml-2 text-gray-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {!isUploading && !uploadedFile && error && (
        <div className="border border-red-200 rounded-2xl px-4 py-3 bg-red-50">
          <p className="text-[13px] text-red-600">{error}</p>
          <label className="text-[12px] text-primary font-medium cursor-pointer mt-1 inline-block">
            Retry
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept={accept ?? '.pdf,.jpg,.jpeg,.png'}
              onChange={handleFileChange}
            />
          </label>
        </div>
      )}

      {!isUploading && !uploadedFile && !error && (
        <label className="flex flex-col items-center justify-center gap-1.5 border-[0.5px] border-dashed border-black rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white">
          <Upload size={16} className="text-[#9d9d9d]" />
          <span className="text-[14px] text-[#686868] font-medium">
            Click to upload
          </span>
          <span className="text-[12px] text-[#9D9D9D]">
            PDF, JPG or PNG (Max 5MB)
          </span>
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
