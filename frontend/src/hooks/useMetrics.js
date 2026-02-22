/**
 * Custom hooks for metrics data fetching
 * AI-generated React Query hooks for real-time metrics
 */

import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api';

/**
 * Fetch AI Impact metrics with 30-second auto-refresh
 */
export function useAIImpactMetrics() {
  return useQuery({
    queryKey: ['aiImpactMetrics'],
    queryFn: async () => {
      const response = await apiClient.get('/metrics/ai-impact');
      return response.data.data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
    staleTime: 25000, // Consider data stale after 25 seconds
    retry: 2
  });
}

/**
 * Fetch DORA metrics with 30-second auto-refresh
 */
export function useDORAMetrics() {
  return useQuery({
    queryKey: ['doraMetrics'],
    queryFn: async () => {
      const response = await apiClient.get('/metrics/dora');
      return response.data.data;
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2
  });
}

/**
 * Fetch combined metrics (both AI Impact and DORA)
 */
export function useCombinedMetrics() {
  return useQuery({
    queryKey: ['combinedMetrics'],
    queryFn: async () => {
      const response = await apiClient.get('/metrics/combined');
      return response.data.data;
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2
  });
}
