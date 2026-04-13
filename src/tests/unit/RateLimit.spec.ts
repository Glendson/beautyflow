import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Clear rate limit store before each test
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-key', 5, 3600000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should allow requests within limit', () => {
      const key = 'test-key';
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(key, 5, 3600000);
        expect(result.success).toBe(true);
      }
    });

    it('should deny requests exceeding limit', () => {
      const key = 'test-key';
      // Make 5 requests (at limit)
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, 3600000);
      }
      // 6th request should be denied
      const result = checkRateLimit(key, 5, 3600000);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfterSeconds).toBeDefined();
    });

    it('should reset after time window expires', () => {
      const key = 'test-key';
      const windowMs = 3600000;

      // Make max requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, windowMs);
      }
      
      // Should be denied
      expect(checkRateLimit(key, 5, windowMs).success).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(windowMs + 1000);

      // Should be allowed again
      const result = checkRateLimit(key, 5, windowMs);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should track separate keys independently', () => {
      const result1 = checkRateLimit('key1', 2, 3600000);
      const result2 = checkRateLimit('key2', 2, 3600000);
      
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.remaining).toBe(1);
      expect(result2.remaining).toBe(1);
    });
  });

  describe('resetRateLimit', () => {
    it('should reset rate limit for a key', () => {
      const key = 'test-key';
      
      // Hit rate limit
      for (let i = 0; i < 5; i++) {
        checkRateLimit(key, 5, 3600000);
      }
      expect(checkRateLimit(key, 5, 3600000).success).toBe(false);

      // Reset
      resetRateLimit(key);

      // Should be allowed again
      const result = checkRateLimit(key, 5, 3600000);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(4);
    });
  });

  describe('Security Scenarios', () => {
    it('should protect against brute force login attempts', () => {
      const email = 'attacker@example.com';
      const maxAttempts = 5;
      const windowMs = 1000; // 1 second for testing

      let blocked = false;
      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(`login:${email}`, maxAttempts, windowMs);
        if (!result.success) {
          blocked = true;
          break;
        }
      }

      expect(blocked).toBe(true);
    });

    it('should allow legitimate traffic', () => {
      const email = 'user@example.com';
      const result1 = checkRateLimit(`login:${email}`, 5, 3600000);
      expect(result1.success).toBe(true);
    });

    it('should enforce different limits for signup vs login', () => {
      const email = 'user@example.com';

      // Login: 5 attempts
      for (let i = 0; i < 5; i++) {
        checkRateLimit(`login:${email}`, 5, 3600000);
      }
      expect(checkRateLimit(`login:${email}`, 5, 3600000).success).toBe(false);

      // Signup: 3 attempts (separate counter)
      for (let i = 0; i < 3; i++) {
        checkRateLimit(`signup:${email}`, 3, 3600000);
      }
      expect(checkRateLimit(`signup:${email}`, 3, 3600000).success).toBe(false);
      
      // But login is still blocked (separate)
      expect(checkRateLimit(`login:${email}`, 5, 3600000).success).toBe(false);
    });
  });
});
