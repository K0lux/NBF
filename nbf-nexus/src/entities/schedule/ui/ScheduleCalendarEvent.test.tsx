import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ScheduleCalendarEvent } from './ScheduleCalendarEvent'
import { ScheduleWithTrainee } from '../model/types'

const mockSchedule: ScheduleWithTrainee = {
  id: 's1',
  profile_id: 'p1',
  scheduled_date: '2024-05-01',
  status: 'PLANNED',
  created_at: '',
  profile: {
    id: 'p1',
    full_name: 'John Doe',
    email: 'john@example.com',
    specialty: 'DEV',
  },
}

describe('ScheduleCalendarEvent', () => {
  it('should display the trainee name and specialty', () => {
    render(<ScheduleCalendarEvent schedule={mockSchedule} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('DEV')).toBeInTheDocument()
  })

  it('should apply correct styling based on specialty', () => {
    const aiSchedule: ScheduleWithTrainee = {
      ...mockSchedule,
      profile: { ...mockSchedule.profile, specialty: 'AI' },
    }
    
    const { container } = render(<ScheduleCalendarEvent schedule={aiSchedule} />)
    
    const eventDiv = container.firstChild as HTMLElement
    expect(eventDiv).toHaveClass('bg-purple-100')
    expect(eventDiv).toHaveClass('text-purple-800')
  })

  it('should apply fallback styling for unknown specialty', () => {
    const unknownSchedule: ScheduleWithTrainee = {
      ...mockSchedule,
      profile: { ...mockSchedule.profile, specialty: null as any },
    }
    
    const { container } = render(<ScheduleCalendarEvent schedule={unknownSchedule} />)
    
    const eventDiv = container.firstChild as HTMLElement
    expect(eventDiv).toHaveClass('bg-blue-100') // DEV fallback
  })
})
