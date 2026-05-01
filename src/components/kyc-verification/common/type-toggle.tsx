import { motion } from 'framer-motion'

export type AssessmentType = 'Personal' | 'Business'

interface TypeToggleProps {
  value: AssessmentType
  onChange: (value: AssessmentType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-[#F1F1F1] rounded-full p-1 w-fit">
      {(['Personal', 'Business'] as AssessmentType[]).map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`relative px-4 py-2 rounded-full text-[14px] font-medium transition-colors duration-150 cursor-pointer ${
            value === t ? 'text-primary' : 'text-gray200 hover:text-gray-600'
          }`}
        >
          {value === t && (
            <motion.div
              layoutId="assessment-type-pill"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{t}</span>
        </button>
      ))}
    </div>
  )
}
