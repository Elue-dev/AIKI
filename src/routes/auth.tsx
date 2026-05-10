import { createFileRoute, Outlet, useNavigate, useRouterState } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
})

function AuthLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()
  const { location } = useRouterState()
  const isVerifyPath = location.pathname === '/auth/verify'

  useEffect(() => {
    if (isAuthenticated && !isVerifyPath) {
      navigate({ to: '/', replace: true })
    }
  }, [isAuthenticated, navigate, isVerifyPath])

  if (isAuthenticated && !isVerifyPath) return null

  return <Outlet />
}
