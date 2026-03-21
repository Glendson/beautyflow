/**
 * Represents the outcome of an operation, containing either the successful data or an error string.
 */
export type Result<T, E = string> = 
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: E };

export const Result = {
  ok: <T>(data: T): Result<T> => ({ success: true, data }),
  fail: <E>(error: E): Result<never, E> => ({ success: false, error }),
};
