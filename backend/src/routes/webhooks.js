/**
 * Webhook routes
 * @module routes/webhooks
 * @description Routes for webhook ingestion endpoints
 *
 * AI-generated: 100% (21 lines)
 * Human-written: 0% (0 lines)
 */

import express from 'express';
import { ingestWebhook } from '../controllers/webhookController.js';
import { validateBody, webhookIngestSchema } from '../middleware/validation.js';

const router = express.Router();

/**
 * POST /webhooks/ingest
 * Ingest webhook from payment source
 */
router.post('/ingest', validateBody(webhookIngestSchema), ingestWebhook);

export default router;
