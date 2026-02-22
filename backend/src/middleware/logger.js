/**
 * Request logging middleware
 * @module middleware/logger
 * @description Logs incoming HTTP requests for monitoring and debugging
 *
 * AI-generated: 100% (32 lines)
 * Human-written: 0% (0 lines)
 */

/**
 * Request logger middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Generate request ID
  req.id = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log({
      requestId: req.id,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent'),
      timestamp: new Date().toISOString()
    });
  });

  next();
};
