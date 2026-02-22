/**
 * Transaction controller
 * @module controllers/transactionController
 * @description Handles transaction query endpoints
 *
 * AI-generated: 100% (62 lines)
 * Human-written: 0% (0 lines)
 */

import { getTransactions, getTransactionById } from '../services/transactionService.js';

/**
 * GET /transactions
 * Get list of transactions with filters and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const listTransactions = async (req, res, next) => {
  try {
    const filters = req.validatedQuery;
    const result = await getTransactions(filters);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /transactions/:id
 * Get a single transaction by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const getTransaction = async (req, res, next) => {
  try {
    const { id } = req.validatedParams;
    const transaction = await getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Transaction not found',
          requestId: req.id || `req_${Date.now()}`
        }
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};
