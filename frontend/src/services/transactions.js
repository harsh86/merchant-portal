import apiClient from './api';

/**
 * Transaction API service functions
 * AI-generated service layer for transaction operations
 */

/**
 * Get paginated list of transactions with filters
 * @param {Object} params - Query parameters
 * @param {string} params.source - Filter by payment source
 * @param {string} params.status - Filter by transaction status
 * @param {string} params.date_from - Filter by start date
 * @param {string} params.date_to - Filter by end date
 * @param {string} params.merchant_id - Filter by merchant UUID
 * @param {number} params.page - Page number (starts at 1)
 * @param {number} params.limit - Number of records per page
 * @param {string} params.sort_by - Field to sort by
 * @param {string} params.sort_order - Sort order (asc/desc)
 * @returns {Promise} API response with transactions data
 */
export const getTransactions = async (params = {}) => {
  const response = await apiClient.get('/transactions', { params });
  return response.data;
};

/**
 * Get single transaction by ID
 * @param {string} id - Transaction UUID
 * @returns {Promise} API response with transaction data
 */
export const getTransactionById = async (id) => {
  const response = await apiClient.get(`/transactions/${id}`);
  return response.data;
};

/**
 * Get analytics summary
 * @param {Object} params - Query parameters
 * @param {string} params.merchant_id - Filter by merchant UUID
 * @param {string} params.date_from - Start date for analytics period
 * @param {string} params.date_to - End date for analytics period
 * @param {string} params.currency - Filter by currency
 * @returns {Promise} API response with analytics data
 */
export const getAnalyticsSummary = async (params = {}) => {
  const response = await apiClient.get('/analytics/summary', { params });
  return response.data;
};
