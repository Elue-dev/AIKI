import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useMemo, useState } from 'react'

export const Route = createFileRoute('/_authenticated/orders')({ component: OrderHistoryPage })

type Order = {
  id: string
  item: string
  vendor: string
  amount: number
  nextPayment: string
  amountDue: number
  dateInitiated: string
  status: 'active' | 'delivered' | 'pending' | 'overdue'
}

const data: Order[] = [
  {
    id: '1',
    item: 'iPhone 17 Air',
    vendor: 'TechPro Laptops',
    amount: 1850000,
    nextPayment: 'Mar 15, 2026',
    amountDue: 154166,
    dateInitiated: 'Feb 10, 2026, 12:14pm',
    status: 'delivered',
  },
  {
    id: '2',
    item: 'Starter',
    vendor: 'Base Gadgets',
    amount: 650000,
    nextPayment: 'Feb 8, 2026',
    amountDue: 54166,
    dateInitiated: 'Feb 8, 2026, 1:02am',
    status: 'pending',
  },
  {
    id: '3',
    item: 'MacBook Pro M5 2025',
    vendor: 'TechPro Laptops',
    amount: 1750000,
    nextPayment: 'Mar 5, 2026',
    amountDue: 145833,
    dateInitiated: 'Feb 8, 2026, 07:31am',
    status: 'delivered',
  },
  {
    id: '4',
    item: 'Samsung S24 Gaming Monitor',
    vendor: 'Base Gadgets',
    amount: 580000,
    nextPayment: 'Mar 5, 2026',
    amountDue: 48333,
    dateInitiated: 'Feb 5, 2026, 3:06pm',
    status: 'delivered',
  },
  {
    id: '5',
    item: '6 kva of 500W Solar Panels',
    vendor: 'SolarMax Energy',
    amount: 800000,
    nextPayment: 'Feb 3, 2026',
    amountDue: 800000,
    dateInitiated: 'Feb 5, 2026, 11:05am',
    status: 'pending',
  },
  {
    id: '6',
    item: '5 kW FastGrand Inverter System',
    vendor: 'SolarMax Energy',
    amount: 650000,
    nextPayment: 'Mar 1, 2026',
    amountDue: 54166,
    dateInitiated: 'Feb 1, 2026',
    status: 'delivered',
  },
  {
    id: '7',
    item: 'Alienware',
    vendor: 'Base Gadgets',
    amount: 750000,
    nextPayment: 'Mar 1, 2026',
    amountDue: 62500,
    dateInitiated: 'Feb 1, 2026',
    status: 'delivered',
  },
  {
    id: '8',
    item: 'Jackpot Air',
    vendor: 'Base Gadgets',
    amount: 520000,
    nextPayment: 'Mar 1, 2026',
    amountDue: 43333,
    dateInitiated: 'Feb 1, 2026',
    status: 'pending',
  },
  {
    id: '9',
    item: 'Lenovo T450 14"',
    vendor: 'TechPro Laptops',
    amount: 480000,
    nextPayment: 'Mar 1, 2026',
    amountDue: 40000,
    dateInitiated: 'Feb 1, 2026',
    status: 'pending',
  },
  {
    id: '10',
    item: 'WiFi Extender',
    vendor: 'Base Gadgets',
    amount: 85000,
    nextPayment: 'Mar 1, 2026',
    amountDue: 7083,
    dateInitiated: 'Mar 1, 2026, 3:06pm',
    status: 'delivered',
  },
]

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

const columnHelper = createColumnHelper<Order>()

const columns: ColumnDef<Order, any>[] = [
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
  columnHelper.accessor('item', {
    header: 'Item',
    cell: (i) => (
      <span className="font-medium text-gray-900 text-xs">{i.getValue()}</span>
    ),
  }),
  columnHelper.accessor('vendor', {
    header: 'Vendor',
    cell: (i) => <span className="text-xs text-gray-500">{i.getValue()}</span>,
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: (i) => (
      <span className="text-xs text-gray-800">{fmt(i.getValue())}</span>
    ),
  }),
  columnHelper.accessor('nextPayment', {
    header: 'Next Payment',
    cell: (i) => <span className="text-xs text-gray-500">{i.getValue()}</span>,
  }),
  columnHelper.accessor('amountDue', {
    header: 'Amount Due',
    cell: (i) => (
      <span className="text-xs text-gray-800">{fmt(i.getValue())}</span>
    ),
  }),
  columnHelper.accessor('dateInitiated', {
    header: 'Date & Time Initiated',
    cell: (i) => <span className="text-xs text-gray-500">{i.getValue()}</span>,
  }),

  columnHelper.accessor('status', {
    header: 'Status',
    cell: (i) => <Badge status={i.getValue()} />,
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

type TabKey = 'All' | 'delivered' | 'pending'

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('All')
  const [rowSelection, setRowSelection] = useState({})

  const counts = useMemo(
    () => ({
      All: data.length,
      delivered: data.filter((d) => d.status === 'delivered').length,
      pending: data.filter((d) => d.status === 'pending').length,
    }),
    [],
  )

  const filtered = useMemo(() => {
    if (activeTab === 'All') return data
    return data.filter((r) => r.status === activeTab)
  }, [activeTab])

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <main className="wrapper py-8">
        <h1 className="text-[23px] md:text-[32px] font-semibold text-dark mb-4">
          Order History
        </h1>

        <DataTable
          data={filtered}
          columns={columns}
          description="View and track your purchases"
          tabs={[
            { label: 'All', value: 'All', count: counts.All },
            { label: 'Delivered', value: 'delivered', count: counts.delivered },
            { label: 'Pending', value: 'pending', count: counts.pending },
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
