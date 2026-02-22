/**
 * Validation middleware tests
 * @module tests/validation.test
 * @description Tests for Zod validation schemas
 *
 * AI-generated: 100% (175 lines)
 * Human-written: 0% (0 lines)
 */

import { describe, it, expect } from '@jest/globals';
import {
  webhookIngestSchema,
  transactionQuerySchema,
  transactionIdSchema,
  analyticsSummarySchema
} from '../middleware/validation.js';

describe('Validation Schemas', () => {
  describe('webhookIngestSchema', () => {
    it('should validate correct webhook payload', () => {
      const validPayload = {
        source: 'stripe',
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        amount: 150.00,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'ch_123456',
        metadata: { customer_email: 'test@example.com' }
      };

      const result = webhookIngestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it('should reject invalid source format', () => {
      const invalidPayload = {
        source: 'STRIPE', // Should be lowercase
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'ch_123'
      };

      const result = webhookIngestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid merchant_id', () => {
      const invalidPayload = {
        source: 'stripe',
        merchant_id: 'not-a-uuid',
        amount: 100,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'ch_123'
      };

      const result = webhookIngestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject negative amount', () => {
      const invalidPayload = {
        source: 'stripe',
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        amount: -50,
        currency: 'USD',
        status: 'completed',
        transaction_id: 'ch_123'
      };

      const result = webhookIngestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid currency format', () => {
      const invalidPayload = {
        source: 'stripe',
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        currency: 'usd', // Should be uppercase
        status: 'completed',
        transaction_id: 'ch_123'
      };

      const result = webhookIngestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should reject invalid status', () => {
      const invalidPayload = {
        source: 'stripe',
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        amount: 100,
        currency: 'USD',
        status: 'invalid_status',
        transaction_id: 'ch_123'
      };

      const result = webhookIngestSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should accept all valid statuses', () => {
      const statuses = ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'];

      statuses.forEach(status => {
        const payload = {
          source: 'stripe',
          merchant_id: '550e8400-e29b-41d4-a716-446655440000',
          amount: 100,
          currency: 'USD',
          status,
          transaction_id: 'ch_123'
        };

        const result = webhookIngestSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('transactionQuerySchema', () => {
    it('should validate empty query parameters with defaults', () => {
      const result = transactionQuerySchema.safeParse({});
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(50);
    });

    it('should validate source filter', () => {
      const result = transactionQuerySchema.safeParse({ source: 'stripe' });
      expect(result.success).toBe(true);
      expect(result.data.source).toBe('stripe');
    });

    it('should validate status filter', () => {
      const result = transactionQuerySchema.safeParse({ status: 'completed' });
      expect(result.success).toBe(true);
    });

    it('should validate merchant_id filter', () => {
      const result = transactionQuerySchema.safeParse({
        merchant_id: '550e8400-e29b-41d4-a716-446655440000'
      });
      expect(result.success).toBe(true);
    });

    it('should convert string page to number', () => {
      const result = transactionQuerySchema.safeParse({ page: '2' });
      expect(result.success).toBe(true);
      expect(result.data.page).toBe(2);
    });

    it('should reject invalid page number', () => {
      const result = transactionQuerySchema.safeParse({ page: '0' });
      expect(result.success).toBe(false);
    });

    it('should reject limit exceeding maximum', () => {
      const result = transactionQuerySchema.safeParse({ limit: '2000' });
      expect(result.success).toBe(false);
    });
  });

  describe('transactionIdSchema', () => {
    it('should validate valid UUID', () => {
      const result = transactionIdSchema.safeParse({
        id: '123e4567-e89b-12d3-a456-426614174000'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid UUID', () => {
      const result = transactionIdSchema.safeParse({ id: 'not-a-uuid' });
      expect(result.success).toBe(false);
    });
  });

  describe('analyticsSummarySchema', () => {
    it('should validate empty parameters', () => {
      const result = analyticsSummarySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should validate with all filters', () => {
      const result = analyticsSummarySchema.safeParse({
        merchant_id: '550e8400-e29b-41d4-a716-446655440000',
        date_from: '2024-01-01T00:00:00Z',
        date_to: '2024-12-31T23:59:59Z',
        currency: 'USD'
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid currency', () => {
      const result = analyticsSummarySchema.safeParse({ currency: 'usd' });
      expect(result.success).toBe(false);
    });
  });
});
