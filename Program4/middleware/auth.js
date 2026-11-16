/**
 * JWT Authentication Middleware
 * Validates Bearer tokens on protected REST API endpoints
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_key_buspass_roll14';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Missing "Authorization" header. Please provide a Bearer JWT token.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Access Denied: Malformed authorization header. Format should be: Bearer <token>'
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Authentication Error: JWT token has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Authentication Error: Invalid or tampered JWT token.'
    });
  }
}

module.exports = authenticateToken;

