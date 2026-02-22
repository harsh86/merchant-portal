/**
 * Error handling middleware
 * @module middleware/errorHandler
 * @description Centralized error handling for Express application
 *
 * AI-generated: 100% (65 lines)
 * Human-written: 0% (0 lines)
 */

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    requestId: req.id || `req_${Date.now()}`
  });

  // Handle specific error types
  if (err.message === 'DUPLICATE_TRANSACTION') {
    return res.status(409).json({
      error: {
        code: 'DUPLICATE_TRANSACTION',
        message: 'Transaction with this ID already exists',
        requestId: req.id || `req_${Date.now()}`
      }
    });
  }

  // Database connection errors
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'Database connection unavailable',
        requestId: req.id || `req_${Date.now()}`
      }
    });
  }

  // Database constraint violations
  if (err.code === '23503') { // Foreign key violation
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Referenced record does not exist',
        requestId: req.id || `req_${Date.now()}`
      }
    });
  }

  // Default internal server error
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message,
      requestId: req.id || `req_${Date.now()}`
    }
  });
};

/**
 * 404 Not Found handler
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found',
      requestId: req.id || `req_${Date.now()}`
    }
  });
};
