import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MySchedulePage from './page'
import { scheduleApi } from '@/entities/schedule/api/scheduleApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock dependencies
vi.mock('@/entities/schedule/api/scheduleApi')
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: { id: 'user1', fullName: 'Test User' },
    isLoaded: true,
    isSignedIn: true,
  }),
  useAuth: () => ({
    userId: 'user1',
    isLoaded: true,
    isSignedIn: true,
  }),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

describe('MySchedulePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the loading state then the schedule list', async () => {
    const mockSchedules = [
      { id: 's1', scheduled_date: '2024-05-01', status: 'PLANNED', profile: { full_name: 'Me' } },
    ]
    vi.mocked(scheduleApi.getSchedulesByMonth).mockResolvedValue(mockSchedules as any)

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MySchedulePage />
      </QueryClientProvider>
    )

    expect(screen.getByText(/loading your schedule.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText(/wednesday, may 1st, 2024/i)).toBeInTheDocument()
      expect(screen.getByText('PLANNED')).toBeInTheDocument()
    })
  })

  it('should show empty state if no schedules found', async () => {
    vi.mocked(scheduleApi.getSchedulesByMonth).mockResolvedValue([])

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <MySchedulePage />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/no assignments found for this month/i)).toBeInTheDocument()
    })
  })
})
