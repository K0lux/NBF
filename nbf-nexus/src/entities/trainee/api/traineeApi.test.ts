import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/shared/api/supabase', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    match: vi.fn().mockReturnThis(),
  }
  return {
    supabase: mockSupabase
  }
})

// Need to import AFTER mocking
import { supabase } from '@/shared/api/supabase'
import { traineeApi } from './traineeApi'

const mockSupabase = supabase as any

describe('traineeApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getTrainees should return a list of trainees', async () => {
    const mockTrainees = [
      { id: '1', full_name: 'John Doe', email: 'john@example.com' },
      { id: '2', full_name: 'Jane Smith', email: 'jane@example.com' },
    ]

    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.order.mockResolvedValue({ data: mockTrainees, error: null })

    const trainees = await traineeApi.getTrainees()

    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(trainees).toEqual(mockTrainees)
  })

  it('updateTraineeMetadata should update and return the trainee', async () => {
    const traineeId = '1'
    const updates = { specialty: 'DEV' as const }
    const updatedTraine = { id: '1', full_name: 'John Doe', specialty: 'DEV' }

    mockSupabase.from.mockReturnThis()
    mockSupabase.update.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: updatedTraine, error: null })

    const result = await traineeApi.updateTraineeMetadata(traineeId, updates)

    expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
    expect(mockSupabase.update).toHaveBeenCalledWith(updates)
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', traineeId)
    expect(result).toEqual(updatedTraine)
  })

  it('should throw error when Supabase call fails', async () => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.order.mockResolvedValue({ data: null, error: { message: 'DB Error' } })

    await expect(traineeApi.getTrainees()).rejects.toThrow('Failed to fetch trainees')
  })
})
