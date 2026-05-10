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

export const KYC_KEYS = {
  status: ['kyc', 'status'] as const,
}

/** Returns the full KycStatusResponse (submission + steps field data) */
export function useKycStatus() {
  return useQuery({
    queryKey: KYC_KEYS.status,
    queryFn: getKycStatus,
    select: (res) => res.data,
  })
}

export function useStartKyc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (type: 'PERSONAL' | 'BUSINESS') => startKyc(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}

export function useSubmitKycStep() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      stepNumber,
      data,
    }: {
      stepNumber: number
      data: Record<string, unknown>
    }) => submitKycStep(stepNumber, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}

export function useRegisterKycDocument() {
  return useMutation({
    mutationFn: (payload: KycDocumentPayload) => registerKycDocument(payload),
  })
}

export function useDeleteKycDocument() {
  return useMutation({
    mutationFn: (id: string) => deleteKycDocument(id),
  })
}

export function useSubmitKyc() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitKyc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KYC_KEYS.status })
    },
  })
}
