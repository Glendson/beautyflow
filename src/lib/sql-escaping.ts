/**
 * SQL Query Escaping Utilities
 * 
 * Provides safe escaping for SQL LIKE patterns to prevent injection attacks
 */

/**
 * Escape special characters in SQL LIKE patterns
 * Prevents injection of % and _ wildcards
 * 
 * @param value - The input string to escape
 * @returns Escaped string safe for LIKE patterns
 * 
 * @example
 * escapeLike("50%") → "50\\%"
 * escapeLike("test_value") → "test\\_value"
 */
export function escapeLike(value: string): string {
  if (!value) return '';
  // Escape % and _ with backslash
  return value.replace(/[%_]/g, '\\$&');
}

/**
 * Validate and sanitize search input
 * 
 * @param search - The search string to validate
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Validated and trimmed search string, or null if invalid
 */
export function validateSearchInput(
  search: string | undefined,
  maxLength: number = 100
): string | null {
  if (!search || typeof search !== 'string') return null;
  
  const trimmed = search.trim();
  if (trimmed.length === 0) return null;
  if (trimmed.length > maxLength) return trimmed.substring(0, maxLength).trim();
  
  return trimmed;
}
