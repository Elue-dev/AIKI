import { VendorCard } from '@/components/vendor-card'
import { useGetCatalogCategories, useGetCatalogDevices } from '@/stores/catalog'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { Link } from '@tanstack/react-router'

export function ApprovedVendors() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined,
  )
  const { data: categoriesData = [] } = useGetCatalogCategories({
    silent: true,
  })
  const { data: devicesData, isLoading } = useGetCatalogDevices(
    activeCategory ? { category: activeCategory } : undefined,
    { silent: true },
  )

  const devices = devicesData?.data ?? []
  const displayed = devices.slice(0, 6)
  const categories = [{ category: 'All', count: 0 }, ...categoriesData]

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

      <div className="flex items-center gap-2 px-5 mb-2 mt-3 overflow-x-auto scrollbar-hide">
        {categories.map(({ category }) => (
          <button
            key={category}
            onClick={() =>
              setActiveCategory(category === 'All' ? undefined : category)
            }
            className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
              (category === 'All' && !activeCategory) ||
              category === activeCategory
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="relative mt-2 mb-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 gap-y-3 mx-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-[14px] bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <p className="text-center text-xs text-gray-400 py-8">
            No devices available
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory ?? 'all'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-2 gap-y-3 mx-4"
            >
              {displayed.map((device) => (
                <VendorCard key={device.id} device={device} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!isLoading && devicesData && devicesData.data.length > 0 && (
        <Link
          to="/shop-vendors"
          className="flex items-center justify-end px-5 py-4 mt-2 border-t border-gray-50"
        >
          <Button variant="outline" className="bg-muted">
            View More Products →
          </Button>
        </Link>
      )}
    </div>
  )
}
