import { Request, RequestType, RequestStatus, RequestWithTrainee } from '../model/types';

export const requestApi = {
  async createRequest(
    _supabase: unknown,
    profileId: string, 
    type: RequestType, 
    title: string, 
    description: string, 
    metadata: Record<string, any> = {}
  ): Promise<Request> {
    const response = await fetch('/api/requests/my', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, type, title, description, metadata }),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('Error in requestApi:', message)
      throw new Error(`Failed to process request: ${message}`)
    }

    return (await response.json()) as Request
  },

  async getMyRequests(_supabase: unknown, _profileId: string): Promise<Request[]> {
    const response = await fetch('/api/requests/my')

    if (!response.ok) {
      const message = await response.text()
      console.error('Error in requestApi:', message)
      throw new Error(`Failed to process request: ${message}`)
    }

    return (await response.json()) as Request[]
  },

  async getAllRequests(_supabase: unknown): Promise<RequestWithTrainee[]> {
    const response = await fetch('/api/requests/admin')

    if (!response.ok) {
      const message = await response.text()
      console.error('Error in requestApi:', message)
      throw new Error(`Failed to process request: ${message}`)
    }

    return (await response.json()) as RequestWithTrainee[]
  },

  async updateRequestStatus(
    _supabase: unknown,
    requestId: string, 
    status: RequestStatus, 
    adminComment?: string
  ): Promise<Request> {
    const response = await fetch(`/api/requests/admin/${requestId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminComment }),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('Error in requestApi:', message)
      throw new Error(`Failed to process request: ${message}`)
    }

    return (await response.json()) as Request
  },

  async updateAdminComment(
    _supabase: unknown,
    requestId: string,
    adminComment: string
  ): Promise<Request> {
    const response = await fetch(`/api/requests/admin/${requestId}/comment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminComment }),
    })

    if (!response.ok) {
      const message = await response.text()
      console.error('Error in requestApi:', message)
      throw new Error(`Failed to process request: ${message}`)
    }

    return (await response.json()) as Request
  },
};
