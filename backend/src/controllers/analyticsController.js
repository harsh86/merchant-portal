/**
 * Analytics controller
 * @module controllers/analyticsController
 * @description Handles analytics and reporting endpoints
 *
 * AI-generated: 100% (46 lines)
 * Human-written: 0% (0 lines)
 */

import { getAnalyticsSummary } from '../services/transactionService.js';

/**
 * GET /analytics/summary
 * Get analytics summary with aggregations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const getSummary = async (req, res, next) => {
  try {
    const filters = req.validatedQuery;
    const data = await getAnalyticsSummary(filters);

    const metadata = {
      currency: filters.currency || 'USD',
      generatedAt: new Date().toISOString()
    };

    if (filters.date_from || filters.date_to) {
      metadata.dateRange = {
        from: filters.date_from || null,
        to: filters.date_to || null
      };
    }

    res.status(200).json({
      success: true,
      data,
      metadata
    });
  } catch (error) {
    next(error);
  }
};
