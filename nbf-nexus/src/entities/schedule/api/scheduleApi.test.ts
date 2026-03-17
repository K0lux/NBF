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
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
  }
  return {
    supabase: mockSupabase
  }
})

import { supabase } from '@/shared/api/supabase'
import { scheduleApi } from './scheduleApi'

const mockSupabase = supabase as any

describe('scheduleApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('getSchedulesByMonth should fetch and return schedules for a specific month', async () => {
    const mockSchedules = [
      { id: '1', scheduled_date: '2024-05-01', profile: { full_name: 'John Doe' } },
    ]

    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.gte.mockReturnThis()
    mockSupabase.lte.mockReturnThis()
    mockSupabase.order.mockResolvedValue({ data: mockSchedules, error: null })

    const result = await scheduleApi.getSchedulesByMonth(2024, 4) // May 2024

    expect(mockSupabase.from).toHaveBeenCalledWith('schedules')
    expect(mockSupabase.gte).toHaveBeenCalledWith('scheduled_date', '2024-05-01')
    expect(mockSupabase.lte).toHaveBeenCalledWith('scheduled_date', '2024-05-31')
    expect(result).toEqual(mockSchedules)
  })

  it('createScheduleEntry should insert and return a new schedule', async () => {
    const mockEntry = { id: 'new-id', profile_id: 'p1', scheduled_date: '2024-05-01', status: 'PLANNED' }

    mockSupabase.from.mockReturnThis()
    mockSupabase.insert.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockEntry, error: null })

    const result = await scheduleApi.createScheduleEntry('p1', '2024-05-01')

    expect(mockSupabase.from).toHaveBeenCalledWith('schedules')
    expect(mockSupabase.insert).toHaveBeenCalledWith({
      profile_id: 'p1',
      scheduled_date: '2024-05-01',
      status: 'PLANNED',
    })
    expect(result).toEqual(mockEntry)
  })

  it('deleteScheduleEntry should remove a schedule entry', async () => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.delete.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: null, error: null }) // Or just resolvedValue depending on implementation

    await scheduleApi.deleteScheduleEntry('id-123')

    expect(mockSupabase.from).toHaveBeenCalledWith('schedules')
    expect(mockSupabase.delete).toHaveBeenCalled()
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'id-123')
  })
})
