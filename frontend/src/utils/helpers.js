/**
 * Utility helper functions
 * AI-generated helper functions for formatting and styling
 */

/**
 * Get status badge color classes based on transaction status
 * @param {string} status - Transaction status
 * @returns {string} Tailwind CSS classes for status badge
 */
export const getStatusColor = (status) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

/**
 * Get chart color for status
 * @param {string} status - Transaction status
 * @returns {string} Hex color code
 */
export const getStatusChartColor = (status) => {
  const chartColors = {
    completed: '#10b981',
    pending: '#f59e0b',
    failed: '#ef4444',
    processing: '#3b82f6',
    refunded: '#8b5cf6',
    cancelled: '#6b7280'
  };

  return chartColors[status] || '#6b7280';
};

/**
 * Format currency amount
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format date string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Format date for display (short format)
 * @param {string} dateString - ISO date string
 * @returns {string} Short formatted date string
 */
export const formatShortDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(date);
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};
