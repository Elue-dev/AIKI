import Avatar from '@/assets/img/avatar.png'
import Bell from '@/assets/svg/bell.svg'
import HomeFocused from '@/assets/svg/home-focused.svg'
import Home from '@/assets/svg/home.svg'
import LoanFocused from '@/assets/svg/loan-focused.svg'
import Loan from '@/assets/svg/loan.svg'
import OrderFocused from '@/assets/svg/order-focused.svg'
import Order from '@/assets/svg/order.svg'
import { Link, useRouterState } from '@tanstack/react-router'

const navItems = [
  { to: '/', label: 'Home', icon: Home, iconFocused: HomeFocused },
  {
    to: '/orders',
    label: 'Order History',
    icon: Order,
    iconFocused: OrderFocused,
  },
  { to: '/loans', label: 'Loan Record', icon: Loan, iconFocused: LoanFocused },
]

function NavLink({
  to,
  label,
  icon,
  iconFocused,
}: {
  to: string
  label: string
  icon: string
  iconFocused: string
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to)

  return (
    <Link
      to={to}
      className={
        isActive
          ? 'flex items-center gap-1.5 px-6 py-3 rounded-full bg-white text-primary text-sm font-medium shadow-sm'
          : 'flex items-center gap-1.5 px-4 py-2 rounded-full text-gray-500 hover:bg-white/60 text-sm font-medium transition-colors'
      }
    >
      <img src={isActive ? iconFocused : icon} className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  )
}

export default function Header() {
  return (
    <header className="bg-background px-4 md:px-8 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-[10px] tracking-tight">
              AI
            </span>
          </div>
          <span className="font-semibold text-gray-900 text-sm">AIKI</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} />
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <button className="w-9 h-9 rounded-full border border-violet-100 bg-white/70 flex items-center justify-center text-gray-500 hover:bg-white transition-colors">
            <img src={Bell} className="h-7 w-7 rounded-full" />
          </button>
          <Link to="/profile">
            <img
              src={Avatar}
              className="h-9 w-9 md:h-10 md:w-10 rounded-full"
            />
          </Link>
        </div>
      </div>

      <nav className="flex md:hidden items-center justify-center gap-1 mt-3 border-t border-gray-100 pt-3">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} />
        ))}
      </nav>
    </header>
  )
}
