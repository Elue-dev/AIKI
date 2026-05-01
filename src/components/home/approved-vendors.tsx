import { VendorCard } from '@/components/vendor-card'
import { vendors, type Vendor } from '@/data/vendors'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'

const categories = ['Trending', 'Computing', 'Energy', 'Connectivity']

function filterVendors(list: Vendor[], category: string): Vendor[] {
  if (category === 'Trending') return list
  return list.filter((v) => v.category === category)
}

export function ApprovedVendors() {
  const [activeCategory, setActiveCategory] = useState('Trending')
  const filtered = filterVendors(vendors, activeCategory)
  const displayed: Vendor[] = Array.from(
    { length: 6 },
    (_, i) => filtered[i % filtered.length],
  )

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
      <div className="px-5 pt-5 pb-4">
        <h2 className="text-[16px] font-semibold text-dark">
          Approved Vendors
        </h2>
        <p className="text-xs text-gray200 mt-0.5 leading-relaxed max-w-[65%]">
          Shop from our trusted network of vendors. Get instant approval and
          flexible payment terms on all purchases.
        </p>
      </div>

      <div className="px-5">
        <Separator />
      </div>

      {/* Filters — scrollable on mobile */}
      <div className="flex items-center gap-2 px-5 mb-2 mt-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="relative mt-2 mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="grid grid-cols-2 md:grid-cols-3 gap-2 gap-y-3 mx-4"
          >
            {displayed.map((vendor, i) => (
              <VendorCard key={`${activeCategory}-${i}`} {...vendor} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <Link
        to="/shop-vendors"
        className="flex items-center justify-end px-5 py-4 mt-2 border-t border-gray-50"
      >
        <Button variant="outline" className="bg-muted">
          View More Products →
        </Button>
      </Link>
    </div>
  )
}
