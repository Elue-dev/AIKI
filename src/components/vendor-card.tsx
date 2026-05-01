import { useState } from 'react'
import type { Vendor } from '@/data/vendors'
import { Button } from './ui/button'
import CheckMark from '@/assets/svg/verify.svg'
import { Separator } from './ui/separator'
import { OrderSummarySheet } from './order'

interface VendorCardProps extends Vendor {
  onView?: () => void
}

export function VendorCard({
  name,
  desc,
  price,
  verified,
  image,
  category,
}: VendorCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const vendor: Vendor = { name, desc, price, verified, image, category }

  return (
    <>
      <div
        onClick={() => setSheetOpen(true)}
        className="border border-gray-200 rounded-[14px] overflow-hidden hover:shadow-md transition-all flex flex-col bg-white cursor-pointer"
      >
        <div className="w-full h-35 overflow-hidden bg-gray-50">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="p-3.5 flex flex-col flex-1">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[18px] font-semibold text-dark">{name}</span>
            {verified && <img src={CheckMark} className="h-4 w-4" />}
          </div>
          <p className="text-[14px] text-gray300 leading-snug mb-3 line-clamp-2">
            {desc}
          </p>
          <Separator />
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[12px] text-gray200">Starting from</p>
              <p className="text-[20px] font-medium text-[#151D0C]">{price}</p>
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
        vendor={vendor}
      />
    </>
  )
}
