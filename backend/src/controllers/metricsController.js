/**
 * Metrics Controller
 * @module controllers/metricsController
 * @description Handles AI Impact and DORA metrics API requests
 *
 * AI-generated: 100%
 */

import { getAIImpactMetrics, getDORAMetrics } from '../services/metricsService.js';

/**
 * Get AI Impact metrics
 * @route GET /api/metrics/ai-impact
 */
export async function getAIImpact(req, res, next) {
  try {
    const metrics = await getAIImpactMetrics();

    res.status(200).json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching AI impact metrics:', error);
    next(error);
  }
}

/**
 * Get DORA metrics
 * @route GET /api/metrics/dora
 */
export async function getDORA(req, res, next) {
  try {
    const metrics = await getDORAMetrics();

    res.status(200).json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching DORA metrics:', error);
    next(error);
  }
}

/**
 * Get combined metrics (both AI Impact and DORA)
 * @route GET /api/metrics/combined
 */
export async function getCombinedMetrics(req, res, next) {
  try {
    const [aiImpact, dora] = await Promise.all([
      getAIImpactMetrics(),
      getDORAMetrics()
    ]);

    res.status(200).json({
      success: true,
      data: {
        aiImpact,
        dora
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching combined metrics:', error);
    next(error);
  }
}
