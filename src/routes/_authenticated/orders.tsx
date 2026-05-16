import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { OrderDetailSheet } from '@/components/order/order-detail-sheet'
import { useGetClientOrders } from '@/stores/orders'
import type { ClientOrder } from '@/stores/orders/types'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useMemo, useState } from 'react'
import Papa from 'papaparse'

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrderHistoryPage,
})

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

type FilterStatus =
  | 'ALL'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'EQUITY_PAID'
  | 'PROCESSING'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'EQUITY_PAID', label: 'Equity Paid' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'DISPATCHED', label: 'Dispatched' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REJECTED', label: 'Rejected' },
]


const columnHelper = createColumnHelper<ClientOrder>()

function buildColumns(
  onView: (order: ClientOrder) => void,
): ColumnDef<ClientOrder, any>[] {
  return [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="accent-primary"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="accent-primary"
        />
      ),
    }),
    columnHelper.accessor('reference', {
      header: 'Order #',
      cell: (i) => (
        <span className="font-medium text-gray-900 text-xs">{i.getValue()}</span>
      ),
    }),
    columnHelper.accessor('items', {
      id: 'item',
      header: 'Item',
      cell: (i) => (
        <span className="font-medium text-gray-900 text-xs">
          {i.getValue()?.[0]?.deviceName ?? '—'}
        </span>
      ),
    }),
    columnHelper.accessor('totalRepayableKobo', {
      header: 'Amount',
      cell: (i) => (
        <span className="text-xs text-gray-800">{fmt(i.getValue() / 100)}</span>
      ),
    }),
    columnHelper.accessor('monthlyPaymentKobo', {
      header: 'Monthly Payment',
      cell: (i) => (
        <span className="text-xs text-gray-800">{fmt(i.getValue() / 100)}</span>
      ),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Date & Time Initiated',
      cell: (i) => (
        <span className="text-xs text-gray-500">
          {new Date(i.getValue()).toLocaleString('en-NG', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </span>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (i) => <Badge status={i.getValue()} />,
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="xs"
          className="gap-1 rounded-lg"
          onClick={() => onView(row.original)}
        >
          <Eye size={11} /> View
        </Button>
      ),
    }),
  ]
}

function OrderHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL')
  const [rowSelection, setRowSelection] = useState({})
  const [selectedOrder, setSelectedOrder] = useState<ClientOrder | null>(null)
  const { data: ordersData, isLoading } = useGetClientOrders({ silent: true })

  const orders = ordersData?.data ?? []

  const filtered = useMemo(() => {
    if (statusFilter === 'ALL') return orders
    return orders.filter((r) => r.status === statusFilter)
  }, [statusFilter, orders])

  const columns = useMemo(() => buildColumns(setSelectedOrder), [])

  const handleExport = () => {
    const rows = filtered.map((o) => ({
      'Order #': o.reference,
      Item: o.items?.[0]?.deviceName ?? '',
      Amount: fmt(o.totalRepayableKobo / 100),
      'Monthly Payment': fmt(o.monthlyPaymentKobo / 100),
      Status: o.status,
      'Date Initiated': new Date(o.createdAt).toLocaleString('en-NG', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    }))
    const csv = Papa.unparse(rows)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <main className="wrapper py-8">
        <h1 className="text-[23px] md:text-[32px] font-semibold text-dark mb-4">
          Order History
        </h1>

        <DataTable
          isLoading={isLoading}
          data={filtered}
          columns={columns}
          description="View and track your purchases"
          filterSlot={
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as FilterStatus)}
            >
              <SelectTrigger size="sm" className="text-xs min-w-[160px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent position="popper">
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          showExport
          onExport={handleExport}
          searchPlaceholder="Search orders..."
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </main>

      <OrderDetailSheet
        orderId={selectedOrder?.id ?? null}
        previewOrder={selectedOrder ?? undefined}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  )
}
