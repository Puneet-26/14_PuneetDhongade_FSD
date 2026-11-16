/**
 * Central Error Handler for Program 5 Backend
 */

function errorHandler(err, req, res, next) {
  console.error('[BACKEND ERROR]:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: 'Database Validation Error',
      details: messages
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `Duplicate Entry: A record with that ${field} already exists.`
    });
  }

  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal Server Error',
    path: req.originalUrl
  });
}

module.exports = errorHandler;

