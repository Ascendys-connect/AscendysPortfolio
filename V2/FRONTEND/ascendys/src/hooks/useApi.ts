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
      let finalData: any;
      if (
        response && 
        typeof response === 'object' && 
        'data' in response &&
        'success' in response
      ) {
        // Backend returns { success, message, data } - unwrap it
        finalData = (response as any).data;
      } else {
        finalData = response;
      }
      
      // If consumer expects an array (defaultValue is Array) and response is paginated DRF { results: [...] }
      if (Array.isArray(defaultValue)) {
        if (finalData && typeof finalData === 'object' && Array.isArray(finalData.results)) {
          finalData = finalData.results;
        } else if (finalData && typeof finalData === 'object' && Array.isArray(finalData.data)) {
          finalData = finalData.data;
        } else if (!Array.isArray(finalData)) {
          finalData = defaultValue;
        }
      }

      // Ensure we always have a valid value (use defaultValue if finalData is null/undefined)
      if (finalData === null || finalData === undefined) {
        finalData = defaultValue as T;
      }
      
      setData(finalData as T);
      onSuccess?.(finalData as T);
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
