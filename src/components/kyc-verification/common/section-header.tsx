interface SectionHeaderProps {
  title: string
  step: number
  total: number
}

export function SectionHeader({ title, step, total }: SectionHeaderProps) {
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-[16px] font-semibold text-black">{title}</h3>
      <span className="text-[12px] text-[#9D9D9D] font-medium tracking-wide uppercase tabular-nums">
        {pad(step)} of {pad(total)}
      </span>
    </div>
  )
}
