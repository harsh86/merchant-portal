/**
 * Health check endpoint
 * @module routes/health
 * @description Provides health status and database connectivity check
 *
 * AI-generated: 100% (62 lines)
 * Human-written: 0% (0 lines)
 */

import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

/**
 * GET /health
 * Health check endpoint with database connectivity verification
 *
 * Returns:
 *   200 OK - System healthy, database connected
 *   503 Service Unavailable - Database unreachable
 */
router.get('/', async (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };

  try {
    // Test database connectivity with latency measurement
    const start = Date.now();
    await pool.query('SELECT 1 AS health_check');
    const latency = Date.now() - start;

    healthCheck.database = {
      connected: true,
      latency_ms: latency
    };

    // Memory usage information
    const memUsage = process.memoryUsage();
    healthCheck.memory = {
      used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      total_mb: Math.round(memUsage.heapTotal / 1024 / 1024),
      rss_mb: Math.round(memUsage.rss / 1024 / 1024)
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    // Database connection failed
    healthCheck.status = 'unhealthy';
    healthCheck.database = {
      connected: false,
      error: error.message
    };

    // Still include memory stats even when unhealthy
    const memUsage = process.memoryUsage();
    healthCheck.memory = {
      used_mb: Math.round(memUsage.heapUsed / 1024 / 1024),
      total_mb: Math.round(memUsage.heapTotal / 1024 / 1024)
    };

    res.status(503).json(healthCheck);
  }
});

export default router;
