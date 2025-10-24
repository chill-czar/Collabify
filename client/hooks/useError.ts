import { useState, useCallback } from "react";

/**
 * Custom hook to manage error state
 * Provides consistent error state management across components
 */
export function useError() {
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
    } else if (typeof err === "string") {
      setError(new Error(err));
    } else {
      setError(new Error("An unknown error occurred"));
    }
  }, []);

  /**
   * Wrap an async function with error handling
   */
  const withErrorHandling = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      clearError();
      try {
        const result = await fn();
        return result;
      } catch (err) {
        handleError(err);
        return null;
      }
    },
    [clearError, handleError]
  );

  return {
    error,
    setError: handleError,
    clearError,
    withErrorHandling,
  };
}
