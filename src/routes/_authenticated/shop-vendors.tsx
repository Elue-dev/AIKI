import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { VendorCard } from '#/components/vendor-card'
import { useGetCatalogCategories, useGetCatalogDevices } from '#/stores/catalog'
import { createFileRoute, Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/shop-vendors')({
  component: RouteComponent,
})

const PAGE_SIZE = 20

function RouteComponent() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(
    undefined,
  )
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const { data: categoriesData = [] } = useGetCatalogCategories({ silent: true })
  const { data: devicesData, isLoading } = useGetCatalogDevices(
    activeCategory ? { category: activeCategory } : undefined,
    { silent: true },
  )

  const allDevices = devicesData?.data ?? []
  const meta = devicesData?.meta
  const categories = [{ category: 'All', count: 0 }, ...categoriesData]

  const filtered = allDevices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  )

  const totalPages = Math.max(1, meta?.totalPages ?? 1)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat === 'All' ? undefined : cat)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <main className="wrapper py-8">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[12px] text-black hover:text-gray-600 transition-colors mb-2 w-fit"
        >
          ← Back to Home
        </Link>
        <h1 className="text-[23px] md:text-[32px] font-semibold text-dark mb-6">
          Shop Vendors
        </h1>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row items-start justify-between px-6 pt-5 pb-4">
            <div>
              <h2 className="text-[16px] font-semibold text-dark">
                Approved Vendors
              </h2>
              <p className="text-xs text-gray200 mt-0.5 leading-relaxed">
                Shop from our trusted network of vendors. Get instant approval
                and flexible payment terms on all purchases.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-background rounded-full px-3.5 py-2 w-82 mt-3 md:mt-0">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                placeholder="Search for products"
                className="flex-1 outline-none text-xs text-gray-600 placeholder-gray-400 bg-transparent"
              />
            </div>
          </div>

          <div className="px-6">
            <Separator />
          </div>

          <div className="flex items-center gap-2 px-6 py-4 overflow-x-auto">
            {categories.map(({ category }) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
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

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3 mx-4 mb-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-[14px] bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12">
              No devices found
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory ?? 'all'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3 mx-4"
              >
                {paginated.map((device, i) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.16,
                      delay: i * 0.025,
                      ease: 'easeOut',
                    }}
                  >
                    <VendorCard device={device} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          <div className="flex items-center justify-between px-6 py-4 mt-4 border-t border-gray-50">
            <p className="text-xs text-gray200">
              {meta
                ? `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, meta.total)} of ${meta.total} entries`
                : ''}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant={page === 1 ? 'disabled' : 'secondary'}
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md"
              >
                ← Previous
              </Button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i + 1 ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setPage(i + 1)}
                  className="rounded-md"
                >
                  {i + 1}
                </Button>
              ))}

              <Button
                variant={page === totalPages ? 'disabled' : 'secondary'}
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md"
              >
                Next →
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
