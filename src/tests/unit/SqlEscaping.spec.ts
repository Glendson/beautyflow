import { describe, it, expect } from 'vitest';
import { escapeLike, validateSearchInput } from '@/lib/sql-escaping';

describe('SQL Escaping Utilities', () => {
  describe('escapeLike', () => {
    it('should escape % character', () => {
      expect(escapeLike('50%')).toBe('50\\%');
    });

    it('should escape _ character', () => {
      expect(escapeLike('test_value')).toBe('test\\_value');
    });

    it('should escape both % and _ characters', () => {
      expect(escapeLike('test_50%')).toBe('test\\_50\\%');
    });

    it('should not escape other characters', () => {
      expect(escapeLike('hello world')).toBe('hello world');
      expect(escapeLike('test@domain.com')).toBe('test@domain.com');
    });

    it('should handle empty string', () => {
      expect(escapeLike('')).toBe('');
    });

    it('should prevent SQL injection in LIKE patterns', () => {
      // Malicious input trying to find all records
      const malicious = '%';
      const escaped = escapeLike(malicious);
      expect(escaped).toBe('\\%');
      
      // When used in LIKE, it will search for literal %
      const escapedInput = `%${escaped}%`;
      expect(escapedInput).toBe('%\\%%');
    });
  });

  describe('validateSearchInput', () => {
    it('should accept valid search strings', () => {
      expect(validateSearchInput('john')).toBe('john');
      expect(validateSearchInput('john@example.com')).toBe('john@example.com');
    });

    it('should trim whitespace', () => {
      expect(validateSearchInput('  john  ')).toBe('john');
    });

    it('should return null for empty strings', () => {
      expect(validateSearchInput('')).toBeNull();
      expect(validateSearchInput('   ')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateSearchInput(undefined)).toBeNull();
    });

    it('should truncate strings exceeding max length', () => {
      const longString = 'a'.repeat(150);
      const result = validateSearchInput(longString, 100);
      expect(result).toBe('a'.repeat(100));
    });

    it('should use default max length of 100', () => {
      const input = 'a'.repeat(150);
      const result = validateSearchInput(input);
      expect(result?.length).toBeLessThanOrEqual(100);
    });

    it('should handle special characters safely', () => {
      expect(validateSearchInput('50%')).toBe('50%');
      expect(validateSearchInput('test_value')).toBe('test_value');
    });
  });
});
