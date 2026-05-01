import { Upload } from 'lucide-react'

interface FileUploadProps {
  label: string
  description?: string
  required?: boolean
}

export function FileUpload({
  label,
  description,
  required = true,
}: FileUploadProps) {
  return (
    <div className="mb-4">
      <label className="block text-[14px] text-black mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <label className="flex flex-col items-center justify-center gap-1.5 border-[0.5px] border-dashed border-black rounded-2xl p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white">
        <Upload size={16} className="text-[#9d9d9d]" />
        <span className="text-[14px] text-[#686868] font-medium">
          Click to upload
        </span>
        <span className="text-[12px] text-[#9D9D9D]">
          PDF, JPG or PNG (Max 5MB)
        </span>

        <input type="file" className="hidden" />
      </label>
      {description && (
        <p className="text-[12px] text-gray200 ml-2 mt-1">{description}</p>
      )}
    </div>
  )
}
