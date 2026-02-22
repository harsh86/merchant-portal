/**
 * Transaction routes
 * @module routes/transactions
 * @description Routes for transaction query endpoints
 *
 * AI-generated: 100% (28 lines)
 * Human-written: 0% (0 lines)
 */

import express from 'express';
import { listTransactions, getTransaction } from '../controllers/transactionController.js';
import { validateQuery, validateParams, transactionQuerySchema, transactionIdSchema } from '../middleware/validation.js';

const router = express.Router();

/**
 * GET /transactions
 * Get list of transactions with filters and pagination
 */
router.get('/', validateQuery(transactionQuerySchema), listTransactions);

/**
 * GET /transactions/:id
 * Get a single transaction by ID
 */
router.get('/:id', validateParams(transactionIdSchema), getTransaction);

export default router;
