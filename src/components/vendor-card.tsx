import { useState } from 'react'
import type { CatalogDevice } from '@/stores/catalog/types'
import { Button } from './ui/button'
import CheckMark from '@/assets/svg/verify.svg'
import { Separator } from './ui/separator'
import { OrderSummarySheet } from './order'

export function VendorCard({ device }: { device: CatalogDevice }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const image = device.images[0]?.url

  return (
    <>
      <div
        onClick={() => setSheetOpen(true)}
        className="border border-gray-200 rounded-[14px] overflow-hidden hover:shadow-md transition-all flex flex-col bg-white cursor-pointer"
      >
        <div className="w-full h-35 overflow-hidden bg-gray-50">
          {image ? (
            <img src={image} alt={device.images[0]?.altText ?? device.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
              No image
            </div>
          )}
        </div>
        <div className="p-3.5 flex flex-col flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[18px] font-semibold text-dark">{device.name}</span>
            <img src={CheckMark} className="h-4 w-4" />
          </div>
          <p className="text-[11px] text-gray-400 mb-1">{device.vendor.name}</p>
          <p className="text-[14px] text-gray300 leading-snug mb-3 line-clamp-2">
            {device.model}
          </p>
          <Separator />
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[12px] text-gray200">Starting from</p>
              <p className="text-[20px] font-medium text-[#151D0C]">
                ₦{(device.priceKobo / 100).toLocaleString()}
              </p>
            </div>
            <Button
              onClick={() => setSheetOpen(true)}
              variant="secondary"
              size="sm"
            >
              View →
            </Button>
          </div>
        </div>
      </div>

      <OrderSummarySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        device={device}
      />
    </>
  )
}
