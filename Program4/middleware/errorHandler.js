/**
 * Centralized Error-Handling Middleware
 */

function errorHandler(err, req, res, next) {
  console.error('[CENTRAL ERROR HANDLER]:', err.stack || err.message);

  const statusCode = err.statusCode || res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    status: statusCode,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
}

module.exports = errorHandler;

