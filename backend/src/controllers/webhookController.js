/**
 * Webhook controller
 * @module controllers/webhookController
 * @description Handles webhook ingestion endpoints
 *
 * AI-generated: 100% (78 lines)
 * Human-written: 0% (0 lines)
 */

import { createTransaction, createWebhookLog } from '../services/transactionService.js';

/**
 * POST /webhooks/ingest
 * Ingest webhook from payment source
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const ingestWebhook = async (req, res, next) => {
  const startTime = Date.now();
  const requestPayload = req.validatedBody;

  let transactionId = null;
  let httpStatus = 201;
  let responsePayload = null;
  let errorMessage = null;

  try {
    // Create transaction
    const transaction = await createTransaction(requestPayload);
    transactionId = transaction.id;

    responsePayload = {
      success: true,
      data: {
        transaction_id: transaction.id,
        webhook_log_id: null // Will be filled after creating webhook log
      },
      message: 'Transaction created successfully'
    };

    // Create webhook log
    const processingTime = Date.now() - startTime;
    const webhookLog = await createWebhookLog({
      transaction_id: transactionId,
      source: requestPayload.source,
      http_status: httpStatus,
      request_payload: requestPayload,
      response_payload: responsePayload,
      error_message: null,
      processing_time_ms: processingTime
    });

    // Update response with webhook log ID
    responsePayload.data.webhook_log_id = webhookLog.id;

    res.status(httpStatus).json(responsePayload);

  } catch (error) {
    // Handle duplicate transaction error
    if (error.message === 'DUPLICATE_TRANSACTION') {
      httpStatus = 409;
      errorMessage = 'Transaction with this ID already exists';

      // Still create webhook log for audit
      const processingTime = Date.now() - startTime;
      await createWebhookLog({
        transaction_id: null,
        source: requestPayload.source,
        http_status: httpStatus,
        request_payload: requestPayload,
        response_payload: null,
        error_message: errorMessage,
        processing_time_ms: processingTime
      });

      return next(error);
    }

    // Handle other errors
    httpStatus = 500;
    errorMessage = error.message;

    // Create webhook log for failed request
    const processingTime = Date.now() - startTime;
    await createWebhookLog({
      transaction_id: null,
      source: requestPayload.source,
      http_status: httpStatus,
      request_payload: requestPayload,
      response_payload: null,
      error_message: errorMessage,
      processing_time_ms: processingTime
    });

    next(error);
  }
};
