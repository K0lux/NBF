import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TraineeManagementWidget } from './TraineeManagementWidget'
import { traineeApi } from '@/entities/trainee/api/traineeApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the API
vi.mock('@/entities/trainee/api/traineeApi')

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockTrainees = [
  { 
    id: '1', 
    full_name: 'John Doe', 
    email: 'john@example.com', 
    specialty: 'DEV', 
    intern_type: 'ON_SITE',
    role: 'trainee'
  },
]

describe('TraineeManagementWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show loading state and then display trainees', async () => {
    vi.mocked(traineeApi.getTrainees).mockResolvedValue(mockTrainees as any)

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <TraineeManagementWidget />
      </QueryClientProvider>
    )

    expect(screen.getByText(/loading trainees.../i)).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })
  })

  it('should show error state if API fails', async () => {
    vi.mocked(traineeApi.getTrainees).mockRejectedValue(new Error('API Error'))

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <TraineeManagementWidget />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText(/error loading trainees/i)).toBeInTheDocument()
    })
  })
})
