/**
 * Logger utility - Conditional logging (dev-only)
 * 
 * Usage:
 * logger.info("User signup started");
 * logger.error("Auth failed", error);
 * logger.debug("User ID", userId); // Only in dev
 * 
 * Automatically disabled in production for:
 * - Security (no exposed PII/IDs)
 * - Performance (no console I/O)
 * - GDPR compliance (no data logging)
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  /**
   * Log info-level messages (dev only)
   */
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.info(`[BeautyFlow] ${message}`, data ? JSON.stringify(data) : '');
    }
  },

  /**
   * Log debug messages (dev only, most verbose)
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.debug(`[BeautyFlow:DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
  },

  /**
   * Log warnings (always logged, never exposes data)
   */
  warn: (message: string) => {
    console.warn(`[BeautyFlow:WARN] ${message}`);
  },

  /**
   * Log errors (always logged, but never exposes sensitive data)
   */
  error: (message: string, error?: Error | unknown) => {
    if (error instanceof Error) {
      console.error(`[BeautyFlow:ERROR] ${message}:`, error.message);
    } else {
      console.error(`[BeautyFlow:ERROR] ${message}`);
    }
  },

  /**
   * Log successful operations (dev only)
   */
  success: (message: string) => {
    if (isDev) {
      console.log(`[BeautyFlow:✓] ${message}`);
    }
  },
};
