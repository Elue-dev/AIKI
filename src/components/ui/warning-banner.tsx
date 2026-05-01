import WarnIcon from '@/assets/svg/warn.svg'

interface WarningBannerProps {
  title: string
  children: React.ReactNode
}

export function WarningBanner({ title, children }: WarningBannerProps) {
  return (
    <div
      className="rounded-2xl p-4 flex gap-3"
      style={{ backgroundColor: 'var(--goldBg)' }}
    >
      <img src={WarnIcon} className="h-6 w-6 mt-1" />
      <div>
        <p
          className="text-[16px] font-semibold mb-1"
          style={{ color: 'var(--goldText)' }}
        >
          {title}
        </p>
        <p className="text-[14px] text-gray200 leading-relaxed">{children}</p>
      </div>
    </div>
  )
}
