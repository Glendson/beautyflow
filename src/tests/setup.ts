import { vi } from 'vitest';

/**
 * Vitest Setup File
 * Configures mocks and global test utilities for BeautyFlow tests
 */

// Mock Supabase Client
export const mockSupabaseClient = () => ({
  auth: {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    refreshSession: vi.fn(),
    getUser: vi.fn(() => Promise.resolve({ data: { user: null }, error: null })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
  from: vi.fn((table: string) => ({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lt: vi.fn().mockReturnThis(),
    single: vi.fn(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
  })),
  rpc: vi.fn(),
});

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT: ${path}`);
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    refresh: vi.fn(),
  })),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  usePathname: vi.fn(() => '/'),
}));

// Global test utilities
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const createMockUser = (overrides?: Partial<unknown>) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {},
  app_metadata: {
    clinic_id: 'test-clinic-id',
    ...overrides?.app_metadata,
  },
  ...overrides,
});

export const createMockClinic = (overrides?: Partial<never>) => ({
  id: 'test-clinic-id',
  name: 'Test Clinic',
  slug: 'test-clinic',
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

export const createMockAppointment = (overrides?: Partial<never>) => ({
  id: 'test-appointment-id',
  clinic_id: 'test-clinic-id',
  service_id: 'test-service-id',
  employee_id: 'test-employee-id',
  client_id: 'test-client-id',
  start_time: '2026-03-21T10:00:00Z',
  end_time: '2026-03-21T11:00:00Z',
  status: 'scheduled',
  notes: '',
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

export const createMockService = (overrides?: Partial<never>) => ({
  id: 'test-service-id',
  clinic_id: 'test-clinic-id',
  name: 'Test Service',
  category_id: 'test-category-id',
  duration: 60,
  price: 100,
  description: '',
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

export const createMockEmployee = (overrides?: Partial<never>) => ({
  id: 'test-employee-id',
  clinic_id: 'test-clinic-id',
  name: 'Test Employee',
  email: 'employee@example.com',
  phone: '555-0000',
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

export const createMockRoom = (overrides?: Partial<any>) => ({
  id: 'test-room-id',
  clinic_id: 'test-clinic-id',
  name: 'Test Room',
  type: 'room' as const,
  capacity: 1,
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

export const createMockClient = (overrides?: Partial<any>) => ({
  id: 'test-client-id',
  clinic_id: 'test-clinic-id',
  name: 'Test Client',
  email: 'client@example.com',
  phone: '555-1111',
  created_at: '2026-03-21T00:00:00Z',
  ...overrides,
});

// Result<T> assertion helpers
export const expectResultSuccess = (result: any, expectedValue?: any) => {
  if (!result.success) {
    throw new Error(`Expected success result, but got error: ${result.error}`);
  }
  if (expectedValue !== undefined && result.data !== expectedValue) {
    throw new Error(`Expected data ${expectedValue}, but got ${result.data}`);
  }
};

export const expectResultFail = (result: any, expectedError?: string) => {
  if (result.success) {
    throw new Error(`Expected failed result, but got success: ${JSON.stringify(result.data)}`);
  }
  if (expectedError && !result.error.includes(expectedError)) {
    throw new Error(`Expected error containing "${expectedError}", but got "${result.error}"`);
  }
};
