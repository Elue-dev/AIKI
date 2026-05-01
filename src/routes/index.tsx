import { ApprovedVendors } from '#/components/home/approved-vendors'
import { PaymentsDueAlert } from '#/components/home/payment-due-alert'
import { QuickActions } from '#/components/home/quick-actions'
import { TransactionHistory } from '#/components/transaction-history'
import { createFileRoute } from '@tanstack/react-router'
import { Search } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

const transactions = [
  {
    name: 'MacBook Pro Purchase',
    date: '15th April 2026',
    amount: '-₦195,000',
    positive: false,
  },
  {
    name: 'Refund - Solar Panel Installation',
    date: '15th March 2026',
    amount: '+₦200,000',
    positive: true,
  },
  {
    name: 'WiFi Router Purchase',
    date: '13th February 2026',
    amount: '-₦85,500',
    positive: false,
  },
  {
    name: 'Laptop accessory Purchase',
    date: '9th February 2026',
    amount: '-₦25,000',
    positive: false,
  },
]

function HomePage() {
  return (
    <div className="min-h-screen">
      <main className="wrapper py-10">
        <h1 className="text-[28px] font-bold text-center text-gray-900 mb-5 tracking-tight">
          Hey, Sani Francis
        </h1>

        <div className="mx-24 flex items-center gap-3 bg-white border border-gray-200 rounded-full px-5 py-3 mb-7 shadow-sm">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search for vendors, gadgets on Aiki"
            className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent"
          />
        </div>

        <div className="flex gap-6">
          <div className="w-[48%] flex flex-col">
            <QuickActions />

            <div className="pt-4">
              <PaymentsDueAlert
                dueDate="30th April 2026"
                bankName="Providus Bank"
                accountName="AIKI Escrow Ltd"
                accountNumber="1900045782"
                onCopy={() => navigator.clipboard.writeText('1900045782')}
                onPay={() => console.log('pay')}
              />
            </div>

            <div className="pt-4">
              <TransactionHistory
                transactions={transactions}
                onSeeAll={() => console.log('see all')}
              />
            </div>
          </div>

          <div className="w-[50%]">
            <ApprovedVendors />
          </div>
        </div>
      </main>
    </div>
  )
}
