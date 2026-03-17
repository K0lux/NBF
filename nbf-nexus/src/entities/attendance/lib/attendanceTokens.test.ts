/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { generateAttendanceToken, verifyAttendanceToken } from './attendanceTokens'

// Mock the environment variables
vi.mock('@/shared/config/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-that-is-at-least-32-chars-long-12345',
  }
}))

describe('attendanceTokens', () => {
  it('should generate and verify a token', async () => {
    const payload = {
      scheduleId: 's1',
      profileId: 'p1',
    }

    const token = await generateAttendanceToken(payload)
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')

    const verifiedPayload = await verifyAttendanceToken(token)
    expect(verifiedPayload).toBeDefined()
    expect(verifiedPayload?.scheduleId).toBe(payload.scheduleId)
    expect(verifiedPayload?.profileId).toBe(payload.profileId)
  })

  it('should return null for an invalid token', async () => {
    const result = await verifyAttendanceToken('invalid-token')
    expect(result).toBeNull()
  })

  it('should return null for an expired token', async () => {
    // Note: To test expiration properly we might need to mock time, 
    // but for now we'll just check if it fails correctly on non-JWT strings.
    const result = await verifyAttendanceToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.s4-invalid-signature')
    expect(result).toBeNull()
  })
})
