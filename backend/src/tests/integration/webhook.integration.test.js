/**
 * Webhook Integration Tests
 * @module tests/integration/webhook.integration.test
 * @description End-to-end tests for webhook ingest flow
 * Tests complete flow: webhook -> validation -> DB insert -> webhook_log creation -> response
 *
 * AI-generated: 100% (550 lines)
 * Human-written: 0% (0 lines)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import app from '../../index.js';
import { query, close as closePool } from '../../db/pool.js';

describe('Webhook Integration Tests', () => {
  let testMerchantId = '00000000-0000-0000-0000-000000000001'; // Using sample merchant from schema

  beforeAll(async () => {
    // Verify database connection
    try {
      const result = await query('SELECT NOW()');
      expect(result.rows).toBeDefined();
      console.log('✓ Database connection established');
    } catch (error) {
      console.error('✗ Database connection failed:', error.message);
      throw error;
    }
  });

  afterAll(async () => {
    // Clean up database connections
    await closePool();
  });

  beforeEach(async () => {
    // Clean up test transactions before each test
    // Keep sample merchants but remove transactions created during tests
    await query(`
      DELETE FROM webhook_logs
      WHERE source IN ('test-source', 'stripe-test', 'paypal-test', 'square-test')
    `);

    await query(`
      DELETE FROM transactions
      WHERE source IN ('test-source', 'stripe-test', 'paypal-test', 'square-test')
    `);
  });

  describe('POST /api/webhooks/ingest - Success Cases', () => {
    it('should successfully ingest a valid webhook with complete data', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.50,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_' + Date.now(),
        metadata: {
          customer_email: 'test@example.com',
          payment_method: 'card',
          description: 'Test payment'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect('Content-Type', /json/)
        .expect(201);

      // Validate response structure
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('transaction_id');
      expect(response.body.data).toHaveProperty('webhook_log_id');
      expect(response.body).toHaveProperty('message', 'Transaction created successfully');

      const transactionId = response.body.data.transaction_id;
      const webhookLogId = response.body.data.webhook_log_id;

      // Verify transaction was created in database
      const txResult = await query('SELECT * FROM transactions WHERE id = $1', [transactionId]);
      expect(txResult.rows.length).toBe(1);

      const transaction = txResult.rows[0];
      expect(transaction.source).toBe(webhookPayload.source);
      expect(transaction.merchant_id).toBe(webhookPayload.merchant_id);
      expect(parseFloat(transaction.amount)).toBe(webhookPayload.amount);
      expect(transaction.currency).toBe(webhookPayload.currency);
      expect(transaction.status).toBe(webhookPayload.status);
      expect(transaction.payload).toHaveProperty('transaction_id', webhookPayload.transaction_id);
      expect(transaction.payload).toHaveProperty('customer_email', webhookPayload.metadata.customer_email);

      // Verify webhook log was created
      const logResult = await query('SELECT * FROM webhook_logs WHERE id = $1', [webhookLogId]);
      expect(logResult.rows.length).toBe(1);

      const webhookLog = logResult.rows[0];
      expect(webhookLog.transaction_id).toBe(transactionId);
      expect(webhookLog.source).toBe(webhookPayload.source);
      expect(webhookLog.http_status).toBe(201);
      expect(webhookLog.error_message).toBeNull();
      expect(webhookLog.processing_time_ms).toBeGreaterThan(0);
      expect(webhookLog.request_payload).toHaveProperty('source', webhookPayload.source);
      expect(webhookLog.response_payload).toHaveProperty('success', true);
    });

    it('should handle webhook with minimal required fields', async () => {
      const webhookPayload = {
        source: 'paypal-test',
        merchant_id: testMerchantId,
        amount: 50.00,
        currency: 'EUR',
        status: 'pending',
        transaction_id: 'txn_minimal_' + Date.now()
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.transaction_id).toBeDefined();
      expect(response.body.data.webhook_log_id).toBeDefined();

      // Verify in database
      const txResult = await query(
        'SELECT * FROM transactions WHERE id = $1',
        [response.body.data.transaction_id]
      );
      expect(txResult.rows.length).toBe(1);
      expect(txResult.rows[0].source).toBe('paypal-test');
    });

    it('should handle different transaction statuses', async () => {
      const statuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];

      for (const status of statuses) {
        const webhookPayload = {
          source: 'test-source',
          merchant_id: testMerchantId,
          amount: 25.00,
          currency: 'USD',
          status: status,
          transaction_id: `txn_status_${status}_${Date.now()}`
        };

        const response = await request(app)
          .post('/api/webhooks/ingest')
          .send(webhookPayload)
          .expect(201);

        expect(response.body.success).toBe(true);

        // Verify status in database
        const txResult = await query(
          'SELECT status FROM transactions WHERE id = $1',
          [response.body.data.transaction_id]
        );
        expect(txResult.rows[0].status).toBe(status);
      }
    });

    it('should handle different payment sources', async () => {
      const sources = ['stripe-test', 'paypal-test', 'square-test'];

      for (const source of sources) {
        const webhookPayload = {
          source: source,
          merchant_id: testMerchantId,
          amount: 75.00,
          currency: 'USD',
          status: 'completed',
          transaction_id: `txn_${source}_${Date.now()}`
        };

        const response = await request(app)
          .post('/api/webhooks/ingest')
          .send(webhookPayload)
          .expect(201);

        expect(response.body.success).toBe(true);
      }
    });

    it('should store metadata correctly in payload JSONB field', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 150.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_metadata_' + Date.now(),
        metadata: {
          stripe_charge_id: 'ch_test_12345',
          customer_id: 'cus_test_67890',
          invoice_id: 'inv_test_abcde',
          custom_field: 'custom_value',
          nested: {
            level1: {
              level2: 'deep_value'
            }
          }
        }
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      const txResult = await query(
        'SELECT payload FROM transactions WHERE id = $1',
        [response.body.data.transaction_id]
      );

      const payload = txResult.rows[0].payload;
      expect(payload.transaction_id).toBe(webhookPayload.transaction_id);
      expect(payload.stripe_charge_id).toBe('ch_test_12345');
      expect(payload.customer_id).toBe('cus_test_67890');
      expect(payload.nested.level1.level2).toBe('deep_value');
    });
  });

  describe('POST /api/webhooks/ingest - Validation Errors', () => {
    it('should reject webhook with missing required field: source', async () => {
      const webhookPayload = {
        // source missing
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_001'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toBeDefined();
    });

    it('should reject webhook with missing required field: merchant_id', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        // merchant_id missing
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_002'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with missing required field: amount', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        // amount missing
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_003'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with invalid merchant_id (not UUID)', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: 'invalid-uuid',
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_004'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      const merchantIdError = response.body.error.details.find(
        d => d.field === 'merchant_id'
      );
      expect(merchantIdError).toBeDefined();
      expect(merchantIdError.message).toContain('UUID');
    });

    it('should reject webhook with negative amount', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: -50.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_005'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      const amountError = response.body.error.details.find(
        d => d.field === 'amount'
      );
      expect(amountError).toBeDefined();
      expect(amountError.message).toContain('non-negative');
    });

    it('should reject webhook with invalid currency format', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'us', // Too short
        status: 'completed',
        transaction_id: 'txn_test_006'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with lowercase currency', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'usd', // Must be uppercase
        status: 'completed',
        transaction_id: 'txn_test_007'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with invalid status', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'invalid_status',
        transaction_id: 'txn_test_008'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      const statusError = response.body.error.details.find(
        d => d.field === 'status'
      );
      expect(statusError).toBeDefined();
    });

    it('should reject webhook with invalid source format (uppercase)', async () => {
      const webhookPayload = {
        source: 'STRIPE-TEST', // Must be lowercase
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_009'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with invalid source format (special chars)', async () => {
      const webhookPayload = {
        source: 'stripe@test', // Invalid characters
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_010'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with invalid data types', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 'not-a-number', // Should be number
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_test_011'
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should reject webhook with empty transaction_id', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: '' // Empty string
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('POST /api/webhooks/ingest - Duplicate Transaction', () => {
    it('should return 409 for duplicate transaction_id', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_duplicate_' + Date.now()
      };

      // First request should succeed
      const firstResponse = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      expect(firstResponse.body.success).toBe(true);

      // Second request with same transaction_id should fail with 409
      const secondResponse = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(409);

      expect(secondResponse.body).toHaveProperty('error');

      // Verify webhook log was created for duplicate attempt
      const logResult = await query(
        'SELECT * FROM webhook_logs WHERE source = $1 AND http_status = 409',
        [webhookPayload.source]
      );
      expect(logResult.rows.length).toBeGreaterThan(0);

      const duplicateLog = logResult.rows[0];
      expect(duplicateLog.error_message).toBeTruthy();
      expect(duplicateLog.transaction_id).toBeNull(); // No transaction created
    });
  });

  describe('Webhook Log Audit Trail', () => {
    it('should log processing time for successful webhooks', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_timing_' + Date.now()
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      const logResult = await query(
        'SELECT processing_time_ms FROM webhook_logs WHERE id = $1',
        [response.body.data.webhook_log_id]
      );

      expect(logResult.rows[0].processing_time_ms).toBeGreaterThan(0);
      expect(logResult.rows[0].processing_time_ms).toBeLessThan(5000); // Should be under 5 seconds
    });

    it('should log complete request payload', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_payload_' + Date.now(),
        metadata: {
          test_field: 'test_value'
        }
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      const logResult = await query(
        'SELECT request_payload FROM webhook_logs WHERE id = $1',
        [response.body.data.webhook_log_id]
      );

      const requestPayload = logResult.rows[0].request_payload;
      expect(requestPayload.source).toBe(webhookPayload.source);
      expect(requestPayload.amount).toBe(webhookPayload.amount);
      expect(requestPayload.metadata.test_field).toBe('test_value');
    });

    it('should log response payload for successful webhooks', async () => {
      const webhookPayload = {
        source: 'stripe-test',
        merchant_id: testMerchantId,
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'txn_response_' + Date.now()
      };

      const response = await request(app)
        .post('/api/webhooks/ingest')
        .send(webhookPayload)
        .expect(201);

      const logResult = await query(
        'SELECT response_payload FROM webhook_logs WHERE id = $1',
        [response.body.data.webhook_log_id]
      );

      const responsePayload = logResult.rows[0].response_payload;
      expect(responsePayload.success).toBe(true);
      expect(responsePayload.data).toBeDefined();
      expect(responsePayload.message).toBe('Transaction created successfully');
    });
  });

  describe('Database Constraints', () => {
    it('should enforce amount non-negative constraint', async () => {
      // This should be caught by validation, but double-checking DB constraint
      try {
        await query(
          `INSERT INTO transactions (source, merchant_id, amount, currency, status, payload)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['test-source', testMerchantId, -100, 'USD', 'completed', '{"transaction_id": "test"}']
        );
        fail('Should have thrown constraint violation');
      } catch (error) {
        expect(error.code).toBe('23514'); // Check constraint violation
      }
    });

    it('should enforce currency uppercase constraint', async () => {
      try {
        await query(
          `INSERT INTO transactions (source, merchant_id, amount, currency, status, payload)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['test-source', testMerchantId, 100, 'usd', 'completed', '{"transaction_id": "test"}']
        );
        fail('Should have thrown constraint violation');
      } catch (error) {
        expect(error.code).toBe('23514'); // Check constraint violation
      }
    });

    it('should enforce status lowercase constraint', async () => {
      try {
        await query(
          `INSERT INTO transactions (source, merchant_id, amount, currency, status, payload)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          ['test-source', testMerchantId, 100, 'USD', 'COMPLETED', '{"transaction_id": "test"}']
        );
        fail('Should have thrown constraint violation');
      } catch (error) {
        expect(error.code).toBe('23514'); // Check constraint violation
      }
    });
  });
});
