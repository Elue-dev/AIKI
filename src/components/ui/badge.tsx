import { cn } from '@/lib/utils'

type BadgeStatus =
  | 'active'
  | 'delivered'
  | 'pending'
  | 'overdue'
  | 'repaid'
  | 'in progress'

interface BadgeProps {
  status: BadgeStatus
  className?: string
}

const styles: Record<BadgeStatus, string> = {
  active: 'bg-[#E9FFE7] text-[#056142]',
  delivered: 'bg-[#E9FFE7] text-[#056142]',
  repaid: 'bg-[#E7F0FF] text-[#1C50A7]',
  pending: 'bg-[#FEF4D8] text-[#AD8515]',
  overdue: 'bg-[#FEF4D8] text-[#AD8515]',
  'in progress': 'bg-[#FEF4D8] text-[#AD8515]',
}

export function Badge({ status, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
