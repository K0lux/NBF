import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EditTraineeForm } from './EditTraineeForm'
import { traineeApi } from '@/entities/trainee/api/traineeApi'
import { Trainee } from '@/entities/trainee/model/types'
import { toast } from 'sonner'

// Mock dependencies
vi.mock('@/entities/trainee/api/traineeApi')
vi.mock('sonner')

const mockTrainee: Trainee = {
  id: '1',
  clerk_id: 'user_1',
  full_name: 'John Doe',
  email: 'john@example.com',
  specialty: 'DEV',
  intern_type: 'ON_SITE',
  start_date: '2024-01-01',
  end_date: '2024-06-01',
  role: 'trainee',
  created_at: '',
  updated_at: '',
}

describe('EditTraineeForm', () => {
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should call traineeApi.updateTraineeMetadata and call onSuccess upon successful submission', async () => {
    vi.mocked(traineeApi.updateTraineeMetadata).mockResolvedValue({ ...mockTrainee, specialty: 'AI' })

    render(<EditTraineeForm trainee={mockTrainee} onSuccess={mockOnSuccess} />)

    // Find submit button and click
    const submitButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(traineeApi.updateTraineeMetadata).toHaveBeenCalledWith('1', {
        specialty: 'DEV', // default values from mockTrainee
        intern_type: 'ON_SITE',
      })
      expect(toast.success).toHaveBeenCalledWith('Trainee updated successfully')
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should show error toast upon failed submission', async () => {
    vi.mocked(traineeApi.updateTraineeMetadata).mockRejectedValue(new Error('Update failed'))

    render(<EditTraineeForm trainee={mockTrainee} onSuccess={mockOnSuccess} />)

    const submitButton = screen.getByRole('button', { name: /save changes/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to update trainee')
      expect(mockOnSuccess).not.toHaveBeenCalled()
    })
  })
})
