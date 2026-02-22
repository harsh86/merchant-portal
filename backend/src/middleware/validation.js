/**
 * Request validation schemas using Zod
 * @module middleware/validation
 * @description Zod schemas for validating API requests
 *
 * AI-generated: 100% (128 lines)
 * Human-written: 0% (0 lines)
 */

import { z } from 'zod';

/**
 * Valid transaction status values
 */
const transactionStatuses = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'cancelled'
];

/**
 * Schema for webhook ingestion payload
 * @type {z.ZodObject}
 */
export const webhookIngestSchema = z.object({
  source: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9_-]+$/, 'Source must be lowercase alphanumeric with hyphens/underscores'),
  merchant_id: z.string()
    .uuid('merchant_id must be a valid UUID'),
  amount: z.number()
    .nonnegative('Amount must be non-negative'),
  currency: z.string()
    .length(3, 'Currency must be a 3-letter ISO 4217 code')
    .regex(/^[A-Z]{3}$/, 'Currency must be uppercase'),
  status: z.enum(transactionStatuses, {
    errorMap: () => ({ message: `Status must be one of: ${transactionStatuses.join(', ')}` })
  }),
  transaction_id: z.string()
    .min(1)
    .max(255),
  metadata: z.record(z.unknown()).optional()
});

/**
 * Schema for GET /transactions query parameters
 * @type {z.ZodObject}
 */
export const transactionQuerySchema = z.object({
  source: z.string()
    .regex(/^[a-z0-9_-]+$/)
    .optional(),
  status: z.enum(transactionStatuses).optional(),
  date_from: z.string()
    .datetime({ offset: true })
    .optional(),
  date_to: z.string()
    .datetime({ offset: true })
    .optional(),
  merchant_id: z.string()
    .uuid()
    .optional(),
  page: z.string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive())
    .optional()
    .default('1'),
  limit: z.string()
    .transform(val => parseInt(val, 10))
    .pipe(z.number().int().positive().max(1000))
    .optional()
    .default('50'),
  sort_by: z.enum(['created_at', 'amount', 'status']).optional().default('created_at'),
  sort_order: z.enum(['asc', 'desc']).optional().default('desc')
});

/**
 * Schema for transaction ID parameter
 * @type {z.ZodObject}
 */
export const transactionIdSchema = z.object({
  id: z.string().uuid('Transaction ID must be a valid UUID')
});

/**
 * Schema for GET /analytics/summary query parameters
 * @type {z.ZodObject}
 */
export const analyticsSummarySchema = z.object({
  merchant_id: z.string()
    .uuid()
    .optional(),
  date_from: z.string()
    .datetime({ offset: true })
    .optional(),
  date_to: z.string()
    .datetime({ offset: true })
    .optional(),
  currency: z.string()
    .length(3)
    .regex(/^[A-Z]{3}$/)
    .optional()
});

/**
 * Middleware to validate request body against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request payload',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            })),
            requestId: req.id || `req_${Date.now()}`
          }
        });
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate query parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            })),
            requestId: req.id || `req_${Date.now()}`
          }
        });
      }
      next(error);
    }
  };
};

/**
 * Middleware to validate URL parameters against a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {Function} Express middleware function
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedParams = schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid URL parameters',
            details: error.errors.map(err => ({
              field: err.path.join('.'),
              message: err.message
            })),
            requestId: req.id || `req_${Date.now()}`
          }
        });
      }
      next(error);
    }
  };
};
