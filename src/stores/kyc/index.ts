import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  deleteKycDocument,
  getKycStatus,
  startKyc,
  submitKyc,
  submitKycStep,
  uploadKycDocument,
} from './api'

export const KYC_KEYS = {
  status: ['kyc', 'status'] as const,
}

export function useKycStatus() {
  return useQuery({
    queryKey: KYC_KEYS.status,
    queryFn: getKycStatus,
  })
}

export function useStartKyc() {
  return useMutation({
    mutationFn: (type: 'PERSONAL' | 'BUSINESS') => startKyc(type),
  })
}

export function useSubmitKycStep() {
  return useMutation({
    mutationFn: ({
      stepNumber,
      data,
    }: {
      stepNumber: number
      data: Record<string, unknown>
    }) => submitKycStep(stepNumber, data),
  })
}

export function useUploadKycDocument() {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type: string }) =>
      uploadKycDocument(file, type),
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
