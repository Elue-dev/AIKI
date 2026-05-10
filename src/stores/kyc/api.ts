import client from '@/lib/client'
import type { KycStatus, KycDocument } from './types'

export const getKycStatus = (): Promise<KycStatus> => client.get('/client/kyc')

export const startKyc = (type: 'PERSONAL' | 'BUSINESS'): Promise<void> =>
  client.post('/client/kyc/start', { type })

export const submitKycStep = (
  stepNumber: number,
  data: Record<string, unknown>,
): Promise<void> => client.put(`/client/kyc/step/${stepNumber}`, data)

export const uploadKycDocument = (
  file: File,
  type: string,
): Promise<KycDocument> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  return client.post('/client/kyc/documents', formData)
}

export const deleteKycDocument = (id: string): Promise<void> =>
  client.del(`/client/kyc/documents/${id}`)

export const submitKyc = (): Promise<void> => client.post('/client/kyc/submit')
