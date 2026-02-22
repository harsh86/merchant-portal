import { useQuery } from '@tanstack/react-query';
import { getAnalyticsSummary } from '../services/transactions';

/**
 * Custom hook for fetching analytics summary
 * AI-generated React Query hook
 * @param {Object} params - Query parameters
 * @returns {Object} Query result with analytics data
 */
export const useAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', params],
    queryFn: () => getAnalyticsSummary(params),
    staleTime: 300000, // 5 minutes (analytics can be cached longer)
    retry: 2
  });
};
