import { Separator } from './ui/separator'

interface Transaction {
  name: string
  date: string
  amount: string
  positive: boolean
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  onSeeAll?: () => void
}

export function TransactionHistory({
  transactions,
  onSeeAll,
}: TransactionHistoryProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[16px] font-semibold text-dark">
          Transaction History
        </h2>
        <button
          onClick={onSeeAll}
          className="text-[16px] text-dark hover:underline font-medium cursor-pointer"
        >
          See all
        </button>
      </div>

      <Separator />

      <div className="flex flex-col divide-y divide-gray-50">
        {transactions.map((tx, i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div>
              <p className="text-[14px] font-medium text-dark">{tx.name}</p>
              <p className="text-[14px] text-gray200 mt-0.5">{tx.date}</p>
            </div>
            <span
              className={`text-sm font-semibold shrink-0 ml-2 ${
                tx.positive ? 'text-success' : 'text-destructive'
              }`}
            >
              {tx.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
