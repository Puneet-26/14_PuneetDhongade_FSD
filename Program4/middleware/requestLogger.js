/**
 * Custom Request Logging Middleware
 * Student Roll No. 14: Puneet Dhongade | Semester V
 */

function requestLogger(req, res, next) {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const { method, originalUrl, ip } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    const color =
      statusCode >= 500
        ? '\x1b[31m' // Red
        : statusCode >= 400
        ? '\x1b[33m' // Yellow
        : statusCode >= 300
        ? '\x1b[36m' // Cyan
        : '\x1b[32m'; // Green

    console.log(
      `[${timestamp}] ${color}${method}\x1b[0m ${originalUrl} -> ${color}${statusCode}\x1b[0m (${duration}ms) - IP: ${ip}`
    );
  });

  next();
}

module.exports = requestLogger;

