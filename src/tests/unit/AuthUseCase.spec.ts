import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthUseCase } from '@/application/auth/AuthUseCase';
import { Result } from '@/lib/result';
import { mockSupabaseClient, createMockUser } from '@/tests/setup';

// Mock the Supabase creation functions
vi.mock('@/infrastructure/supabase/server', () => ({
  createClient: vi.fn(),
}));

describe('AuthUseCase', () => {
  let mockAuthClient: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthClient = mockSupabaseClient();
  });

  describe('signUp', () => {
    it('should successfully create a user and clinic', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      // Mock successful signup
      mockAuthClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-id' } },
        error: null,
      });

      // Mock successful RPC call
      mockAuthClient.rpc.mockResolvedValue({
        data: 'new-clinic-id',
        error: null,
      });

      // Mock refreshSession with delayed clinic_id in JWT
      let callCount = 0;
      mockAuthClient.auth.refreshSession.mockImplementation(async () => {
        callCount++;
        // Simulate JWT update on next call
        if (callCount >= 1) {
          mockAuthClient.auth.getUser.mockResolvedValue({
            data: { user: createMockUser({ app_metadata: { clinic_id: 'new-clinic-id' } }) },
            error: null,
          });
        }
      });

      mockAuthClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signUp(
        'test@example.com',
        'password123',
        'Test Clinic',
        'John',
        'Doe'
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.clinicId).toBe('new-clinic-id');
      }
    });

    it('should fail if auth.signUp fails', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signUp.mockResolvedValue({
        data: { user: null },
        error: { message: 'Email already exists' },
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signUp(
        'existing@example.com',
        'password123',
        'Test Clinic',
        'John',
        'Doe'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Email already exists');
      }
    });

    it('should fail if register_clinic RPC fails', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-id' } },
        error: null,
      });

      mockAuthClient.rpc.mockResolvedValue({
        data: null,
        error: { message: 'RPC error: clinic slug already exists' },
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signUp(
        'test@example.com',
        'password123',
        'Test Clinic',
        'John',
        'Doe'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('clinic slug already exists');
      }
    });

    it('should fail if clinic_id is not propagated to JWT after timeout', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signUp.mockResolvedValue({
        data: { user: { id: 'new-user-id' } },
        error: null,
      });

      mockAuthClient.rpc.mockResolvedValue({
        data: 'new-clinic-id',
        error: null,
      });

      mockAuthClient.auth.refreshSession.mockResolvedValue({});
      mockAuthClient.auth.getUser.mockResolvedValue({
        data: { user: { id: 'new-user-id', app_metadata: {} } }, // No clinic_id!
        error: null,
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signUp(
        'test@example.com',
        'password123',
        'Test Clinic',
        'John',
        'Doe'
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('JWT claims not updated');
      }
    });
  });

  describe('signIn', () => {
    it('should successfully sign in a user', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user-id' } },
        error: null,
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signIn('test@example.com', 'password123');

      expect(result.success).toBe(true);
    });

    it('should fail with invalid credentials', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null },
        error: { message: 'Invalid login credentials' },
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signIn('test@example.com', 'wrongpassword');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid login credentials');
      }
    });
  });

  describe('signOut', () => {
    it('should successfully sign out', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signOut.mockResolvedValue({ error: null });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signOut();

      expect(result.success).toBe(true);
    });

    it('should handle sign out errors', async () => {
      const { createClient } = await import('@/infrastructure/supabase/server');
      
      mockAuthClient.auth.signOut.mockResolvedValue({
        error: { message: 'Sign out failed' },
      });

      (createClient as any).mockResolvedValue(mockAuthClient);

      const result = await AuthUseCase.signOut();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Sign out failed');
      }
    });
  });
});
