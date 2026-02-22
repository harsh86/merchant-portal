import { useQuery } from '@tanstack/react-query';
import { getTransactions, getTransactionById } from '../services/transactions';

/**
 * Custom hook for fetching transactions list
 * AI-generated React Query hook
 * @param {Object} filters - Query filters
 * @returns {Object} Query result with transactions data
 */
export const useTransactions = (filters = {}) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
    staleTime: 30000, // 30 seconds
    retry: 2
  });
};

/**
 * Custom hook for fetching single transaction by ID
 * AI-generated React Query hook
 * @param {string} id - Transaction UUID
 * @returns {Object} Query result with transaction data
 */
export const useTransaction = (id) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    retry: 2
  });
};
