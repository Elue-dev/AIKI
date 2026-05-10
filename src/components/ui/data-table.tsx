import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type RowSelectionState,
  type OnChangeFn,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Button } from './button'
import { Download, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab<T extends string> = {
  label: string
  value: T
  count?: number
}

interface DataTableProps<TData, TTab extends string = string> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  isLoading?: boolean
  skeletonRows?: number

  description?: string
  showExport?: boolean
  onExport?: () => void

  tabs?: Tab<TTab>[]
  activeTab?: TTab
  onTabChange?: (tab: TTab) => void

  showSearch?: boolean
  searchPlaceholder?: string

  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>

  pageSize?: number
}

export function DataTable<TData, TTab extends string = string>({
  data,
  columns,
  isLoading = false,
  skeletonRows = 6,
  description,
  showExport = false,
  onExport,
  tabs,
  activeTab,
  onTabChange,
  showSearch = true,
  searchPlaceholder = 'Search...',
  rowSelection = {},
  onRowSelectionChange,
  pageSize = 10,
}: DataTableProps<TData, TTab>) {
  const [search, setSearch] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, globalFilter: search },
    onRowSelectionChange,
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const { pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()
  const hasRows = table.getRowModel().rows.length > 0
  const totalFiltered = table.getFilteredRowModel().rows.length

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {(description || showExport) && (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
          {showExport && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 rounded-lg mt-3 md:mt-0"
              onClick={onExport}
            >
              <Download size={13} /> Export CSV
            </Button>
          )}
        </div>
      )}

      {(tabs || showSearch) && (
        <div className="flex flex-col md:flex-row items-center justify-between px-6 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {tabs &&
              onTabChange &&
              tabs.map((tab) => {
                const isActive = activeTab === tab.value

                return (
                  <button
                    key={tab.value}
                    onClick={() => {
                      onTabChange?.(tab.value)
                      table.setPageIndex(0)
                    }}
                    className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-gray-500 bg-[#F3F3F3]'
                    }`}
                  >
                    {tab.label}

                    {tab.count !== undefined && (
                      <span
                        className={cn(
                          'text-[10px] px-2 py-0.45 rounded-full',
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-transparent border border-[#8A8E85] text-[#8A8E85]',
                        )}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
          </div>
          {showSearch && (
            <div className="flex items-center gap-2 bg-[#F4F4F4] rounded-full px-3.5 py-2 w-60 mt-5 md:mt-0">
              <Search size={13} className="text-gray-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  table.setPageIndex(0)
                }}
                placeholder={searchPlaceholder}
                className="flex-1 outline-none text-xs text-gray-600 placeholder-gray-400 bg-transparent"
              />
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto px-6">
        <div className="border border-gray-200 rounded-lg">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th
                      key={h.id}
                      className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap bg-[#F4F4F4] border-b border-gray-200 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: skeletonRows }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    {columns.map((_, j) => (
                      <td
                        key={j}
                        className="px-4 py-3.5 whitespace-nowrap border-b border-gray-100 border-r last:border-r-0"
                      >
                        <div
                          className={`h-3.5 rounded-full bg-gray-200 animate-pulse ${j === 0 ? 'w-4' : j === columns.length - 1 ? 'w-12' : 'w-24'}`}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              ) : hasRows ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3.5 whitespace-nowrap border-b border-gray-100 border-r last:border-r-0"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-sm text-gray-400"
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
        {data.length > 10 && (
          <>
            <p className="text-xs text-gray-400">
              {totalFiltered === 0
                ? '0 entries'
                : `Showing ${pageIndex * pageSize + 1}–${Math.min((pageIndex + 1) * pageSize, totalFiltered)} of ${totalFiltered} entries`}
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant={table.getCanPreviousPage() ? 'secondary' : 'outline'}
                size="sm"
                disabled={!table.getCanPreviousPage()}
                onClick={() => table.previousPage()}
                className="rounded-full"
              >
                ← Previous
              </Button>
              {Array.from({ length: pageCount }).map((_, i) => (
                <Button
                  key={i}
                  variant={pageIndex === i ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => table.setPageIndex(i)}
                  className="rounded-md"
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant={table.getCanNextPage() ? 'secondary' : 'outline'}
                size="sm"
                disabled={!table.getCanNextPage()}
                onClick={() => table.nextPage()}
                className="rounded-full"
              >
                Next →
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
