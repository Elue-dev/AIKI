import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) return null

  return <Outlet />
}
