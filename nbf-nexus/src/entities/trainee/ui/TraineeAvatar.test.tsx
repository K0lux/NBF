import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { TraineeAvatar } from './TraineeAvatar'

describe('TraineeAvatar', () => {
  it('should render the full name and initials correctly', () => {
    render(<TraineeAvatar fullName="John Doe" />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('should handle single names for initials', () => {
    render(<TraineeAvatar fullName="John" />)

    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('should handle null full name gracefully', () => {
    render(<TraineeAvatar fullName={null} />)

    expect(screen.getByText('Unknown Trainee')).toBeInTheDocument()
    expect(screen.getByText('??')).toBeInTheDocument()
  })

  it('should handle multiple names and use first two for initials', () => {
    render(<TraineeAvatar fullName="John Jacob Jingleheimer Schmidt" />)

    expect(screen.getByText('John Jacob Jingleheimer Schmidt')).toBeInTheDocument()
    expect(screen.getByText('JJ')).toBeInTheDocument()
  })
})
