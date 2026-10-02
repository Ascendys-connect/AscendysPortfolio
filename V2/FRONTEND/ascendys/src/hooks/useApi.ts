/**
 * useApi Hook
 * Generic hook for API calls with loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api.service';

interface UseApiOptions<T> {
  defaultValue?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for automatic API calls with built-in state management
 */
export function useApi<T = any>(
  endpoint: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { defaultValue, enabled = true, onSuccess, onError } = options;

  const [data, setData] = useState<T>(defaultValue as T);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.get<T>(endpoint);
      
      // Auto-unwrap response if it has { success, message, data } structure
      let finalData: T;
      if (
        response && 
        typeof response === 'object' && 
        'data' in response &&
        'success' in response
      ) {
        // Backend returns { success, message, data } - unwrap it
        finalData = (response as any).data as T;
      } else {
        finalData = response;
      }
      
      // Ensure we always have a valid value (use defaultValue if finalData is null/undefined)
      if (finalData === null || finalData === undefined) {
        finalData = defaultValue as T;
      }
      
      setData(finalData);
      onSuccess?.(finalData);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

export default useApi;
