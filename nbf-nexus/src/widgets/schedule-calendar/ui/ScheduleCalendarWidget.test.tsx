import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ScheduleCalendarWidget } from './ScheduleCalendarWidget'
import { scheduleApi } from '@/entities/schedule/api/scheduleApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock dependencies
vi.mock('@/entities/schedule/api/scheduleApi')
// Mock FullCalendar as it's complex for JSDOM
vi.mock('@fullcalendar/react', () => ({
  default: vi.fn(() => <div data-testid="full-calendar">Mock Calendar</div>),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('ScheduleCalendarWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the calendar widget and show loading state', async () => {
    vi.mocked(scheduleApi.getSchedulesByMonth).mockResolvedValue([])

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <ScheduleCalendarWidget />
      </QueryClientProvider>
    )

    expect(screen.getByText(/master schedule/i)).toBeInTheDocument()
    expect(screen.getByText(/loading schedules.../i)).toBeInTheDocument()
  })

  it('should open the assignment modal when "Quick Assign" is clicked', async () => {
    vi.mocked(scheduleApi.getSchedulesByMonth).mockResolvedValue([])

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <ScheduleCalendarWidget />
      </QueryClientProvider>
    )

    const quickAssignBtn = screen.getByRole('button', { name: /quick assign/i })
    fireEvent.click(quickAssignBtn)

    await waitFor(() => {
      expect(screen.getByText(/assign trainee slot/i)).toBeInTheDocument()
    })
  })
})
