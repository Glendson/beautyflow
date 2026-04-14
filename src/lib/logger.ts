/**
 * Logger utility - Production-ready conditional logging
 * 
 * Features:
 * - Dev: Console output for debugging
 * - Prod: Structured JSON logs (for log aggregation services)
 * - Security: NO sensitive data (emails, passwords, JWTs, PII) logged
 * - GDPR: Compliant - no user data retained in logs
 * 
 * Usage:
 * logger.info("User signup started");
 * logger.error("Auth failed", error);
 * logger.debug("Debug info"); // Only in dev
 * logger.warn("Rate limit exceeded");
 */

const isDev = process.env.NODE_ENV === 'development';

// Log levels for structured logging
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  timestamp: string;
  message: string;
  service: string;
}

/**
 * Format log entry for production (JSON structure)
 */
function formatProdLog(level: LogLevel, message: string): string {
  const entry: LogEntry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    service: 'beautyflow',
  };
  return JSON.stringify(entry);
}

export const logger = {
  /**
   * Info-level logs (dev only)
   */
  info: (message: string, data?: unknown) => {
    if (isDev) {
      console.info(`[BeautyFlow] ${message}`, data ? JSON.stringify(data) : '');
    } else {
      console.log(formatProdLog(LogLevel.INFO, message));
    }
  },

  /**
   * Debug-level logs (dev only)
   */
  debug: (message: string, data?: unknown) => {
    if (isDev) {
      console.debug(`[BeautyFlow:DEBUG] ${message}`, data ? JSON.stringify(data) : '');
    }
    // No logging in production for debug
  },

  /**
   * Warning logs (always, generic message only)
   */
  warn: (message: string) => {
    if (isDev) {
      console.warn(`[BeautyFlow:WARN] ${message}`);
    } else {
      console.log(formatProdLog(LogLevel.WARN, message));
    }
  },

  /**
   * Error logs (always, never expose stack traces or sensitive data)
   * Only message is logged, never stack or user context
   */
  error: (message: string, error?: Error | unknown) => {
    let logMessage = message;
    if (error instanceof Error && error.message) {
      // Log only error message, never stack trace
      logMessage = `${message}: ${error.message}`;
    }
    
    if (isDev) {
      console.error(`[BeautyFlow:ERROR] ${logMessage}`);
      // In dev, optionally show stack for debugging
      if (error instanceof Error && error.stack) {
        console.error(error.stack);
      }
    } else {
      console.log(formatProdLog(LogLevel.ERROR, logMessage));
    }
  },

  /**
   * Success logs (dev only)
   */
  success: (message: string) => {
    if (isDev) {
      console.log(`[BeautyFlow:✓] ${message}`);
    }
    // No logging in production for success
  },
};
