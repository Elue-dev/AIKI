interface AuthTitleProps {
  title: string
  description?: string
}

export default function AuthTitle({ title, description }: AuthTitleProps) {
  return (
    <div className="text-center mb-7 w-full">
      <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{title}</h1>
      {description && <p className="text-sm text-gray-500 mt-1.5">{description}</p>}
    </div>
  )
}
