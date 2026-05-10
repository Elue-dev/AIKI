import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteKycDocument,
  getKycStatus,
  registerKycDocument,
  startKyc,
  submitKyc,
  submitKycStep,
} from './api'
import type { KycDocumentPayload } from './types'
import { withSlowRequestTracking } from '@/helpers/track-slow-requests'

export const KYC_KEYS = {
  status: ['kyc', 'status'] as const,
}

/** Returns the full KycStatusResponse (submission + steps field data) */
export function useKycStatus(options?: { silent?: boolean }) {
  return useQuery({
    queryKey: KYC_KEYS.status,
    queryFn: () => withSlowRequestTracking(() => getKycStatus(), options),
    select: (res) => res.data,
  })
}

export function useStartKyc(options?: { silent?: boolean }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (type: 'PERSONAL' | 'BUSINESS') =>
      withSlowRequestTracking(() => startKyc(type), options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}

export function useSubmitKycStep(options?: { silent?: boolean }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      stepNumber,
      data,
    }: {
      stepNumber: number
      data: Record<string, unknown>
    }) => withSlowRequestTracking(() => submitKycStep(stepNumber, data), options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}

export function useRegisterKycDocument(options?: { silent?: boolean }) {
  return useMutation({
    mutationFn: (payload: KycDocumentPayload) =>
      withSlowRequestTracking(() => registerKycDocument(payload), options),
  })
}

export function useDeleteKycDocument(options?: { silent?: boolean }) {
  return useMutation({
    mutationFn: (id: string) =>
      withSlowRequestTracking(() => deleteKycDocument(id), options),
  })
}

export function useSubmitKyc(options?: { silent?: boolean }) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => withSlowRequestTracking(() => submitKyc(), options),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}
