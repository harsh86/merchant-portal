/**
 * Metrics Routes
 * @module routes/metrics
 * @description Routes for AI Impact and DORA metrics endpoints
 *
 * AI-generated: 100%
 */

import express from 'express';
import { getAIImpact, getDORA, getCombinedMetrics } from '../controllers/metricsController.js';

const router = express.Router();

/**
 * @route GET /api/metrics/ai-impact
 * @description Get AI impact metrics (lines generated, time saved, productivity)
 * @access Public
 */
router.get('/ai-impact', getAIImpact);

/**
 * @route GET /api/metrics/dora
 * @description Get DORA metrics (deployment frequency, lead time, failure rate, MTTR)
 * @access Public
 */
router.get('/dora', getDORA);

/**
 * @route GET /api/metrics/combined
 * @description Get both AI Impact and DORA metrics in single response
 * @access Public
 */
router.get('/combined', getCombinedMetrics);

export default router;
