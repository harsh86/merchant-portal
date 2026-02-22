/**
 * Test setup and utilities
 * @module tests/setup.test
 * @description Helper functions and setup for tests
 *
 * AI-generated: 100% (45 lines)
 * Human-written: 0% (0 lines)
 */

import { describe, it, expect } from '@jest/globals';

describe('Test Setup', () => {
  it('should have test environment configured', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  it('should be able to import validation schemas', async () => {
    const { webhookIngestSchema } = await import('../middleware/validation.js');
    expect(webhookIngestSchema).toBeDefined();
  });

  it('should be able to import services', async () => {
    const service = await import('../services/transactionService.js');
    expect(service.createTransaction).toBeDefined();
    expect(service.getTransactions).toBeDefined();
    expect(service.getTransactionById).toBeDefined();
    expect(service.getAnalyticsSummary).toBeDefined();
    expect(service.createWebhookLog).toBeDefined();
  });

  it('should be able to import controllers', async () => {
    const webhook = await import('../controllers/webhookController.js');
    const transaction = await import('../controllers/transactionController.js');
    const analytics = await import('../controllers/analyticsController.js');

    expect(webhook.ingestWebhook).toBeDefined();
    expect(transaction.listTransactions).toBeDefined();
    expect(transaction.getTransaction).toBeDefined();
    expect(analytics.getSummary).toBeDefined();
  });

  it('should be able to import middleware', async () => {
    const { errorHandler, notFoundHandler } = await import('../middleware/errorHandler.js');
    const { requestLogger } = await import('../middleware/logger.js');

    expect(errorHandler).toBeDefined();
    expect(notFoundHandler).toBeDefined();
    expect(requestLogger).toBeDefined();
  });
});
