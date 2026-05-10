import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { createFileRoute } from '@tanstack/react-router'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/loans')({ component: LoanRecordPage })

type Loan = {
  id: string
  item: string
  vendor: string
  amount: number
  tenure: string
  firstPayment: string
  approvedDate: string
  status: 'active' | 'overdue' | 'repaid'
}

const data: Loan[] = [
  {
    id: '1',
    item: 'MacBook Pro M5 2025',
    vendor: 'TechPro Laptops',
    amount: 1750000,
    tenure: '12 months',
    firstPayment: 'Mar 7, 2026',
    approvedDate: 'Feb 11, 2026',
    status: 'active',
  },
  {
    id: '2',
    item: '6 kva of 500W Solar Panels',
    vendor: 'SolarMax Energy',
    amount: 800000,
    tenure: '6 months',
    firstPayment: 'Mar 3, 2026',
    approvedDate: 'Feb 7, 2026',
    status: 'active',
  },
  {
    id: '3',
    item: '5 kW FastGrand Inverter System',
    vendor: 'SolarMax Energy',
    amount: 650000,
    tenure: '6 months',
    firstPayment: 'Feb 7, 2026',
    approvedDate: 'Feb 7, 2026',
    status: 'repaid',
  },
]

const fmt = (n: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(n)

const columnHelper = createColumnHelper<Loan>()

const columns: ColumnDef<Loan, any>[] = [
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
  columnHelper.accessor('tenure', {
    header: 'Tenure',
    cell: (i) => <span className="text-xs text-gray-500">{i.getValue()}</span>,
  }),
  columnHelper.accessor('firstPayment', {
    header: 'First Payment',
    cell: (i) => <span className="text-xs text-gray-500">{i.getValue()}</span>,
  }),
  columnHelper.accessor('approvedDate', {
    header: 'Approved Date',
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

function LoanRecordPage() {
  const [rowSelection, setRowSelection] = useState({})

  const totalOutstanding = data
    .filter((d) => d.status !== 'repaid')
    .reduce((s, d) => s + d.amount, 0)

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <main className="wrapper py-8">
        <h1 className="text-[23px] md:text-[32px] font-semibold text-dark mb-4">
          Loan Record
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Loans', value: data.length },
            {
              label: 'Active Loans',
              value: data.filter((d) => d.status === 'active').length,
            },
            { label: 'Total Outstanding', value: fmt(totalOutstanding) },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 px-6 py-6"
            >
              <p className="text-[16px] text-dark mb-2 font-semibold">
                {s.label}
              </p>
              <p className="text-[32px] font-semibold text-dark">{s.value}</p>
            </div>
          ))}
        </div>

        <DataTable
          data={data}
          columns={columns}
          description="View your loan history and repayment details"
          showExport
          showSearch={false}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
        />
      </main>
    </div>
  )
}
