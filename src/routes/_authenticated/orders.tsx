import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { useGetClientOrders } from '@/stores/orders'
import type { ClientOrder } from '@/stores/orders/types'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrderHistoryPage,
})

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

type BadgeStatus =
  | 'active'
  | 'delivered'
  | 'pending'
  | 'overdue'
  | 'repaid'
  | 'in progress'

function mapStatus(s: string): BadgeStatus {
  switch (s.toUpperCase()) {
    case 'DELIVERED':
      return 'delivered'
    case 'APPROVED':
      return 'active'
    case 'REPAID':
      return 'repaid'
    case 'CANCELLED':
      return 'overdue'
    default:
      return 'pending'
  }
}

const columnHelper = createColumnHelper<ClientOrder>()

const columns: ColumnDef<ClientOrder, any>[] = [
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
  columnHelper.accessor('device', {
    id: 'item',
    header: 'Item',
    cell: (i) => (
      <span className="font-medium text-gray-900 text-xs">
        {i.getValue().name}
      </span>
    ),
  }),
  columnHelper.accessor('device', {
    id: 'vendor',
    header: 'Vendor',
    cell: (i) => (
      <span className="text-xs text-gray-500">{i.getValue().vendor.name}</span>
    ),
  }),
  columnHelper.accessor('totalPaymentKobo', {
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
    cell: (i) => <Badge status={mapStatus(i.getValue())} />,
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: () => (
      <Button variant="outline" size="xs" className="gap-1 rounded-lg">
        <Eye size={11} /> View
      </Button>
    ),
  }),
]

type TabKey = 'All' | 'DELIVERED' | 'PENDING'

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('All')
  const [rowSelection, setRowSelection] = useState({})
  const { data: ordersData, isLoading } = useGetClientOrders({ silent: true })

  const orders = ordersData?.data ?? []

  const counts = useMemo(
    () => ({
      All: orders.length,
      DELIVERED: orders.filter((d) => d.status === 'DELIVERED').length,
      PENDING: orders.filter((d) => d.status === 'PENDING').length,
    }),
    [orders],
  )

  const filtered = useMemo(() => {
    if (activeTab === 'All') return orders
    return orders.filter((r) => r.status === activeTab)
  }, [activeTab, orders])

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
          tabs={[
            { label: 'All', value: 'All', count: counts.All },
            { label: 'Delivered', value: 'DELIVERED', count: counts.DELIVERED },
            { label: 'Pending', value: 'PENDING', count: counts.PENDING },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showExport
          searchPlaceholder="Search orders..."
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </main>
    </div>
  )
}
