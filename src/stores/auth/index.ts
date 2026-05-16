import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as authApi from './api'
import type {
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthState,
} from './types'
import { withSlowRequestTracking } from '@/helpers/track-slow-requests'

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      pendingEmail: null,
      pendingToken: null,
      pendingRefreshToken: null,
      setTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken, isAuthenticated: true })
      },
      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: true })
      },
      setUser: (user) => set({ user }),
      setPendingEmail: (email) => set({ pendingEmail: email }),
      setPendingVerification: (email, token, refreshToken) =>
        set({ pendingEmail: email, pendingToken: token, pendingRefreshToken: refreshToken ?? null }),
      confirmVerified: () =>
        set((s) => ({
          // only promote pending tokens when we're not already authenticated
          ...(s.pendingToken
            ? { accessToken: s.pendingToken, refreshToken: s.pendingRefreshToken }
            : {}),
          isAuthenticated: true,
          pendingEmail: null,
          pendingToken: null,
          pendingRefreshToken: null,
        })),
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
          pendingEmail: null,
          pendingToken: null,
          pendingRefreshToken: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({
        isAuthenticated: s.isAuthenticated,
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        pendingEmail: s.pendingEmail,
        pendingToken: s.pendingToken,
        pendingRefreshToken: s.pendingRefreshToken,
      }),
    },
  ),
)

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
}

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: AUTH_KEYS.me,
    queryFn: authApi.getMe,
    select: (res) => res.data,
    enabled: isAuthenticated,
  })
}

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      withSlowRequestTracking(() => authApi.login(payload)),
    onSuccess: (res) => {
      const user = res.data.user
      if (user.role !== 'PERSONAL_CLIENT') {
        throw new Error(
          user.role === 'VENDOR' || user.role === 'VENDOR_EMPLOYEE'
            ? 'This account is a merchant account. Please use the merchant dashboard to sign in.'
            : 'Your account is not authorized to access this app.',
        )
      }
      setTokens(res.data.accessToken, res.data.refreshToken)
      setUser(user)
    },
    onError: () => {},
  })
}

export function useRegister() {
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)
  const setPendingEmail = useAuthStore((s) => s.setPendingEmail)

  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      withSlowRequestTracking(() => authApi.register(payload)),
    onSuccess: (res) => {
      setTokens(res.data.accessToken, res.data.refreshToken)
      setUser(res.data.user)
      setPendingEmail(res.data.user.email)
    },
  })
}

export function useVerifyEmail() {
  const confirmVerified = useAuthStore((s) => s.confirmVerified)
  const setUser = useAuthStore((s) => s.setUser)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) =>
      withSlowRequestTracking(() => authApi.verifyEmail(payload)),
    onSuccess: (res) => {
      confirmVerified()
      if (res?.data?.user) setUser(res.data.user)
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me })
    },
  })
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => withSlowRequestTracking(() => authApi.logout()),
    onSuccess: () => {
      logout()
      queryClient.clear()
    },
    onError: () => {
      logout()
      queryClient.clear()
    },
  })
}

export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) =>
      withSlowRequestTracking(() => authApi.resendVerification({ email })),
  })
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      withSlowRequestTracking(() => authApi.forgotPassword(payload)),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      withSlowRequestTracking(() => authApi.resetPassword(payload)),
  })
}
