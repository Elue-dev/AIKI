import client from '@/lib/client'
import type { ApiEnvelope, KycStatusResponse, KycSubmission, KycDocument, KycDocumentPayload } from './types'
import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

export const getKycStatus = (): Promise<ApiEnvelope<KycStatusResponse>> =>
  client.get('/client/kyc')

export const startKyc = (type: 'PERSONAL' | 'BUSINESS'): Promise<ApiEnvelope<KycSubmission>> =>
  client.post('/client/kyc/start', { type })

/** stepNumber is 0-based (0, 1, 2). Wraps payload in { data: ... } as per API spec. */
export const submitKycStep = (
  stepNumber: number,
  data: Record<string, unknown>,
): Promise<ApiEnvelope<KycSubmission>> => client.put(`/client/kyc/step/${stepNumber}`, { data })

export const uploadKycDocument = ({ file, kycSubmissionId, type, step }: KycDocumentPayload): Promise<ApiEnvelope<KycDocument>> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('kycSubmissionId', kycSubmissionId)
  formData.append('type', type)
  formData.append('step', String(step))

  const token = useAuthStore.getState().accessToken
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/client/kyc/documents`,
    formData,
    { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } },
  ).then((res) => res.data)
}

export const deleteKycDocument = (id: string): Promise<void> =>
  client.del(`/client/kyc/documents/${id}`)

export const submitKyc = (): Promise<ApiEnvelope<KycSubmission>> =>
  client.post('/client/kyc/submit')
