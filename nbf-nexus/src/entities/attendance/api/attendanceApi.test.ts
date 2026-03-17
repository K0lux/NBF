import { describe, it, expect, beforeEach, vi } from 'vitest'

vi.mock('@/shared/api/supabase', () => {
  const mockSupabase = {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  }
  return {
    supabase: mockSupabase
  }
})

import { supabase } from '@/shared/api/supabase'
import { attendanceApi } from './attendanceApi'

const mockSupabase = supabase as any

describe('attendanceApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('checkIn should upsert and return attendance', async () => {
    const mockAttendance = { id: 'a1', schedule_id: 's1', profile_id: 'p1', check_in_at: '2024-05-26T10:00:00Z', check_in_method: 'QR_CODE' }

    mockSupabase.from.mockReturnThis()
    mockSupabase.upsert.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockAttendance, error: null })

    const result = await attendanceApi.checkIn('s1', 'p1', 'QR_CODE')

    expect(mockSupabase.from).toHaveBeenCalledWith('attendances')
    expect(mockSupabase.upsert).toHaveBeenCalledWith(expect.objectContaining({
      schedule_id: 's1',
      profile_id: 'p1',
      check_in_method: 'QR_CODE',
    }))
    expect(result).toEqual(mockAttendance)
  })

  it('checkOut should update and return attendance', async () => {
    const mockAttendance = { id: 'a1', schedule_id: 's1', profile_id: 'p1', check_out_at: '2024-05-26T18:00:00Z', check_out_method: 'GEO' }

    mockSupabase.from.mockReturnThis()
    mockSupabase.update.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.single.mockResolvedValue({ data: mockAttendance, error: null })

    const result = await attendanceApi.checkOut('a1', 'GEO')

    expect(mockSupabase.from).toHaveBeenCalledWith('attendances')
    expect(mockSupabase.update).toHaveBeenCalledWith(expect.objectContaining({
      check_out_method: 'GEO',
    }))
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'a1')
    expect(result).toEqual(mockAttendance)
  })

  it('getAttendanceByScheduleId should return attendance or null', async () => {
    const mockAttendance = { id: 'a1', schedule_id: 's1' }

    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.eq.mockReturnThis()
    mockSupabase.maybeSingle.mockResolvedValue({ data: mockAttendance, error: null })

    const result = await attendanceApi.getAttendanceByScheduleId('s1')

    expect(mockSupabase.from).toHaveBeenCalledWith('attendances')
    expect(mockSupabase.eq).toHaveBeenCalledWith('schedule_id', 's1')
    expect(result).toEqual(mockAttendance)
  })

  it('getFilteredAttendances should apply filters correctly', async () => {
    mockSupabase.from.mockReturnThis()
    mockSupabase.select.mockReturnThis()
    mockSupabase.gte = vi.fn().mockReturnThis()
    mockSupabase.lte = vi.fn().mockReturnThis()
    mockSupabase.eq = vi.fn().mockReturnThis()
    mockSupabase.order.mockResolvedValue({ data: [], error: null })

    await attendanceApi.getFilteredAttendances({
      startDate: '2024-05-01',
      endDate: '2024-05-31',
      profileId: 'p1',
      specialty: 'DEV'
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('attendances')
    expect(mockSupabase.gte).toHaveBeenCalledWith('schedule.scheduled_date', '2024-05-01')
    expect(mockSupabase.lte).toHaveBeenCalledWith('schedule.scheduled_date', '2024-05-31')
    expect(mockSupabase.eq).toHaveBeenCalledWith('profile_id', 'p1')
    expect(mockSupabase.eq).toHaveBeenCalledWith('profile.specialty', 'DEV')
  })
})
