import '@testing-library/jest-dom'
import { vi } from 'vitest'
import { TextEncoder, TextDecoder } from 'util'

// Add TextEncoder and TextDecoder to global for jsdom
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock environment variables before imports
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key'
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'mock-clerk-key'
process.env.CLERK_SECRET_KEY = 'mock-clerk-secret'
process.env.JWT_SECRET = 'mock-jwt-secret'

// Mock matchMedia for Radix UI
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })

  // Mock ResizeObserver
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver
}
