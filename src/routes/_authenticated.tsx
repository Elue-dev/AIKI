import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthStore, useMe } from '@/stores/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()
  const { data: me } = useMe()

  // Keep the store user in sync with fresh /me data
  useEffect(() => {
    if (me?.user) setUser(me.user)
  }, [me, setUser])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/auth/login', replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return <Outlet />
}
