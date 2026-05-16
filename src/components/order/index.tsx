import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { CatalogDevice } from '@/stores/catalog/types'
import type { CreatedOrder } from '@/stores/orders/types'
import { AppSheet } from '@/components/ui/app-sheet'
import { SummaryScreen } from './summary'
import { ConfirmedScreen } from './confirmation'

type Screen = 'summary' | 'confirmed'

interface OrderSummarySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: CatalogDevice | null
}

export function OrderSummarySheet({
  open,
  onOpenChange,
  device,
}: OrderSummarySheetProps) {
  const [screen, setScreen] = useState<Screen>('summary')
  const [tenure, setTenure] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [createdOrder, setCreatedOrder] = useState<CreatedOrder | null>(null)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setScreen('summary')
      setTenure('')
      setAgreed(false)
      setCreatedOrder(null)
    }, 300)
  }

  const handleConfirm = (order: CreatedOrder) => {
    setCreatedOrder(order)
    setScreen('confirmed')
  }

  if (!device) return null

  return (
    <AppSheet open={open} onClose={handleClose} width={480}>
      <AnimatePresence mode="wait">
        {screen === 'summary' ? (
          <motion.div
            key="summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex flex-col h-full"
          >
            <SummaryScreen
              device={device}
              tenure={tenure}
              onTenureChange={setTenure}
              agreed={agreed}
              onAgreeChange={setAgreed}
              onConfirm={handleConfirm}
              onCancel={handleClose}
            />
          </motion.div>
        ) : createdOrder ? (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col h-full"
          >
            <ConfirmedScreen
              order={createdOrder}
              onViewOrders={handleClose}
              onDone={handleClose}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </AppSheet>
  )
}
