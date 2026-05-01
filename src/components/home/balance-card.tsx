interface BalanceCardProps {
  nairaBalance: string
  paymentsDue: string
  dueDate: string
}

export function BalanceCard({
  nairaBalance,
  paymentsDue,
  dueDate,
}: BalanceCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex gap-4">
        {/* Naira Balance */}
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-400 mb-1.5">
            Naira Balance
          </p>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {nairaBalance}
          </p>
          <button className="mt-3 bg-gray-900 text-white text-[10px] font-medium px-3.5 py-1.5 rounded-full hover:bg-gray-800 transition-colors">
            Withdraw
          </button>
        </div>

        {/* Divider */}
        <div className="w-px bg-gray-100 self-stretch" />

        {/* Payments Due */}
        <div className="flex-1">
          <p className="text-xs font-medium text-pink-400 mb-1.5">
            Payments Due
          </p>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {paymentsDue}
          </p>
          <p className="text-[11px] text-gray-400 mt-3">{dueDate}</p>
        </div>
      </div>
    </div>
  )
}
