import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AdminRequestListWidget } from './AdminRequestListWidget'
import { requestApi } from '@/entities/request/api/requestApi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock the API
vi.mock('@/entities/request/api/requestApi')

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const mockRequests = [
  { 
    id: 'req1', 
    title: 'Holiday Request', 
    description: 'Need a day off', 
    type: 'SCHEDULE_CHANGE',
    status: 'APPROVED',
    admin_comment: 'Enjoy!',
    profile: { full_name: 'John Doe', email: 'john@example.com' },
    created_at: new Date().toISOString()
  },
]

describe('AdminRequestListWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render requests and allow editing comments', async () => {
    vi.mocked(requestApi.getAllRequests).mockResolvedValue(mockRequests as any)

    const queryClient = createTestQueryClient()
    render(
      <QueryClientProvider client={queryClient}>
        <AdminRequestListWidget />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('Holiday Request')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Enjoy!')).toBeInTheDocument()
    })

    // Click edit
    const editButton = screen.getByLabelText('Edit comment')
    fireEvent.click(editButton)

    // Check if input appears with current comment
    const input = screen.getByDisplayValue('Enjoy!')
    expect(input).toBeInTheDocument()

    // Change input
    fireEvent.change(input, { target: { value: 'Updated Comment' } })

    // Click save
    const saveButton = screen.getByText('Save Changes')
    fireEvent.click(saveButton)

    // Verify API call
    expect(requestApi.updateAdminComment).toHaveBeenCalledWith('req1', 'Updated Comment')
  })
})
