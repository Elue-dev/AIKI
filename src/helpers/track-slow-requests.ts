import { useLoaderStore } from '@/stores/loader'

const SLOW_THRESHOLD_MS = 4000

export async function withSlowRequestTracking<T>(
  fn: () => Promise<T>,
  slowThreshold = SLOW_THRESHOLD_MS,
): Promise<T> {
  const { setShowLoader, setShowSlowMessage } = useLoaderStore.getState()

  setShowLoader(true)

  const slowTimer = setTimeout(() => {
    setShowSlowMessage(true)
  }, slowThreshold)

  try {
    return await fn()
  } finally {
    clearTimeout(slowTimer)
    setShowLoader(false)
    setShowSlowMessage(false)
  }
}
