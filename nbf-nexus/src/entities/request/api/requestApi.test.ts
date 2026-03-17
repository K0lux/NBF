import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/shared/api/supabase', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
  }
  return {
    supabase: mockSupabase
  }
})

import { supabase } from '@/shared/api/supabase'
import { requestApi } from './requestApi'

const mockSupabase = supabase as any

describe('requestApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updateRequestStatus should update status and admin_comment', async () => {
    const mockRequest = { id: 'req1', status: 'APPROVED', admin_comment: 'Good' }
    mockSupabase.from.mockReturnThis()
    mockSupabase.update.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockRequest, error: null })

    const result = await requestApi.updateRequestStatus('req1', 'APPROVED', 'Good')

    expect(mockSupabase.from).toHaveBeenCalledWith('requests')
    expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
      status: 'APPROVED',
      admin_comment: 'Good',
    }))
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'req1')
    expect(result).toEqual(mockRequest)
  })

  it('updateAdminComment should only update admin_comment', async () => {
    const mockRequest = { id: 'req1', admin_comment: 'Updated' }
    mockSupabase.from.mockReturnThis()
    mockSupabase.update.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockRequest, error: null })

    const result = await requestApi.updateAdminComment('req1', 'Updated')

    expect(mockSupabase.from).toHaveBeenCalledWith('requests')
    expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
      admin_comment: 'Updated',
    }))
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'req1')
    expect(result).toEqual(mockRequest)
  })
})
