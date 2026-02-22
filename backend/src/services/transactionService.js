/**
 * Transaction service - handles all database operations for transactions
 * @module services/transactionService
 * @description Business logic and database queries for transaction operations
 *
 * AI-generated: 100% (292 lines)
 * Human-written: 0% (0 lines)
 */

import { query, getClient } from '../db/pool.js';

/**
 * Create a new transaction from webhook payload
 * @param {Object} data - Transaction data
 * @param {string} data.source - Payment source identifier
 * @param {string} data.merchant_id - Merchant UUID
 * @param {number} data.amount - Transaction amount
 * @param {string} data.currency - ISO 4217 currency code
 * @param {string} data.status - Transaction status
 * @param {string} data.transaction_id - External transaction ID
 * @param {Object} [data.metadata] - Additional metadata
 * @returns {Promise<Object>} Created transaction object
 * @throws {Error} If transaction_id already exists (duplicate)
 */
export const createTransaction = async (data) => {
  const { source, merchant_id, amount, currency, status, transaction_id, metadata = {} } = data;

  // Build payload including transaction_id and any metadata
  const payload = {
    transaction_id,
    ...metadata
  };

  const text = `
    INSERT INTO transactions (source, merchant_id, amount, currency, status, payload)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;

  const values = [source, merchant_id, amount, currency, status, JSON.stringify(payload)];

  try {
    const result = await query(text, values);
    return result.rows[0];
  } catch (error) {
    // Check for duplicate transaction_id in payload
    if (error.code === '23505') { // Unique violation
      throw new Error('DUPLICATE_TRANSACTION');
    }
    throw error;
  }
};

/**
 * Get transactions with filtering and pagination
 * @param {Object} filters - Query filters
 * @param {string} [filters.source] - Filter by payment source
 * @param {string} [filters.status] - Filter by transaction status
 * @param {string} [filters.date_from] - Filter by start date (ISO 8601)
 * @param {string} [filters.date_to] - Filter by end date (ISO 8601)
 * @param {string} [filters.merchant_id] - Filter by merchant UUID
 * @param {number} [filters.page=1] - Page number (starts at 1)
 * @param {number} [filters.limit=50] - Number of records per page
 * @param {string} [filters.sort_by='created_at'] - Field to sort by
 * @param {string} [filters.sort_order='desc'] - Sort order (asc/desc)
 * @returns {Promise<Object>} Object containing data array and pagination metadata
 */
export const getTransactions = async (filters = {}) => {
  const {
    source,
    status,
    date_from,
    date_to,
    merchant_id,
    page = 1,
    limit = 50,
    sort_by = 'created_at',
    sort_order = 'desc'
  } = filters;

  // Build WHERE conditions
  const conditions = [];
  const values = [];
  let paramCount = 0;

  if (source) {
    paramCount++;
    conditions.push(`source = $${paramCount}`);
    values.push(source);
  }

  if (status) {
    paramCount++;
    conditions.push(`status = $${paramCount}`);
    values.push(status);
  }

  if (merchant_id) {
    paramCount++;
    conditions.push(`merchant_id = $${paramCount}`);
    values.push(merchant_id);
  }

  if (date_from) {
    paramCount++;
    conditions.push(`created_at >= $${paramCount}`);
    values.push(date_from);
  }

  if (date_to) {
    paramCount++;
    conditions.push(`created_at <= $${paramCount}`);
    values.push(date_to);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Validate sort_by to prevent SQL injection
  const validSortFields = ['created_at', 'amount', 'status'];
  const sortField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
  const sortDirection = sort_order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count
  const countText = `SELECT COUNT(*) FROM transactions ${whereClause}`;
  const countResult = await query(countText, values);
  const total = parseInt(countResult.rows[0].count, 10);

  // Get paginated data
  const dataText = `
    SELECT
      id,
      source,
      merchant_id,
      amount,
      currency,
      status,
      payload,
      created_at,
      updated_at
    FROM transactions
    ${whereClause}
    ORDER BY ${sortField} ${sortDirection}
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `;

  const dataResult = await query(dataText, [...values, limit, offset]);

  return {
    data: dataResult.rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get a single transaction by ID
 * @param {string} id - Transaction UUID
 * @returns {Promise<Object|null>} Transaction object or null if not found
 */
export const getTransactionById = async (id) => {
  const text = `
    SELECT
      id,
      source,
      merchant_id,
      amount,
      currency,
      status,
      payload,
      created_at,
      updated_at
    FROM transactions
    WHERE id = $1
  `;

  const result = await query(text, [id]);
  return result.rows[0] || null;
};

/**
 * Get analytics summary
 * @param {Object} filters - Query filters
 * @param {string} [filters.merchant_id] - Filter by merchant UUID
 * @param {string} [filters.date_from] - Filter by start date (ISO 8601)
 * @param {string} [filters.date_to] - Filter by end date (ISO 8601)
 * @param {string} [filters.currency] - Filter by currency code
 * @returns {Promise<Object>} Analytics summary object
 */
export const getAnalyticsSummary = async (filters = {}) => {
  const { merchant_id, date_from, date_to, currency } = filters;

  // Build WHERE conditions
  const conditions = [];
  const values = [];
  let paramCount = 0;

  if (merchant_id) {
    paramCount++;
    conditions.push(`merchant_id = $${paramCount}`);
    values.push(merchant_id);
  }

  if (date_from) {
    paramCount++;
    conditions.push(`created_at >= $${paramCount}`);
    values.push(date_from);
  }

  if (date_to) {
    paramCount++;
    conditions.push(`created_at <= $${paramCount}`);
    values.push(date_to);
  }

  if (currency) {
    paramCount++;
    conditions.push(`currency = $${paramCount}`);
    values.push(currency);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  // Get total volume and transaction count
  const summaryText = `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as total_volume,
      COUNT(*) as total_transactions,
      COALESCE(AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END), 0) as avg_amount
    FROM transactions
    ${whereClause}
  `;

  const summaryResult = await query(summaryText, values);
  const summary = summaryResult.rows[0];

  // Get count by status
  const statusText = `
    SELECT
      status,
      COUNT(*) as count
    FROM transactions
    ${whereClause}
    GROUP BY status
  `;

  const statusResult = await query(statusText, values);
  const countByStatus = {
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    refunded: 0,
    cancelled: 0
  };

  statusResult.rows.forEach(row => {
    countByStatus[row.status] = parseInt(row.count, 10);
  });

  // Get top 5 sources
  const sourcesText = `
    SELECT
      source,
      COUNT(*) as count,
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) as volume
    FROM transactions
    ${whereClause}
    GROUP BY source
    ORDER BY count DESC
    LIMIT 5
  `;

  const sourcesResult = await query(sourcesText, values);
  const topSources = sourcesResult.rows.map(row => ({
    source: row.source,
    count: parseInt(row.count, 10),
    volume: parseFloat(row.volume)
  }));

  // Calculate success rate
  const totalTxns = parseInt(summary.total_transactions, 10);
  const completedTxns = countByStatus.completed;
  const successRate = totalTxns > 0 ? (completedTxns / totalTxns) * 100 : 0;

  return {
    totalVolume: parseFloat(summary.total_volume),
    totalTransactions: totalTxns,
    countByStatus,
    topSources,
    averageTransactionAmount: parseFloat(summary.avg_amount),
    successRate: parseFloat(successRate.toFixed(2))
  };
};

/**
 * Create webhook log entry
 * @param {Object} data - Webhook log data
 * @param {string|null} data.transaction_id - Transaction UUID (null if creation failed)
 * @param {string} data.source - Payment source identifier
 * @param {number} data.http_status - HTTP status code
 * @param {Object} data.request_payload - Full incoming webhook payload
 * @param {Object} [data.response_payload] - Response payload
 * @param {string} [data.error_message] - Error message if failed
 * @param {number} [data.processing_time_ms] - Processing time in milliseconds
 * @returns {Promise<Object>} Created webhook log object
 */
export const createWebhookLog = async (data) => {
  const {
    transaction_id,
    source,
    http_status,
    request_payload,
    response_payload = null,
    error_message = null,
    processing_time_ms = null
  } = data;

  const text = `
    INSERT INTO webhook_logs (
      transaction_id,
      source,
      http_status,
      request_payload,
      response_payload,
      error_message,
      processing_time_ms
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;

  const values = [
    transaction_id,
    source,
    http_status,
    JSON.stringify(request_payload),
    response_payload ? JSON.stringify(response_payload) : null,
    error_message,
    processing_time_ms
  ];

  const result = await query(text, values);
  return result.rows[0];
};
