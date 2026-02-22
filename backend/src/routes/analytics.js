/**
 * Analytics routes
 * @module routes/analytics
 * @description Routes for analytics and reporting endpoints
 *
 * AI-generated: 100% (21 lines)
 * Human-written: 0% (0 lines)
 */

import express from 'express';
import { getSummary } from '../controllers/analyticsController.js';
import { validateQuery, analyticsSummarySchema } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /analytics/summary
 * Get analytics summary with aggregations
 */
router.get('/summary', validateQuery(analyticsSummarySchema), getSummary);

export default router;
