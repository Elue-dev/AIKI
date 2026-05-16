import { cn } from '@/lib/utils'

export type OrderStatus =
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'EQUITY_PAID'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'

interface BadgeProps {
  status: OrderStatus | string
  className?: string
}

const CONFIG: Record<string, { label: string; style: string }> = {
  PENDING_APPROVAL: { label: 'Pending Approval', style: 'bg-[#FEF4D8] text-[#AD8515]' },
  APPROVED:         { label: 'Approved',          style: 'bg-[#E9FFE7] text-[#056142]' },
  EQUITY_PAID:      { label: 'Equity Paid',        style: 'bg-[#E7F0FF] text-[#1C50A7]' },
  PROCESSING:       { label: 'Processing',         style: 'bg-[#FEF4D8] text-[#AD8515]' },
  DISPATCHED:       { label: 'Dispatched',         style: 'bg-[#E7F0FF] text-[#1C50A7]' },
  DELIVERED:        { label: 'Delivered',          style: 'bg-[#E9FFE7] text-[#056142]' },
  COMPLETED:        { label: 'Completed',          style: 'bg-[#E9FFE7] text-[#056142]' },
  CANCELLED:        { label: 'Cancelled',          style: 'bg-[#FFE7E7] text-[#A80000]' },
  REJECTED:         { label: 'Rejected',           style: 'bg-[#FFE7E7] text-[#A80000]' },
}

export function Badge({ status, className }: BadgeProps) {
  const cfg = CONFIG[status?.toUpperCase?.()] ?? {
    label: status,
    style: 'bg-gray-100 text-gray-600',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        cfg.style,
        className,
      )}
    >
      {cfg.label}
    </span>
  )
}
